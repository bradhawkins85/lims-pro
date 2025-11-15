# Seed Data Documentation

This document describes the comprehensive seed data provided for demos, testing, and development.

## Overview

The seed script (`packages/api/prisma/seed.ts`) populates the database with realistic test data that demonstrates all key features of the Laboratory LIMS Pro system.

## Running the Seed Script

After setting up the database and running migrations:

```bash
npm run prisma:seed --workspace=api
```

Or directly:

```bash
cd packages/api
npx prisma db seed
```

## Seed Data Contents

### 1. Users (5 roles)

Test users are created for each role with predictable credentials:

| Email | Password | Role | Description |
|-------|----------|------|-------------|
| `admin@lims.local` | `admin123` | ADMIN | Full system access, manage users/roles, system settings |
| `manager@lims.local` | `manager123` | LAB_MANAGER | QA/Reviewer - approve/release results & COAs, view all, edit samples/tests |
| `analyst@lims.local` | `analyst123` | ANALYST | Create/edit samples & assigned tests, enter results, upload attachments |
| `sales@lims.local` | `sales123` | SALES_ACCOUNTING | Read samples, manage quotes/PO/SO, set invoice flags |
| `client@lims.local` | `client123` | CLIENT | Portal view of their samples, results, and final COAs (read-only) |

### 2. Client Organization

**Client**: Acme Pharmaceuticals
- Contact: John Smith
- Email: john.smith@acme.com
- Phone: +1-555-0123
- Address: 123 Pharma Street, Medical City, MC 12345

### 3. Laboratory Sections

Three laboratory sections are created:

1. **Microbiology** - For microbiological testing
2. **Chemistry** - For chemical analysis
3. **Physical Testing** - For physical property measurements

### 4. Methods (14 total)

#### Microbiology Methods (6)
- **MET-001**: Total Plate Count (TPC)
- **MET-002**: Yeast and Mould Count
- **MET-003**: E. coli Detection
- **MET-004**: Salmonella Detection
- **MET-005**: Staphylococcus aureus Count
- **MET-006**: Pseudomonas aeruginosa Detection

#### Chemistry Methods (4)
- **MET-007**: Lead (Pb) Analysis - ICP-MS
- **MET-008**: Cadmium (Cd) Analysis - ICP-MS
- **MET-009**: Arsenic (As) Analysis - ICP-MS
- **MET-010**: Mercury (Hg) Analysis - ICP-MS

#### Physical Testing Methods (4)
- **MET-011**: pH Measurement
- **MET-012**: Viscosity Measurement
- **MET-013**: Density Measurement
- **MET-014**: Refractive Index Measurement

### 5. Specifications (14 total)

Each method has a corresponding specification with acceptance criteria:

#### Microbiology Specs
- **SPEC-001**: TPC Limit (< 1000 CFU/g)
- **SPEC-002**: Yeast & Mould Limit (< 100 CFU/g)
- **SPEC-003**: E. coli Limit (< 10 CFU/g)
- **SPEC-004**: Salmonella Absence (Not Detected)
- **SPEC-005**: S. aureus Limit (< 100 CFU/g)
- **SPEC-006**: P. aeruginosa Limit (< 10 CFU/g)

#### Heavy Metals Specs
- **SPEC-007**: Lead (Pb) Limit (< 0.5 ppm)
- **SPEC-008**: Cadmium (Cd) Limit (< 0.3 ppm)
- **SPEC-009**: Arsenic (As) Limit (< 1.0 ppm)
- **SPEC-010**: Mercury (Hg) Limit (< 0.1 ppm)

#### Physical Testing Specs
- **SPEC-011**: pH Range (5.0 - 7.0)
- **SPEC-012**: Viscosity Range (50 - 150 cP)
- **SPEC-013**: Density Range (0.95 - 1.05 g/mL)
- **SPEC-014**: Refractive Index Range (1.330 - 1.340 nD)

### 6. Test Definitions (14 total)

Test definitions link sections, methods, and specifications together:

#### Microbiology Test Definitions (6)
1. Total Plate Count (5-day turnaround)
2. Yeast and Mould Count (5-day turnaround)
3. E. coli Detection (3-day turnaround)
4. Salmonella Detection (5-day turnaround)
5. S. aureus Count (3-day turnaround)
6. P. aeruginosa Detection (3-day turnaround)

#### Chemistry Test Definitions (4)
7. Lead (Pb) Analysis (7-day turnaround)
8. Cadmium (Cd) Analysis (7-day turnaround)
9. Arsenic (As) Analysis (7-day turnaround)
10. Mercury (Hg) Analysis (7-day turnaround)

#### Physical Test Definitions (4)
11. pH Measurement (2-day turnaround)
12. Viscosity Measurement (2-day turnaround)
13. Density Measurement (2-day turnaround)
14. Refractive Index Measurement (2-day turnaround)

### 7. Test Packs (4 bundles)

Test packs group related tests for common testing scenarios:

#### 1. Basic 6 Micro Tests
Complete microbiological panel:
1. Total Plate Count
2. Yeast and Mould Count
3. E. coli Detection
4. Salmonella Detection
5. S. aureus Count
6. P. aeruginosa Detection

