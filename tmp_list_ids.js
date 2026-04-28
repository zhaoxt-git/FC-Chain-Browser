const fs = require('fs'); 
const s = fs.readFileSync('public/icons/sprite.fixed_v2.svg', 'utf8'); 
const matches = [...s.matchAll(/id="([^"]+)"/g)].map(m => m[1]); 
console.log(matches.filter(id => id.includes('navigation') || id.includes('token')));
