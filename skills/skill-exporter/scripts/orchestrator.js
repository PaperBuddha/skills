const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const SKILLS_ROOT = path.resolve(__dirname, '../../..'); // workspace/skills
const TOOLS_ROOT = path.resolve(__dirname, '../../../skills'); // To find other skills
const TEMP_DIR = path.join(os.tmpdir(), 'skill-export');
const AUTHOR = 'paperbuddha';

// Paths to dependencies
const SECURITY_AUDIT_SCRIPT = path.join(TOOLS_ROOT, 'security-audit/scripts/audit.js');
const GIT_MANAGER_SCRIPT = path.join(TOOLS_ROOT, 'git-essentials/scripts/git_manager.js');

if (!fs.existsSync(SECURITY_AUDIT_SCRIPT) || !fs.existsSync(GIT_MANAGER_SCRIPT)) {
  console.error("Critical Error: Dependency skills (security-audit or git-essentials) are missing.");
  process.exit(1);
}

function runCommand(cmd) {
  try {
    return execSync(cmd, { stdio: 'pipe', encoding: 'utf-8' });
  } catch (err) {
    throw new Error(`Command failed: ${cmd}\n${err.stdout}\n${err.stderr}`);
  }
}

async function analyze(skillPath) {
  console.log(`\n🔍 Phase 1: Analyzing ${skillPath}...`);
  if (!fs.existsSync(path.join(skillPath, 'SKILL.md'))) throw new Error("Missing SKILL.md");
  
  // Check category/type for pricing later
  const skillContent = fs.readFileSync(path.join(skillPath, 'SKILL.md'), 'utf8');
  let type = 'utility';
  if (skillContent.includes('external API') || skillContent.includes('Integration')) type = 'integration';
  else if (skillContent.includes('Workflow') || skillContent.includes('Orchestrate')) type = 'workflow';
  
  return { type, name: path.basename(skillPath) };
}

async function sanitize(skillPath) {
  console.log(`\n🛡️ Phase 2: Security Sanitization...`);
  try {
    runCommand(`node "${SECURITY_AUDIT_SCRIPT}" "${skillPath}"`);
    console.log("Audit Passed.");
  } catch (err) {
    console.error("❌ SECURITY AUDIT FAILED. Publication halted.");
    console.error(err.message);
    process.exit(1); // HARD HALT
  }
}

async function packageSkill(skillPath, skillName) {
  console.log(`\n📦 Phase 3: Packaging...`);
  const stageDir = path.join(TEMP_DIR, skillName);
  
  // Clean temp
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });
  fs.mkdirSync(stageDir, { recursive: true });
  
  // Copy
  fs.copySync(skillPath, stageDir);
  
  // Clean up dev/test files if any
  fs.removeSync(path.join(stageDir, '.git'));
  fs.removeSync(path.join(stageDir, 'node_modules'));
  
  console.log(`Packaged to ${stageDir}`);
  return stageDir;
}

function suggestPrice(meta) {
  console.log(`\n💰 Phase 4: Pricing...`);
  let price = 5;
  if (meta.type === 'integration') price = 12;
  else if (meta.type === 'workflow') price = 8;
  
  console.log(`Detected Type: ${meta.type}`);
  console.log(`Suggested Price: $${price} USDC`);
  return price;
}

async function publish(stageDir, skillName) {
  console.log(`\n🚀 Phase 5: Publishing to Registry (Fork Flow)...`);
  
  // 1. Target MY fork for the push
  const forkRepo = `https://github.com/${AUTHOR}/skills.git`;
  const upstreamRepo = "openclaw/skills"; 
  
  const branch = `skill/${skillName}`;
  const destPath = `skills/${AUTHOR}/${skillName}`;
  const msg = `Add ${skillName} by ${AUTHOR}`;
  
  // 2. Push to FORK and open cross-repo PR
  const cmd = `node "${GIT_MANAGER_SCRIPT}" copy-folder "${forkRepo}" "${branch}" "${stageDir}" "${destPath}" "${msg}" "${msg}" "Automated submission by ${AUTHOR}" "${upstreamRepo}"`;
  
  console.log(`Executing Git-Essentials copy-folder on fork: ${forkRepo} (Upstream: ${upstreamRepo})...`);
  const output = runCommand(cmd);
  console.log(output);
}

async function listAwesome(skillName, desc) {
  console.log(`\n✨ Phase 6: Listing on Awesome Skills...`);
  console.log("⚠️ Skipping Awesome List update: Requires read-modify-write logic not yet supported by git-essentials v1.1.");
}

async function main() {
  const targetSkill = process.argv[2];
  if (!targetSkill) throw new Error("Usage: node orchestrator.js <path_to_skill> [--dry-run]");
  
  const DRY_RUN = process.argv.includes('--dry-run');
  const resolvedPath = path.resolve(targetSkill);
  
  try {
    const meta = await analyze(resolvedPath);
    await sanitize(resolvedPath);
    const stageDir = await packageSkill(resolvedPath, meta.name);
    suggestPrice(meta);
    
    if (!DRY_RUN) {
      console.log(`\n🚀 Executing Live Publish...`);
      await publish(stageDir, meta.name);
      // await listAwesome(meta.name, "Awesome skill description");
      console.log("\n✅ Pipeline Completed Successfully");
    } else {
      console.log("\n⚠️  DRY RUN: Skipping git publish/PR steps.");
      console.log("   (Pass without --dry-run to execute)");
    }
    
  } catch (err) {
    console.error(`\n❌ Pipeline Failed: ${err.message}`);
    process.exit(1);
  } finally {
    // Cleanup Temp
    if (fs.existsSync(TEMP_DIR)) {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
      console.log("\n🧹 Cleaned up temp directory.");
    }
  }
}

main();
