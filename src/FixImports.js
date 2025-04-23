import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = __dirname;
const codeExts = [".js", ".jsx", ".ts", ".tsx"];
const allExts = codeExts.concat([".css"]);

// Recursively get all files with given extensions
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else if (allExts.includes(path.extname(fullPath))) {
      fileList.push(fullPath);
    }
  });
  return fileList;
}

// Find all import statements with relative paths
function findImportLines(content) {
  // Handles: import ... from '...'; and import '...';
  const importRegex =
    /^(import\s.*?from\s+['"](\.\/|\.\.\/)[^'"]+['"];?|import\s+['"](\.\/|\.\.\/)[^'"]+['"];?)/gm;
  let match,
    results = [];
  while ((match = importRegex.exec(content)) !== null) {
    results.push({
      line: match[0],
      index: match.index,
    });
  }
  return results;
}

// Given an import path and file location, compute the new relative path
function getNewRelativeImportPath(importPath, fromFile, srcDir) {
  // Resolve the absolute path of the imported file
  let absFrom = path.dirname(fromFile);
  let absImport;
  // Remove quotes and possible extension
  let cleaned = importPath.replace(/^['"]|['"]$/g, "");
  let importFull = path.resolve(absFrom, cleaned);

  // Try to find the actual file (with or without extension/index)
  let found = null;
  for (let ext of allExts.concat([""])) {
    if (fs.existsSync(importFull + ext)) {
      found = importFull + ext;
      break;
    }
    if (fs.existsSync(path.join(importFull, "index" + ext))) {
      found = path.join(importFull, "index" + ext);
      break;
    }
  }
  if (!found) {
    // If not found, return original
    return importPath;
  }
  // Compute new relative path from current file to found file
  let rel = path.relative(absFrom, found);
  if (!rel.startsWith(".")) rel = "./" + rel;
  // Remove src/ prefix if present
  if (rel.startsWith("src" + path.sep)) rel = rel.slice(4);
  // Normalize to posix for imports
  rel = rel.split(path.sep).join("/");
  // Remove extension for import if it's a code file, but keep .css
  for (let ext of codeExts) {
    if (rel.endsWith(ext)) rel = rel.slice(0, -ext.length);
  }
  return rel;
}

function processFile(filePath, srcDir) {
  let content = fs.readFileSync(filePath, "utf8");
  let importLines = findImportLines(content);
  if (importLines.length === 0) return false;

  let changed = false;
  let newContent = content;
  let changes = [];

  importLines.forEach(({ line }) => {
    // Extract the import path (with quotes)
    let pathMatch = line.match(/(['"])(\.\/|\.\.\/[^'"]*)\1/);
    if (!pathMatch) return;
    let oldImportPathWithQuotes = pathMatch[0]; // e.g. "../supabaseClient"
    let oldImportPath = pathMatch[2]; // e.g. ../supabaseClient
    let newImportPath = getNewRelativeImportPath(
      oldImportPath,
      filePath,
      srcDir
    );
    let newImportPathWithQuotes = pathMatch[1] + newImportPath + pathMatch[1];
    if (newImportPath !== oldImportPath) {
      let newLine = line.replace(
        oldImportPathWithQuotes,
        newImportPathWithQuotes
      );
      newContent = newContent.replace(line, newLine);
      changes.push({ before: line, after: newLine });
      changed = true;
    }
  });

  if (changed) {
    // Backup
    fs.copyFileSync(filePath, filePath + ".bak");
    fs.writeFileSync(filePath, newContent, "utf8");
    console.log(`Modified: ${path.relative(process.cwd(), filePath)}`);
    changes.forEach(({ before, after }) => {
      console.log(
        `  - import changed:\n    BEFORE: ${before}\n    AFTER:  ${after}`
      );
    });
  }
  return changed;
}

// MAIN
(function main() {
  const allFiles = getAllFiles(SRC_DIR);
  allFiles.forEach((file) => {
    processFile(file, SRC_DIR);
  });
})();
