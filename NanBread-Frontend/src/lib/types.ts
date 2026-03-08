export type Source = 'reddit' | 'youtube' | 'twitter' | 'amazon';

export interface StreamedUrl {
  source: Source;
  url: string;
}

export interface StreamedComment {
  comment: string;
  source: Source;
}

export interface ReportSection {
  title: string;
  sentiment: 'positive' | 'negative' | 'mixed';
  paragraphs: { text: string; references: string[] }[];
}

export interface ReportPro {
  point: string;
  references: string[];
}

export interface ReportCon {
  point: string;
  references: string[];
}

export interface Reference {
  platform: Source;
  url: string;
  thread_title: string;
}

export interface Report {
  product: string;
  summary: {
    verdict: string;
    confidence_score: number;
  };
  sections: ReportSection[];
  pros: ReportPro[];
  cons: ReportCon[];
  references: Record<string, Reference>;
}

export type Phase =
  | 'idle'
  | 'prethinking'
  | 'urls'
  | 'comments'
  | 'postthinking'
  | 'report'
  | 'done';

export interface LogEntry {
  id: string;
  type: 'prethinking' | 'url' | 'comment' | 'postthinking' | 'system';
  source?: Source;
  text: string;
  timestamp: number;
}
