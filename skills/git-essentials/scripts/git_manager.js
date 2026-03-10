const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs');
const os = require('os');
const axios = require('axios');
require('dotenv').config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const AUTHOR = 'paperbuddha';

if (!GITHUB_TOKEN) {
  console.error("CRITICAL ERROR: GITHUB_TOKEN environment variable is missing.");
  process.exit(1);
}

// Ensure temp directory exists
const TEMP_DIR = path.join(os.tmpdir(), 'openclaw-git');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// --- CORE GIT HELPERS ---

async function cloneRepo(repoUrl) {
  const repoName = repoUrl.split('/').pop().replace('.git', '');
  const localPath = path.join(TEMP_DIR, repoName);
  
  if (fs.existsSync(localPath)) {
    console.log(`Repo already exists at ${localPath}, cleaning up...`);
    fs.rmSync(localPath, { recursive: true, force: true });
  }

  console.log(`Cloning ${repoUrl}...`);
  const git = simpleGit();
  
  try {
    await git.clone(repoUrl.replace('https://', `https://${GITHUB_TOKEN}@`), localPath);
  } catch (err) {
    const safeMsg = err.message.replace(/https:\/\/[^@]+@/g, 'https://***TOKEN***@');
    throw new Error(`Clone failed: ${safeMsg}`);
  }
  
  console.log("Clone complete.");
  return localPath;
}

async function createBranch(localPath, branchName) {
  const git = simpleGit(localPath);
  console.log(`Creating branch ${branchName}...`);
  await git.checkoutLocalBranch(branchName);
  console.log("Branch created.");
}

async function commitPush(localPath, message, branchName) {
  const git = simpleGit(localPath);
  console.log("Staging changes...");
  await git.add('.');
  console.log("Committing...");
  await git.commit(message);
  console.log("Pushing (Force)...");
  await git.push('origin', branchName, ['--force']);
  console.log("Push complete.");
}

async function createPR(repoUrl, branchName, title, body, upstreamRepo) {
  const match = repoUrl.match(/github\.com\/([^\/]+\/[^\/\.]+)/);
  if (!match) throw new Error("Invalid GitHub URL format. Expected github.com/owner/repo");
  const repoSlug = match[1].replace('.git', '');

  // If upstreamRepo is provided, target it; otherwise, target the cloned repo (repoSlug)
  const targetRepo = upstreamRepo || repoSlug;
  // Cross-repo PRs require the "owner:branch" format for the head parameter
  const head = upstreamRepo ? `${AUTHOR}:${branchName}` : branchName;

  console.log(`Creating PR on ${targetRepo} from ${head}...`);
  
  try {
    const res = await axios.post(
      `https://api.github.com/repos/${targetRepo}/pulls`,
      {
        title: title,
        body: body,
        head: head,
        base: 'main'
      },
      {
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
    console.log(`PR Created Successfully: ${res.data.html_url}`);
    return res.data.html_url;
  } catch (err) {
    if (err.config && err.config.headers && err.config.headers.Authorization) {
      err.config.headers.Authorization = 'Bearer ***TOKEN***';
    }
    const safeMsg = err.message.replace(GITHUB_TOKEN, '***TOKEN***');
    throw new Error(`PR Creation Failed: ${safeMsg}`);
  }
}

async function cleanup(localPath) {
  console.log(`Cleaning up ${localPath}...`);
  fs.rmSync(localPath, { recursive: true, force: true });
  console.log("Cleanup done.");
}

// --- FILE OPERATIONS ---

async function injectFile(localPath, filePath, content) {
  const fullPath = path.join(localPath, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  console.log(`Writing file to ${filePath}...`);
  fs.writeFileSync(fullPath, content);
}

// Recursively copy a folder
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// --- MAIN ---

async function main() {
  const command = process.argv[2];
  const repo = process.argv[3];
  
  try {
    switch (command) {
      case 'clone':
        const localPath = await cloneRepo(repo);
        console.log(`REPO_PATH:${localPath}`);
        break;
        
      case 'setup-pr':
        const branch = process.argv[4];
        const targetFile = process.argv[5];
        const contentPath = process.argv[6];
        const title = process.argv[7] || "Update from OpenClaw";
        const body = process.argv[8] || "Automated PR via OpenClaw Git-Essentials";
        
        if (!fs.existsSync(contentPath)) throw new Error("Content file not found");
        const content = fs.readFileSync(contentPath, 'utf8');
        
        const path2 = await cloneRepo(repo);
        await createBranch(path2, branch);
        await injectFile(path2, targetFile, content);
        await commitPush(path2, title, branch);
        await createPR(repo, branch, title, body);
        await cleanup(path2);
        break;

      case 'copy-folder':
        // Usage: node git_manager.js copy-folder <repo> <branch> <source_folder> <dest_path_in_repo> <commit_message> <pr_title> [pr_body] [upstream_repo]
        const branchCF = process.argv[4];
        const sourceFolder = process.argv[5];
        const destPath = process.argv[6];
        const commitMsg = process.argv[7];
        const prTitle = process.argv[8] || commitMsg;
        const prBody = process.argv[9] || "Automated Folder Copy PR";
        const upstreamRepo = process.argv[10]; // Optional 8th argument

        if (!fs.existsSync(sourceFolder)) throw new Error(`Source folder not found: ${sourceFolder}`);

        const path3 = await cloneRepo(repo);
        await createBranch(path3, branchCF);
        
        const fullDest = path.join(path3, destPath);
        console.log(`Copying ${sourceFolder} to ${fullDest}...`);
        
        // Ensure parent dir exists inside repo
        if (!fs.existsSync(path.dirname(fullDest))) fs.mkdirSync(path.dirname(fullDest), { recursive: true });
        
        // Use Node.js native recursive copy
        fs.cpSync(sourceFolder, fullDest, { recursive: true });
        
        await commitPush(path3, commitMsg, branchCF);
        await createPR(repo, branchCF, prTitle, prBody, upstreamRepo);
        await cleanup(path3);
        break;

      default:
        console.log("Usage: node git_manager.js [clone|setup-pr|copy-folder]");
    }
  } catch (err) {
    const safeErr = err.message.replace(new RegExp(GITHUB_TOKEN, 'g'), '***TOKEN***')
                             .replace(/https:\/\/[^@]+@/g, 'https://***TOKEN***@');
    console.error(`Git Operation Failed: ${safeErr}`);
    process.exit(1);
  }
}

main();
