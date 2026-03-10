const fs = require('fs');
const path = require('path');

const PATTERNS = [
  { name: "Google API Key", regex: /AIza[0-9A-Za-z-_]{35}/ },
  { name: "OpenAI/Anthropic Key", regex: /\b(sk-[a-zA-Z0-9]{32,}|xox[baprs]-[a-zA-Z0-9]{10,})\b/ },
  { name: "Private Key (Hex 64)", regex: /\b[a-fA-F0-9]{64}\b/ },
  { name: "AWS Access Key", regex: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: "Bearer Token", regex: /Bearer [a-zA-Z0-9\-\._~\+\/]+=*/ },
  { name: "Hardcoded Absolute Path", regex: /(\/Users\/|\/home\/)[a-zA-Z0-9_\-\.\/]+/ },
];

const IGNORE_DIRS = ['node_modules', '.git', '.DS_Store'];

function scanFile(filePath) {
  const issues = [];
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      
      PATTERNS.forEach(p => {
        if (p.regex.test(line)) {
          // Truncate line for display if too long
          const displayLine = line.length > 100 ? line.substring(0, 100) + '...' : line;
          issues.push({
            type: p.name,
            line: lineNum,
            content: displayLine.trim()
          });
        }
      });
    });
  } catch (err) {
    issues.push({ type: "Read Error", line: 0, content: err.message });
  }
  return issues;
}

function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    if (IGNORE_DIRS.includes(file)) return;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function main() {
  const targetDir = process.argv[2];
  if (!targetDir) {
    console.error("Usage: node audit.js <path_to_skill_folder>");
    process.exit(1);
  }

  const resolvedPath = path.resolve(targetDir);
  console.log(`🔒 Starting Security Audit on: ${resolvedPath}\n`);

  if (!fs.existsSync(resolvedPath)) {
    console.error("Error: Target path does not exist.");
    process.exit(1);
  }

  const files = walkDir(resolvedPath);
  let totalIssues = 0;

  files.forEach(file => {
    const issues = scanFile(file);
    if (issues.length > 0) {
      console.log(`❌ ${path.relative(process.cwd(), file)}`);
      issues.forEach(issue => {
        console.log(`   Line ${issue.line} [${issue.type}]: ${issue.content}`);
      });
      console.log('');
      totalIssues += issues.length;
    }
  });

  if (totalIssues === 0) {
    console.log("✅ Audit Passed: No secrets or unsafe patterns found.");
  } else {
    console.log(`⚠️  Audit Failed: Found ${totalIssues} potential issues.`);
    process.exit(1); // Fail for CI/CD
  }
}

main();
