const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}
const files = walk(path.join(__dirname, 'src'));
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  content = content.replace(/from\s+['"](\.[^'"]+)['"]/g, (match, p1) => {
    if (p1.endsWith('.js')) return match;
    changed = true;
    return `from '${p1}.js'`;
  });
  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
