export type SiteProfile = {
  name: string;
  nameEn: string;
  role: string;
  headline: string;
  statement: string;
  resumeHref: string;
  email?: string;
  github?: string;
};

export type ProjectRecord = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  role: string;
  period: string;
  tags: string[];
  outcomes: string[];
  order: number;
  body: string;
};

export type PostRecord = {
  slug: string;
  title: string;
  summary: string;
  topic: string;
  publishedAt: string;
  readingMinutes: number;
  draft: boolean;
  body: string;
};
