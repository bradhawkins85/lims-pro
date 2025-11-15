#!/bin/bash

# MinIO Object Storage Backup Script
# This script backs up all files from MinIO object storage
# Should be run as a cron job (e.g., 0 3 * * * - daily at 3 AM)

set -e

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./backups/storage}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/minio_backup_${TIMESTAMP}.tar.gz"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "Starting MinIO object storage backup..."
echo "Backup file: $BACKUP_FILE"

# MinIO configuration from environment
MINIO_ENDPOINT="${MINIO_ENDPOINT:-localhost}"
MINIO_PORT="${MINIO_PORT:-9000}"
MINIO_ACCESS_KEY="${MINIO_ACCESS_KEY}"
MINIO_SECRET_KEY="${MINIO_SECRET_KEY}"
MINIO_BUCKET="${MINIO_BUCKET_NAME:-lims-files}"
MINIO_USE_SSL="${MINIO_USE_SSL:-false}"

# Set protocol based on SSL setting
if [ "$MINIO_USE_SSL" = "true" ]; then
    PROTOCOL="https"
else
    PROTOCOL="http"
fi

# Temporary directory for downloading files
TEMP_DIR="${BACKUP_DIR}/temp_${TIMESTAMP}"
mkdir -p "$TEMP_DIR"

echo "Downloading files from MinIO bucket: $MINIO_BUCKET"

# Use mc (MinIO Client) to mirror the bucket
# Install mc if not present: wget https://dl.min.io/client/mc/release/linux-amd64/mc
if command -v mc &> /dev/null; then
    # Configure mc alias
    mc alias set lims-backup "${PROTOCOL}://${MINIO_ENDPOINT}:${MINIO_PORT}" "$MINIO_ACCESS_KEY" "$MINIO_SECRET_KEY"
    
    # Mirror the bucket to local directory
    mc mirror "lims-backup/${MINIO_BUCKET}" "$TEMP_DIR"
    
    # Create compressed archive
    tar -czf "$BACKUP_FILE" -C "$TEMP_DIR" .
    
    # Clean up temporary directory
    rm -rf "$TEMP_DIR"
    
    echo "Object storage backup completed successfully"
    echo "Backup size: $(du -h "$BACKUP_FILE" | cut -f1)"
    
    # Remove old backups
    echo "Removing backups older than ${RETENTION_DAYS} days..."
    find "$BACKUP_DIR" -name "minio_backup_*.tar.gz" -mtime +${RETENTION_DAYS} -delete
    
    echo "Backup process completed"
else
    echo "ERROR: MinIO client (mc) not found. Please install it first." >&2
    echo "Download from: https://dl.min.io/client/mc/release/linux-amd64/mc" >&2
    rm -rf "$TEMP_DIR"
    exit 1
fi
