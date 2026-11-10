/**
 * Cloudflare Pages Function / Worker Backend (Hono + D1 + Workers AI + Vectorize)
 * โครงการวิจัย PRJ-TSRI-2569-001 (TOR-PROJ-001-2569)
 * Routes:
 * - GET  /api/health
 * - GET  /api/documents?category=&cluster=&role=&q=
 * - GET  /api/crosslist?cluster=
 * - GET  /api/field-tools
 * - GET  /api/learning
 * - POST /api/ai/query   (RAG with Cloudflare D1 + Vectorize + Workers AI @cf/meta/llama-3.1-8b-instruct)
 * - POST /api/evaluate-c1c2a
 */
import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';

type Bindings = {
  DB: D1Database;
  AI: any;
  VECTORIZE_INDEX: any;
  PROJECT_CODE: string;
  TOR_REFERENCE: string;
  DRIVE_ROOT_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>().basePath('/api');

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    project: c.env.PROJECT_CODE || 'PRJ-TSRI-2569-001',
    tor: c.env.TOR_REFERENCE || 'TOR-PROJ-001-2569',
    version: "6.0.0",
    progressRange: "75-80% (G1 80% / Awaiting G2 Legal Advisor Sign-off 75%)",
    categories: 12,
    repositoryFiles: 103,
    registeredCodes: 104,
    multiLevelChains: 24,
    clusters: 9,
    crossListItems: 15,
    engine: 'Cloudflare Pages Functions + D1 + Workers AI',
  });
});

// 1. Search Documents in Cloudflare D1
app.get('/documents', async (c) => {
  const category = c.req.query('category');
  const cluster = c.req.query('cluster');
  const q = c.req.query('q');

  let sql = 'SELECT * FROM documents WHERE 1=1';
  const params: any[] = [];

  if (category && category !== 'ALL') {
    sql += ' AND cat_num = ?';
    params.push(Number(category));
  }
  if (cluster && cluster !== 'ALL') {
    sql += ' AND clusters LIKE ?';
    params.push(`%${cluster}%`);
  }
  if (q) {
    sql += ' AND (tsri_f LIKE ? OR doc_id LIKE ? OR formal_title LIKE ? OR key_provisions LIKE ? OR legal_basis LIKE ?)';
    const pat = `%${q}%`;
    params.push(pat, pat, pat, pat, pat);
  }
  sql += ' ORDER BY seq ASC';

  const { results } = await c.env.DB.prepare(sql).bind(...params).all();
  return c.json({ count: results.length, results });
});

// 2. Get Cross-List 15 Items from D1
app.get('/crosslist', async (c) => {
  const cluster = c.req.query('cluster');
  let sql = 'SELECT * FROM crosslist_items';
  const params: any[] = [];
  if (cluster && cluster !== 'ALL') {
    sql += ' WHERE cluster LIKE ?';
    params.push(`%${cluster}%`);
  }
  sql += ' ORDER BY cl_code ASC';
  const { results } = await c.env.DB.prepare(sql).bind(...params).all();
  return c.json({ count: results.length, results });
});

// 2b. Get 24 Multi-Level Legal Linkage Chains from D1
app.get('/chains24', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM legal_chains_24 ORDER BY chain_id ASC'
  ).all();
  return c.json({ count: results.length, results });
});

