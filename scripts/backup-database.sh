#!/bin/bash

# PostgreSQL Database Backup Script
# This script creates a nightly backup of the LIMS database
# Should be run as a cron job (e.g., 0 2 * * * - daily at 2 AM)

set -e

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./backups/database}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/lims_backup_${TIMESTAMP}.sql.gz"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "Starting database backup..."
echo "Backup file: $BACKUP_FILE"

# Extract database connection details from DATABASE_URL
# Format: postgresql://user:password@host:port/database
DB_URL="${DATABASE_URL}"

# Perform backup using pg_dump
# Note: pg_dump reads PGPASSWORD from environment
if pg_dump "$DB_URL" | gzip > "$BACKUP_FILE"; then
    echo "Database backup completed successfully"
    echo "Backup size: $(du -h "$BACKUP_FILE" | cut -f1)"
    
    # Remove old backups
    echo "Removing backups older than ${RETENTION_DAYS} days..."
    find "$BACKUP_DIR" -name "lims_backup_*.sql.gz" -mtime +${RETENTION_DAYS} -delete
    
    echo "Backup process completed"
else
    echo "ERROR: Database backup failed!" >&2
    exit 1
fi
