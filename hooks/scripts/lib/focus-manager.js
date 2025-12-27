/**
 * focus-manager.js
 *
 * Shared library for reading and writing focus.json with atomic operations.
 * Used by all MindContext hook scripts.
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Find the project root by walking up the directory tree.
 * Looks for .project/context/ (MindContext), .git, or package.json.
 *
 * @param {string} cwd - Starting directory
 * @returns {string|null} - Project root path or null if not found
 */
function findProjectRoot(cwd) {
  let current = path.resolve(cwd);
  const root = path.parse(current).root;

  while (current !== root) {
    // Check for MindContext project structure (preferred)
    const projectContext = path.join(current, '.project', 'context');
    try {
      if (require('fs').statSync(projectContext).isDirectory()) {
        return current;
      }
    } catch {
      // Directory doesn't exist, continue searching
    }

    // Check for .git directory
    const gitDir = path.join(current, '.git');
    try {
      const stat = require('fs').statSync(gitDir);
      if (stat.isDirectory() || stat.isFile()) { // .git can be a file in worktrees
        return current;
      }
    } catch {
      // Not found, continue
    }

    // Check for package.json
    const packageJson = path.join(current, 'package.json');
    try {
      if (require('fs').statSync(packageJson).isFile()) {
        return current;
      }
    } catch {
      // Not found, continue
    }

    // Move up one directory
    current = path.dirname(current);
  }

  return null;
}

/**
 * Get the path to focus.json for a given project.
 *
 * @param {string} projectRoot - Project root directory
 * @returns {string} - Path to focus.json
 */
function getFocusPath(projectRoot) {
  return path.join(projectRoot, '.project', 'context', 'focus.json');
}

/**
 * Read focus.json from the project root.
 * Returns an empty object if the file doesn't exist or is invalid.
 *
 * @param {string} cwd - Starting directory (will find project root)
 * @returns {Promise<Object>} - Parsed focus.json content or empty object
 */
async function readFocus(cwd) {
  const projectRoot = findProjectRoot(cwd);

  if (!projectRoot) {
    // No project found, return empty object
    return {};
  }

  const focusPath = getFocusPath(projectRoot);

  try {
    const content = await fs.readFile(focusPath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // File doesn't exist, return empty object
      return {};
    }
    if (err instanceof SyntaxError) {
      // Invalid JSON, log warning and return empty object
      console.error(`Warning: Invalid JSON in ${focusPath}`);
      return {};
    }
    // Unexpected error, rethrow
    throw err;
  }
}

/**
 * Write focus.json atomically using temp file + rename pattern.
 * This prevents corruption from interrupted writes.
 *
 * @param {string} cwd - Starting directory (will find project root)
 * @param {Object} data - Data to write
 * @returns {Promise<void>}
 */
async function writeFocus(cwd, data) {
  const projectRoot = findProjectRoot(cwd);

  if (!projectRoot) {
    throw new Error('No project root found. Cannot write focus.json.');
  }

  const focusPath = getFocusPath(projectRoot);
  const focusDir = path.dirname(focusPath);
  const tempPath = path.join(focusDir, '.focus.json.tmp');

  // Ensure the directory exists
  await fs.mkdir(focusDir, { recursive: true });

  // Write to temp file first
  const content = JSON.stringify(data, null, 2) + '\n';
  await fs.writeFile(tempPath, content, 'utf-8');

  // Atomic rename
  await fs.rename(tempPath, focusPath);
}

/**
 * Update specific fields in focus.json without overwriting the entire file.
 * Reads current content, merges updates, and writes back atomically.
 *
 * @param {string} cwd - Starting directory
 * @param {Object} updates - Fields to update (shallow merge)
 * @returns {Promise<Object>} - Updated focus object
 */
async function updateFocus(cwd, updates) {
  const current = await readFocus(cwd);
  const updated = { ...current, ...updates };
  await writeFocus(cwd, updated);
  return updated;
}

/**
 * Update the last_updated timestamp in focus.json.
 *
 * @param {string} cwd - Starting directory
 * @returns {Promise<Object>} - Updated focus object
 */
async function touchFocus(cwd) {
  return updateFocus(cwd, {
    last_updated: new Date().toISOString()
  });
}

module.exports = {
  findProjectRoot,
  getFocusPath,
  readFocus,
  writeFocus,
  updateFocus,
  touchFocus
};