// 3. AI Legal RAG Assistant powered by Cloudflare Workers AI + D1
app.post('/ai/query', async (c) => {
  const body = await c.req.json<{ query: string; roleTier?: string; ratio?: string }>();
  const userQuery = (body.query || '').trim();
  const roleTier = body.roleTier || 'ALL';
  const ratio = body.ratio || '30:70';

  if (!userQuery) {
    return c.json({ error: 'กรุณาระบุคำถามข้อกฎหมายหรือกระบวนงาน' }, 400);
  }

  // Retrieve top matching legal documents from D1
  const pat = `%${userQuery}%`;
  const { results: matchedDocs } = await c.env.DB.prepare(
    `SELECT tsri_f, doc_id, formal_title, legal_basis, key_provisions, url
     FROM documents
     WHERE formal_title LIKE ? OR key_provisions LIKE ? OR legal_basis LIKE ? OR tsri_f LIKE ?
     LIMIT 6`
  )
    .bind(pat, pat, pat, pat)
    .all();

  const contextBlock = matchedDocs
    .map(
      (d: any) =>
        `[${d.tsri_f} / ${d.doc_id}] ${d.formal_title}\n- ฐานอำนาจ: ${d.legal_basis}\n- สาระสำคัญ: ${d.key_provisions}\n- ลิงก์: ${d.url}`
    )
    .join('\n\n');

  const systemPrompt = `คุณคือระบบ AI ผู้ช่วยสืบค้นและวินิจฉัยข้อกฎหมายของสำนักงานคณะกรรมการส่งเสริมวิทยาศาสตร์ วิจัยและนวัตกรรม (สกสว.) ภายใต้โครงการ PRJ-TSRI-2569-001
ผู้ใช้งานอยู่ในกลุ่มระดับ: ${roleTier} (สัดส่วนความรู้ กฎหมายแม่บท : กฎรอง/คู่มือ/SOP = ${ratio})
กฎเหล็ก:
1. ตอบโดยอ้างอิงฐานอำนาจตามกฎหมาย 3 ระดับ (พ.ร.บ.สภานโยบายฯ พ.ศ. 2562, พ.ร.บ.การส่งเสริม ววน. พ.ศ. 2562, พ.ร.บ.ส่งเสริมการใช้ประโยชน์ฯ พ.ศ. 2564 และกฎรอง/คู่มือ/SOP ในคลังข้อมูล 100 ไฟล์)
2. ระบุรหัสเอกสาร TSRI-F และมาตราที่เกี่ยวข้องอย่างชัดเจน
3. แยกแยะขอบเขตอำนาจระหว่าง สภานโยบายฯ, กสว. (ม.44), อนก.สกสว. (ม.47) และผู้อำนวยการ สกสว. (ม.50) รวมถึงการแยกเงินสำนักงาน (ม.45) ออกจากเงินกองทุน ววน. (ม.55)

บริบทจากฐานข้อมูล D1:
${contextBlock || 'ใช้หลักเกณฑ์มาตรฐานตามคลังข้อมูลกฎหมาย สกสว. 11 หมวด'}`;

  let aiAnswer = '';
  if (c.env.AI) {
    const response = await c.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userQuery },
      ],
      temperature: 0.2,
      max_tokens: 1024,
    });
    aiAnswer = response.response;
  } else {
    aiAnswer = `สรุปผลการค้นหาจากฐานข้อมูล D1 สำหรับ "${userQuery}" (โหมด ${roleTier} สัดส่วน ${ratio}):\n\n${contextBlock}`;
  }

  return c.json({
    query: userQuery,
    roleTier,
    ratio,
    answer: aiAnswer,
    citations: matchedDocs,
  });
});

// 4. Save Phase 3 C1 / C2 / A Field Evaluation Record to D1
app.post('/evaluate-c1c2a', async (c) => {
  const body = await c.req.json<{
    q_code: string;
    c1_status: string;
    c2_status: string;
    a_status: string;
    gap_type: string;
    evidence_note: string;
  }>();

  await c.env.DB.prepare(
    `INSERT INTO c1c2a_evaluations (q_code, c1_status, c2_status, a_status, gap_type, evidence_note, evaluated_at)
     VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`
  )
    .bind(
      body.q_code,
      body.c1_status,
      body.c2_status,
      body.a_status,
      body.gap_type,
      body.evidence_note || ''
    )
    .run();

  return c.json({ status: 'saved', q_code: body.q_code });
});

export const onRequest = handle(app);
