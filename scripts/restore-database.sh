#!/bin/bash

# Database Restore Script
# Restores a PostgreSQL database backup

set -e

if [ $# -eq 0 ]; then
    echo "Usage: $0 <backup-file.sql.gz>"
    echo "Example: $0 ./backups/database/lims_backup_20240101_020000.sql.gz"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "ERROR: Backup file not found: $BACKUP_FILE" >&2
    exit 1
fi

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

echo "⚠️  WARNING: This will restore the database from backup."
echo "Backup file: $BACKUP_FILE"
echo "Database: $DATABASE_URL"
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
fi

echo "Starting database restore..."

# Decompress and restore
if gunzip -c "$BACKUP_FILE" | psql "$DATABASE_URL"; then
    echo "Database restore completed successfully"
else
    echo "ERROR: Database restore failed!" >&2
    exit 1
fi
