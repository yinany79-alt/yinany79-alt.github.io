import fs from "node:fs";
import path from "node:path";

const output = path.join(process.cwd(), "dist", "client");
const requiredPaths = [
  "index.html",
  "projects.html",
  "projects/agent-harness.html",
  "projects/llm-training-flow.html",
  "projects/generative-recommendation.html",
  "writing.html",
  "writing/generative-recommendation-infra.html",
  "writing/harness-is-a-system.html",
  "writing/llm-training-product-model.html",
  "resume.html",
  "resume/yang-yinan-resume.pdf",
  "about.html",
];
for (const relativePath of requiredPaths) {
  if (!fs.existsSync(path.join(output, relativePath))) throw new Error(`构建产物缺失：${relativePath}`);
}
console.log(`构建校验通过：${requiredPaths.length} 个关键产物存在。`);
