#!/bin/bash

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="${BACKUP_DIR:-./backups}"
DB_NAME="${DATABASE_NAME:-topsmile}"
MONGO_URI="${DATABASE_URL:-mongodb://localhost:27017}"

mkdir -p "$BACKUP_DIR"

mongodump --uri="$MONGO_URI" --db="$DB_NAME" --out="$BACKUP_DIR/backup_$TIMESTAMP"

find "$BACKUP_DIR" -type d -mtime +7 -exec rm -rf {} +

echo "Backup completed: $BACKUP_DIR/backup_$TIMESTAMP"
