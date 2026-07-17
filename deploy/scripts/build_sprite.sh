#!/bin/bash

icons_dir="./icons"
target_dir="./public/icons"

# 强制非交互模式运行
echo "y" | CI=true yarn icons build -i $icons_dir -o $target_dir --optimize

# Windows path fix: normalize path separators/control chars in IDs to flat strings
# that match IconSvg's runtime lookup, e.g. "navigation/transactions" -> "navigationtransactions".
cat << 'EOF' > "$target_dir/fix_sprite_ids.js"
const fs = require('fs');
const spritePath = process.argv[2];
const iconNamesPath = process.argv[3];
let s = fs.readFileSync(spritePath, 'utf8');
s = s.replace(/id="([\s\S]*?)"/g, (match, id) => {
    const cleaned = id
        .replace(/\r/g, 'r')
        .replace(/\n/g, 'n')
        .replace(/\t/g, 't')
        .replace(/[/\\\s]/g, '');
    return `id="${cleaned}"`;
});
fs.writeFileSync(spritePath, s);

if (fs.existsSync(iconNamesPath)) {
    const names = fs.readFileSync(iconNamesPath, 'utf8').replace(/\\\\/g, '/');
    fs.writeFileSync(iconNamesPath, names);
}
EOF
node "$target_dir/fix_sprite_ids.js" "$target_dir/sprite.svg" "$target_dir/name.d.ts"
rm -f "$target_dir/fix_sprite_ids.js"


create_registry_file() {
    # Create a temporary file to store the registry
    local registry_file="$target_dir/registry.json"
    
    # Start the JSON array
    echo "[]" > "$registry_file"
    
    # Detect OS and set appropriate stat command
    get_file_size() {
        local file="$1"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            stat -f%z "$file"
        else
            # Linux and others
            stat -c%s "$file"
        fi
    }
    
    # Function to process each file
    process_file() {
        local file="$1"
        local relative_path="${file#$icons_dir/}"
        local file_size=$(get_file_size "$file")
        
        # Create a temporary file with the new entry
        jq --arg name "$relative_path" --arg size "$file_size" \
           '. + [{"name": $name, "file_size": ($size|tonumber)}]' \
           "$registry_file" > "${registry_file}.tmp"
        
        # Move the temporary file back
        mv "${registry_file}.tmp" "$registry_file"
    }
    
    # Find all SVG files and process them
    find "$icons_dir" -type f -name "*.svg" | while read -r file; do
        process_file "$file"
    done
}

# Skip hash creation and renaming for playwright environment
if [ "$NEXT_PUBLIC_APP_ENV" != "pw" ]; then
    # Generate hash from the sprite file
    HASH=$(md5sum $target_dir/sprite.svg | cut -d' ' -f1 | head -c 8)

    # Remove old sprite files
    rm -f $target_dir/sprite.*.svg

    # Rename the new sprite file
    mv $target_dir/sprite.svg "$target_dir/sprite.${HASH}.svg"

    export NEXT_PUBLIC_ICON_SPRITE_HASH=${HASH}

    # Skip registry creation in development environment
    # just to make the dev build faster
    # remove this condition if you want to create the registry file in development environment
    if [ "$NEXT_PUBLIC_APP_ENV" != "development" ]; then
        create_registry_file
    fi

    echo "SVG sprite created: sprite.${HASH}.svg"
else
    echo "SVG sprite created: sprite.svg (hash skipped for playwright environment)"
fi
