const fs = require('fs');
const s = fs.readFileSync('public/icons/sprite.b6f26f13.svg', 'utf8');
const match = s.match(/id="navigation([^"]*?tokens[^"]*?)"/);
if (match) {
    console.log("Found:", match[0]);
    console.log("Chars:", Array.from(match[1]).map(c => c.charCodeAt(0)));
} else {
    console.log("Not found");
}
