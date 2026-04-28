const fs = require('fs');
const s = fs.readFileSync('public/icons/sprite.b6f26f13.svg', 'utf8');
const match = [...s.matchAll(/id="([^"]*?token[^"]*?)"/g)];
for (const m of match) {
    console.log("Found ID:", m[1]);
    console.log("Chars:", Array.from(m[1]).map(c => c.charCodeAt(0)));
}
