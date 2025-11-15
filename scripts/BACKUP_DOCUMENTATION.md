# Backup and Restore Documentation

## Overview

This directory contains scripts for backing up and restoring the Laboratory LIMS Pro database and object storage.

## Backup Scripts

### 1. Database Backup (`backup-database.sh`)

Backs up the PostgreSQL database to a compressed SQL file.

**Features:**
- Creates timestamped backups
- Compresses backups with gzip
- Automatic cleanup of old backups (30 days retention by default)
- Configurable via environment variables

**Usage:**
```bash
# Manual backup
./scripts/backup-database.sh

# Configure retention
RETENTION_DAYS=60 ./scripts/backup-database.sh
```

**Environment Variables:**
- `DATABASE_URL` - PostgreSQL connection string (from .env)
- `BACKUP_DIR` - Backup directory (default: ./backups/database)
- `RETENTION_DAYS` - Days to keep backups (default: 30)

### 2. Object Storage Backup (`backup-storage.sh`)

Backs up all files from MinIO object storage.

**Features:**
- Downloads all files from MinIO bucket
- Creates compressed tar archive
- Automatic cleanup of old backups
- Uses MinIO Client (mc) for efficient transfer

**Requirements:**
- MinIO Client (mc) must be installed
- Download from: https://dl.min.io/client/mc/release/linux-amd64/mc

**Usage:**
```bash
# Install MinIO Client
wget https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
sudo mv mc /usr/local/bin/

# Run backup
./scripts/backup-storage.sh
```

## Restore Scripts

### 1. Database Restore (`restore-database.sh`)

Restores a database backup.

**Usage:**
```bash
./scripts/restore-database.sh ./backups/database/lims_backup_20240101_020000.sql.gz
```

**⚠️ Warning:** This will overwrite the current database!

## Automated Backups with Cron

### Setting up nightly backups:

1. Make scripts executable:
```bash
chmod +x scripts/*.sh
```

2. Edit crontab:
```bash
crontab -e
```

3. Add cron jobs:
```cron
# Database backup - daily at 2 AM
0 2 * * * cd /path/to/laboratory-lims-pro && ./scripts/backup-database.sh >> /var/log/lims-backup.log 2>&1

# Object storage backup - daily at 3 AM
0 3 * * * cd /path/to/laboratory-lims-pro && ./scripts/backup-storage.sh >> /var/log/lims-backup.log 2>&1
```

### Systemd Timer (Alternative)

Create systemd service and timer files:

**Database Backup Service** (`/etc/systemd/system/lims-backup-db.service`):
```ini
[Unit]
Description=LIMS Database Backup
After=network.target

[Service]
Type=oneshot
User=lims
WorkingDirectory=/path/to/laboratory-lims-pro
ExecStart=/path/to/laboratory-lims-pro/scripts/backup-database.sh
```

**Database Backup Timer** (`/etc/systemd/system/lims-backup-db.timer`):
```ini
[Unit]
Description=LIMS Database Backup Timer

[Timer]
OnCalendar=daily
OnCalendar=02:00
Persistent=true

[Install]
WantedBy=timers.target
```

Enable and start:
```bash
sudo systemctl enable lims-backup-db.timer
sudo systemctl start lims-backup-db.timer
```

## Backup Storage

### Recommended Storage Structure

```
backups/
├── database/
│   ├── lims_backup_20240101_020000.sql.gz
│   ├── lims_backup_20240102_020000.sql.gz
│   └── ...
└── storage/
    ├── minio_backup_20240101_030000.tar.gz
    ├── minio_backup_20240102_030000.tar.gz
    └── ...
```

### Off-site Backup

For production, backups should be copied to off-site storage:

**Using rsync:**
```bash
# Add to cron after backup scripts
rsync -avz ./backups/ user@backup-server:/backups/lims/
```

**Using AWS S3:**
```bash
# Install AWS CLI
# Configure with: aws configure

# Add to cron
aws s3 sync ./backups/ s3://your-backup-bucket/lims/
```

**Using rclone (supports multiple cloud providers):**
```bash
# Install rclone
# Configure with: rclone config

# Add to cron
rclone sync ./backups/ remote:lims-backups/
```

## Testing Backups

It's critical to regularly test backup restoration:

### Monthly Backup Test Procedure:

1. Create test environment:
```bash
# Start test database
docker run -d --name postgres-test -e POSTGRES_PASSWORD=test postgres:15
```

2. Restore latest backup:
```bash
# Get latest backup
LATEST_BACKUP=$(ls -t ./backups/database/lims_backup_*.sql.gz | head -1)

# Test restore
DATABASE_URL="postgresql://postgres:test@localhost:5433/postgres" \
./scripts/restore-database.sh "$LATEST_BACKUP"
```

3. Verify data:
```bash
psql postgresql://postgres:test@localhost:5433/postgres -c "SELECT COUNT(*) FROM \"Sample\";"
```

4. Clean up:
```bash
docker stop postgres-test
docker rm postgres-test
```

## Recovery Procedures

### Full System Recovery

1. **Restore Database:**
```bash
./scripts/restore-database.sh ./backups/database/lims_backup_YYYYMMDD_HHMMSS.sql.gz
```

2. **Restore Object Storage:**
```bash
# Extract backup
tar -xzf ./backups/storage/minio_backup_YYYYMMDD_HHMMSS.tar.gz -C /tmp/restore

# Upload to MinIO
mc mirror /tmp/restore lims/lims-files
```

3. **Verify Application:**
```bash
# Check health endpoint
curl http://localhost:3000/health

# Run Prisma migrations if needed
cd packages/api
npm run prisma:migrate:deploy
```

## Security Considerations

1. **Backup Encryption:** Consider encrypting backups for sensitive data:
```bash
# Encrypt with gpg
gpg -c lims_backup_20240101_020000.sql.gz

# Decrypt
gpg lims_backup_20240101_020000.sql.gz.gpg
```

2. **Access Control:** Restrict backup file permissions:
```bash
chmod 600 backups/**/*.sql.gz
chmod 600 backups/**/*.tar.gz
```

3. **Secure Transfer:** Use encrypted protocols (SSH/SFTP/S3 with encryption)

4. **Regular Testing:** Test restoration monthly

5. **Monitoring:** Set up alerts for backup failures

## Monitoring

### Check Last Backup:
```bash
# Database backup
ls -lh ./backups/database/ | tail -1

# Storage backup
ls -lh ./backups/storage/ | tail -1
```

### Backup Size Monitoring:
```bash
# Total backup size
du -sh ./backups/

# Database backups
du -sh ./backups/database/

# Storage backups
du -sh ./backups/storage/
```

## Troubleshooting

### Database Backup Issues:

**Problem:** `pg_dump: command not found`
```bash
# Install PostgreSQL client tools
sudo apt-get install postgresql-client
```

**Problem:** Permission denied
```bash
# Ensure database user has proper permissions
psql $DATABASE_URL -c "GRANT SELECT ON ALL TABLES IN SCHEMA public TO backup_user;"
```

### Storage Backup Issues:

**Problem:** MinIO client not found
```bash
# Install mc
wget https://dl.min.io/client/mc/release/linux-amd64/mc
chmod +x mc
sudo mv mc /usr/local/bin/
```

**Problem:** Connection refused to MinIO
```bash
# Check MinIO is running
docker ps | grep minio

# Check MinIO endpoint and port
mc admin info lims-backup
```