#### 2. 4× Heavy Metals
Heavy metal contamination screening:
1. Lead (Pb) Analysis
2. Cadmium (Cd) Analysis
3. Arsenic (As) Analysis
4. Mercury (Hg) Analysis

#### 3. 4× Liquid Physical
Physical properties for liquid samples:
1. pH Measurement
2. Viscosity Measurement
3. Density Measurement
4. Refractive Index Measurement

#### 4. TVC & Yeast & Mould Pack
Basic microbiology screening:
1. Total Plate Count (TVC)
2. Yeast and Mould Count

### 8. Operational Data

#### Job
- **Job Number**: JOB-2025-001
- **Client**: Acme Pharmaceuticals
- **Status**: ACTIVE
- **Quote Number**: Q-2025-001
- **PO Number**: PO-2025-001
- **SO Number**: SO-2025-001
- **Amount (Ex Tax)**: $1,500.00
- **Need By Date**: 14 days from creation
- **Invoiced**: No

#### Sample 1: SAMPLE-001
- **Description**: Raw material batch for testing
- **Batch**: BATCH-2025-001
- **Date Received**: Current date
- **Due Date**: 7 days from receipt
- **Temperature on Receipt**: 22.5°C
- **Storage**: Room temperature, dry

**Test Assignments (4):**
1. **Total Plate Count**
   - Status: COMPLETED
   - Result: 850 CFU/g
   - ✅ In Specification (< 1000 CFU/g)

2. **Yeast and Mould Count**
   - Status: COMPLETED
   - Result: 45 CFU/g
   - ✅ In Specification (< 100 CFU/g)

3. **Lead (Pb) Analysis**
   - Status: COMPLETED
   - Result: 0.75 ppm
   - ⚠️ **OUT OF SPECIFICATION** (limit: 0.5 ppm)
   - Comment: "Result exceeds specification limit"

4. **pH Measurement**
   - Status: COMPLETED
   - Result: 6.2 pH
   - ✅ In Specification (5.0 - 7.0)

#### Sample 2: SAMPLE-002
- **Description**: Finished product quality control
- **Batch**: BATCH-2025-002
- **Date Received**: Current date
- **Due Date**: 7 days from receipt
- **Temperature on Receipt**: 21.8°C
- **Storage**: Room temperature, dry
- **Flags**: Urgent sample

**Test Assignments (4):**
1. **Total Plate Count**
   - Status: COMPLETED
   - Result: 1500 CFU/g
   - ⚠️ **OUT OF SPECIFICATION** (limit: 1000 CFU/g)
   - Comment: "Result exceeds specification limit - retest recommended"

2. **Salmonella Detection**
   - Status: COMPLETED
   - Result: Not Detected
   - ✅ In Specification

3. **Viscosity Measurement**
   - Status: COMPLETED
   - Result: 180 cP
   - ⚠️ **OUT OF SPECIFICATION** (limit: 50-150 cP)
   - Comment: "Viscosity exceeds upper specification limit"

4. **Density Measurement**
   - Status: IN_PROGRESS
   - Result: Not yet entered

### 9. Additional Data

- **Attachments**: 1 sample attachment (sample_image.jpg) linked to Sample 1
- **COA Reports**: 1 draft COA report for Sample 1
- **Audit Logs**: Sample audit log entries demonstrating the audit trail system

## Out-of-Specification (OOS) Results

The seed data includes 3 intentional OOS results for testing and demonstrating failure workflows:

1. **Sample 1 - Lead Analysis**: 0.75 ppm (limit: 0.5 ppm)
   - Demonstrates heavy metal contamination scenario
   - Tests OOS investigation workflow

2. **Sample 2 - Total Plate Count**: 1500 CFU/g (limit: 1000 CFU/g)
   - Demonstrates microbiological contamination
   - Tests retest request workflow

3. **Sample 2 - Viscosity**: 180 cP (limit: 150 cP)
   - Demonstrates physical property failure
   - Tests specification limit validation

## Using the Seed Data

### For Development
- Use the test users to log in and test different role permissions
- Modify samples and tests to verify business logic
- Create new test assignments using the existing test definitions
- Test PDF report generation with existing samples

### For Demos
- Show complete test packs (pre-configured test bundles)
- Demonstrate OOS handling and investigation workflows
- Showcase sample tracking from receipt to release
- Display multi-section laboratory capabilities
- Present role-based access control with different user types

### For Testing
- Write automated tests that rely on consistent seed data
- Test API endpoints with known data
- Verify calculations and business rules with OOS samples
- Test reporting with samples that have complete results

## Resetting Data

To reset the database and re-seed:

```bash
cd packages/api
npx prisma migrate reset
```

This will:
1. Drop all tables
2. Recreate the schema
3. Run migrations
4. Automatically run the seed script

## Customizing Seed Data

To modify the seed data:

1. Edit `packages/api/prisma/seed.ts`
2. Make your changes
3. Reset and re-seed:
   ```bash
   cd packages/api
   npx prisma migrate reset
   ```

Or just re-run the seed (if using upserts):
```bash
npm run prisma:seed --workspace=api
```

## Notes

- All user passwords use bcrypt hashing with a cost factor of 10
- UUIDs are used for all primary keys
- Timestamps are automatically set to current time
- The seed script is idempotent for users (uses `upsert`)
- All test data is created by the admin user
- Test assignments are assigned to the analyst user
