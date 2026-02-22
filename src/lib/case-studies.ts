import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  date: string;
  description: string;
  challenge: string;
  outcome: string;
  tech: string[];
  content: string;
}

const caseStudyDir = path.join(process.cwd(), "src/content/case-studies");

function parseCaseStudy(slug: string, filePath: string): CaseStudy {
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const rawDate = data.date;
  const date =
    rawDate instanceof Date
      ? rawDate.toISOString().split("T")[0]
      : (rawDate ?? "1970-01-01");

  return {
    slug,
    title: data.title ?? slug,
    client: data.client ?? "",
    date,
    description: data.description ?? "",
    challenge: data.challenge ?? "",
    outcome: data.outcome ?? "",
    tech: data.tech ?? [],
    content,
  };
}

export function getAllCaseStudies(): CaseStudy[] {
  if (!fs.existsSync(caseStudyDir)) return [];

  const files = fs
    .readdirSync(caseStudyDir)
    .filter((f) => f.endsWith(".mdx"));

  const studies = files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, "");
    const filePath = path.join(caseStudyDir, filename);
    return parseCaseStudy(slug, filePath);
  });

  return studies.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  if (slug.includes("/") || slug.includes("\\") || slug.includes("..")) {
    return undefined;
  }
  const filePath = path.join(caseStudyDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;

  return parseCaseStudy(slug, filePath);
}
