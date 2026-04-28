const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (['node_modules', '.git', '.next', 'public'].includes(file)) continue;
      replaceInDir(fullPath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let newContent = content
        .replace(/#e5c158/gi, '#e5c158')
        .replace(/rgba\(238,\s*73,\s*73/gi, 'rgba(229, 193, 88')
        .replace(/#e5c158/gi, '#e5c158'); // red.500 default hex

      if (file === 'colors.ts') {
        newContent = newContent.replace(/#FFF5F5/gi, '#e5c158')
                               .replace(/#FED7D7/gi, '#e5c158')
                               .replace(/#FEB2B2/gi, '#e5c158')
                               .replace(/#FC8181/gi, '#e5c158')
                               .replace(/#F56565/gi, '#e5c158')
                               .replace(/#C53030/gi, '#e5c158')
                               .replace(/#9B2C2C/gi, '#e5c158')
                               .replace(/#822727/gi, '#e5c158')
                               .replace(/#63171B/gi, '#e5c158');
      }

      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Replaced in ${fullPath}`);
      }
    }
  }
}

replaceInDir(__dirname);
