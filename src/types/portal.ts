import { MASTER_BUNDLE } from '../data/tsriDatabase';

export type SoftFocusTheme = 'sunny' | 'lavender';

export type PortalTabId =
  | 'dashboard'
  | 'repository'
  | 'clusters'
  | 'ai'
  | 'phase3'
  | 'phase4'
  | 'dev';

export type RoleTier = (typeof MASTER_BUNDLE)['roleTiers'][number];
export type LegalDocument = (typeof MASTER_BUNDLE)['documents101'][number];
export type StatutorySection = (typeof MASTER_BUNDLE)['statutorySections'][number];
export type CrossListItem = (typeof MASTER_BUNDLE)['crossList15'][number];
export type InterviewQuestion = (typeof MASTER_BUNDLE)['interviewQuestions32'][number];
export type VideoClipItem = (typeof MASTER_BUNDLE)['clips15'][number];
export type ExamItem = (typeof MASTER_BUNDLE)['examItems15'][number];
export type LegalChain24 = (typeof MASTER_BUNDLE)['chains24'][number];
export type TorLevel3 = (typeof MASTER_BUNDLE)['torLevels3'][number];
export type TorDeliverable6 = (typeof MASTER_BUNDLE)['torDeliverables6'][number];

export type C1C2ARating = {
  C1: string;
  C2: string;
  A: string;
  gap?: string;
};

export type AiMessage =
  | { role: 'user'; text: string }
  | {
      role: 'assistant';
      title: string;
      statutory_basis: string;
      operational_rule: string;
      checklist?: string[];
      docs?: string[];
    };

