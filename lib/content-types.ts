export type SiteProfile = {
  name: string;
  nameEn: string;
  welcome: string;
  role: string;
  headline: string;
  statement: string;
  opportunityStatus: string;
  focusAreas: string[];
  resumeHref: string;
  email?: string;
  github: string;
};

export type Workstream = {
  id: "harness" | "skills" | "training" | "recommendation";
  title: string;
  summary: string;
  href: string;
  tone: "blue" | "cyan" | "amber" | "violet";
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
  tags: string[];
  publishedAt: string;
  readingMinutes: number;
  draft: boolean;
  body: string;
};

export type PostSummary = Omit<PostRecord, "body">;
