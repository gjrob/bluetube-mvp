#!/bin/bash

# === CONFIG ===
SOURCE_DIR="./"
BACKUP_DIR="./backup_anchors_$(date +"%Y%m%d_%H%M%S")"
TARGET_DIRS=("pages" "components")

# === BACKUP ===
echo "🛡️  Backing up source files to $BACKUP_DIR..."
mkdir -p "$BACKUP_DIR"
rsync -av --exclude 'backup_anchors_*' ./ "$BACKUP_DIR"

# === CLEAN <a> TAGS ===
echo "🔍 Cleaning <a> tags in: ${TARGET_DIRS[*]}"

for DIR in "${TARGET_DIRS[@]}"; do
  echo "📂 Scanning $DIR..."
  find "$DIR" -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) | while read -r file; do
    echo "   ✏️  Rewriting $file"

    # Replace <a href="..."> with <Link href="..."><span>
    sed -i '' -E 's|<a href="([^"]+)"([^>]*)>|<Link href="\1"><span\2>|g' "$file"

    # Replace closing </a> with </span></Link>
    sed -i '' 's|</a>|</span></Link>|g' "$file"
  done
done

echo "✅ Done! Backup stored at: $BACKUP_DIR"
