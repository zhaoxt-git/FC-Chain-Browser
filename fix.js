const fs = require('fs');
const path = require('path');

try {
    const src = path.join(__dirname, 'public/icons/sprite.b6f26f13.svg');
    const dest = path.join(__dirname, 'public/icons/sprite.fixed_v2.svg');
    
    let content = fs.readFileSync(src, 'utf8');
    content = content.replace(/id="([^"]+)\\\\([^"]+)"/g, 'id="$1/$2"');
    fs.writeFileSync(dest, content);
    
    let envs = fs.readFileSync(path.join(__dirname, 'public/assets/envs.js'), 'utf8');
    envs = envs.replace('NEXT_PUBLIC_ICON_SPRITE_HASH: "b6f26f13"', 'NEXT_PUBLIC_ICON_SPRITE_HASH: "fixed_v2"');
    fs.writeFileSync(path.join(__dirname, 'public/assets/envs.js'), envs);
    
    console.log("Successfully created fixed_v2.svg and updated envs.js");
} catch (e) {
    console.error("Failed:", e);
}
