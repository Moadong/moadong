const fs = require('fs');
const path = require('path');

const walkDir = (dir, callback) => {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else if (f.endsWith('.ts') || f.endsWith('.tsx')) {
      callback(path.join(dir, f));
    }
  });
};

const fixUnusedVars = (filePath) => {
  let originalContent = fs.readFileSync(filePath, 'utf8');
  let content = originalContent;

  // Fix `catch (_error)` to `catch {}`
  content = content.replace(/catch\s*\(\s*_[a-zA-Z0-9]+\s*\)\s*{/g, 'catch {');

  // Existing unused var fixes (keeping for now, as they target specific patterns)
  // These are for specific variables, not the general `catch (_var)` pattern.
  content = content.replace(/catch \(error\)/g, 'catch (_error)');
  content = content.replace(/catch \(parseError\)/g, 'catch (_parseError)');
  content = content.replace(/onError: \(error\)/g, 'onError: (_error)');
  content = content.replace(/eventName, error/g, 'eventName, _error');
  content = content.replace(/detail: \$\{error\}/g, 'detail: ${_error}');
  content = content.replace(/application: \$\{error\}/g, 'application: ${_error}');
  content = content.replace(/PARSING ERROR:', parseError/g, "PARSING ERROR:', _parseError");
  content = content.replace(/description:', error/g, "description:', _error");
  content = content.replace(/status:', error/g, "status:', _error");


  // Improved console statement removal:
  // This regex will match console.log/error/warn statements, including their arguments,
  // even if they span multiple lines. It tries to be as non-greedy as possible.
  // The `s` flag allows `.` to match newlines.
  // The `m` flag allows `^` and `$` to match start/end of lines.
  // This version attempts to remove the entire `console.log(...)` statement,
  // including potential multiline arguments.
  // It specifically looks for a closing parenthesis and an optional semicolon.
  content = content.replace(/^[ \t]*(console\.(?:log|error|warn|info|debug)\s*\([^)]*\)[;]?)\s*$/gms, '');


  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${filePath}`);
  }
};

walkDir('/root/.openclaw/workspace/moadong/frontend/src', fixUnusedVars);
