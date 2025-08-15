#!/bin/bash

if [ -z "$1" ]; then
    echo "Usage: ./restore-backup.sh BACKUP_DIRECTORY"
    echo "Available backups:"
    ls -d BACKUP_* 2>/dev/null
    exit 1
fi

BACKUP_DIR=$1

if [ ! -d "$BACKUP_DIR" ]; then
    echo "❌ Backup directory not found: $BACKUP_DIR"
    exit 1
fi

echo "🔄 Restoring from $BACKUP_DIR"
echo "================================"
echo "⚠️  This will overwrite current files!"
read -p "Are you sure? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Cancelled."
    exit 0
fi

# Restore files
echo "Restoring API..."
cp -r "$BACKUP_DIR/api-complete/"* pages/api/ 2>/dev/null

echo "Restoring Components..."
cp -r "$BACKUP_DIR/components-complete/"* components/ 2>/dev/null

echo "Restoring Libraries..."
cp -r "$BACKUP_DIR/lib-complete/"* lib/ 2>/dev/null

echo "Restoring Config..."
cp "$BACKUP_DIR/.env.local" . 2>/dev/null
cp "$BACKUP_DIR/next.config.js" . 2>/dev/null
cp "$BACKUP_DIR/package.json" . 2>/dev/null

echo "✅ Restore complete!"
echo "Run 'npm install' if package.json was changed"
