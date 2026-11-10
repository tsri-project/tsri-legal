-- Cloudflare D1 Database Schema for TSRI Legal & Competency Intelligence Portal
-- โครงการวิจัย PRJ-TSRI-2569-001 (TOR-PROJ-001-2569)

DROP TABLE IF EXISTS documents;
CREATE TABLE documents (
  seq INTEGER PRIMARY KEY,
  tsri_f TEXT NOT NULL UNIQUE,
  doc_id TEXT NOT NULL,
  n_code TEXT,
  cat_num INTEGER NOT NULL,
  cat_label TEXT NOT NULL,
  file_name TEXT NOT NULL,
  formal_title TEXT NOT NULL,
  tor_level TEXT NOT NULL,
  clusters TEXT NOT NULL,
  owner_bureau TEXT NOT NULL,
  legal_basis TEXT NOT NULL,
  key_provisions TEXT NOT NULL,
  pages INTEGER DEFAULT 1,
  sha256 TEXT,
  status TEXT NOT NULL,
  is_active INTEGER DEFAULT 1,
  url TEXT NOT NULL
);

CREATE INDEX idx_documents_cat ON documents(cat_num);
CREATE INDEX idx_documents_clusters ON documents(clusters);
CREATE INDEX idx_documents_tsri_f ON documents(tsri_f);

DROP TABLE IF EXISTS crosslist_items;
CREATE TABLE crosslist_items (
  cl_code TEXT PRIMARY KEY,
  cluster TEXT NOT NULL,
  owner TEXT NOT NULL,
  phase1_2_legal TEXT NOT NULL,
  phase3_c1_c2_a TEXT NOT NULL,
  phase3_tools TEXT NOT NULL,
  phase4_media_exam TEXT NOT NULL,
  status TEXT NOT NULL,
  url TEXT NOT NULL
);

DROP TABLE IF EXISTS interview_questions;
CREATE TABLE interview_questions (
  q_code TEXT PRIMARY KEY,
  instrument_group TEXT NOT NULL,
  target_role TEXT NOT NULL,
  question_text TEXT NOT NULL,
  legal_plugin TEXT NOT NULL,
  dim_d1_d5 TEXT NOT NULL,
  c1_c2_a_rubric TEXT NOT NULL,
  gap_rule TEXT NOT NULL
);

DROP TABLE IF EXISTS learning_clips;
CREATE TABLE learning_clips (
  clip_no INTEGER PRIMARY KEY,
  clip_code TEXT NOT NULL UNIQUE,
  cluster TEXT NOT NULL,
  target_role TEXT NOT NULL,
  ratio TEXT NOT NULL,
  format_duration TEXT NOT NULL,
  title TEXT NOT NULL,
  learning_objective TEXT NOT NULL,
  storyboard TEXT NOT NULL,
  linked_docs TEXT NOT NULL,
  exam_link TEXT NOT NULL
);

DROP TABLE IF EXISTS exam_items;
CREATE TABLE exam_items (
  item_id TEXT PRIMARY KEY,
  cluster_clip TEXT NOT NULL,
  target_role TEXT NOT NULL,
  scenario_stem TEXT NOT NULL,
  options TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  rationale_30_70 TEXT NOT NULL
);

DROP TABLE IF EXISTS c1c2a_evaluations;
CREATE TABLE c1c2a_evaluations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  q_code TEXT NOT NULL,
  c1_status TEXT NOT NULL,
  c2_status TEXT NOT NULL,
  a_status TEXT NOT NULL,
  gap_type TEXT NOT NULL,
  evidence_note TEXT,
  evaluated_at TEXT NOT NULL
);
