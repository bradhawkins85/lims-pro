# Copilot Prompt: COA Export Service

## Prompt

```
Implement CoaService.export(sampleId, actorId) that: builds dataSnapshot from Sample + TestAssignments, renders HTML using lab template settings, converts to PDF via Puppeteer, increments version, stores COAReport with htmlSnapshot, dataSnapshot, pdfKey, reportedAt, reportedById. Mark previous final as superseded.
```

## What This Creates

This prompt generates a comprehensive Certificate of Analysis (COA) export service with:

### Core Features

1. **Data Snapshot Builder**
   - Captures immutable sample data
   - Includes all test assignments with results
   - Captures client information
   - Stores job/batch details
   - Preserves status flags

2. **HTML Renderer**
   - Uses lab template settings
   - Professional print layout
   - Inline CSS for PDF compatibility
   - Page break controls
   - Responsive tables

3. **PDF Generator**
   - Puppeteer/headless Chrome
   - High-quality PDF output
   - Print-optimized formatting
   - Consistent rendering

4. **Version Control**
   - Auto-increment version numbers
   - Marks previous FINAL as SUPERSEDED
   - Immutable historical records
   - Full audit trail

5. **Storage Integration**
   - MinIO/S3 compatible
   - Organized file structure
   - Secure URL generation
   - Download capabilities

## Service Architecture

```
COAReportsService
    ├── exportCOA()          // Main export function
    ├── buildDataSnapshot()  // Capture data
    ├── buildHTMLSnapshot()  // Render template
    ├── finalizeCOA()        // Finalize draft
    ├── previewCOA()         // Preview without saving
    └── downloadCOAPdf()     // Retrieve PDF
```

## Implementation

### Service Class

```typescript
@Injectable()
export class COAReportsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
    private pdfService: PdfService,
    private storageService: StorageService,
    private labSettingsService: LabSettingsService,
  ) {}

  async exportCOA(sampleId: string, context: AuditContext) {
    // 1. Fetch sample with all related data
    const sample = await this.prisma.sample.findUnique({
      where: { id: sampleId },
      include: {
        client: true,
        job: true,
        testAssignments: {
          include: {
            section: true,
            method: true,
            specification: true,
            analyst: true,
            checker: true,
          },
        },
      },
    });

    // 2. Get next version number
    const latestReport = await this.prisma.cOAReport.findFirst({
      where: { sampleId },
      orderBy: { version: 'desc' },
    });
    const newVersion = (latestReport?.version || 0) + 1;

    // 3. Build data snapshot (immutable)
    const dataSnapshot = await this.buildDataSnapshot(
      sample,
      newVersion,
      context,
    );

    // 4. Render HTML template
    const htmlSnapshot = this.buildHTMLSnapshot(dataSnapshot);

    // 5. Generate PDF
    const pdfBuffer = await this.pdfService.generatePdfFromHtml(
      htmlSnapshot,
    );

    // 6. Store PDF in object storage
    const pdfKey = `coa-reports/${sample.sampleCode}-v${newVersion}-${Date.now()}.pdf`;
    await this.storageService.uploadFile(
      pdfKey,
      pdfBuffer,
      'application/pdf',
    );

    // 7. Mark previous FINAL reports as SUPERSEDED
    await this.prisma.cOAReport.updateMany({
      where: {
        sampleId,
        status: COAReportStatus.FINAL,
      },
      data: {
        status: COAReportStatus.SUPERSEDED,
      },
    });

    // 8. Create new COA report
    const report = await this.prisma.cOAReport.create({
      data: {
        sampleId,
        version: newVersion,
        status: COAReportStatus.FINAL,
        htmlSnapshot,
        dataSnapshot: dataSnapshot as any,
        pdfKey,
        reportedAt: new Date(),
        reportedById: context.actorId,
        createdById: context.actorId,
        updatedById: context.actorId,
      },
    });

    // 9. Log audit entry
    await this.auditService.logCreate(
      context,
      'COAReport',
      report.id,
      report,
    );

    return {
      id: report.id,
      version: report.version,
      pdfUrl: `/api/coa/${report.id}/download`,
      status: report.status,
    };
  }
}
```

### Data Snapshot Structure

```typescript
interface COADataSnapshot {
  sample: {
    jobNumber: string;
    dateReceived: Date;
    sampleCode: string;
    client: {
      name: string;
      contactName?: string;
      email?: string;
      address?: string;
    };
    sampleDescription?: string;
    batchNumber?: string;
    // ... other sample fields
  };
  tests: Array<{
    testName: string;
    section: { name: string };
    method: {
      code: string;
      name: string;
      unit?: string;
    };
    specification?: {
      min?: number;
      max?: number;
      target?: string;
    };
    result?: string;
    resultUnit?: string;
    status: string;
    oos: boolean;
    analyst?: { name: string };
    testDate?: Date;
    comments?: string;
  }>;
  reportMetadata: {
    version: number;
    generatedAt: Date;
    generatedBy: string;
    labName: string;
    labLogoUrl?: string;
    disclaimerText?: string;
  };
}
```

## Version Control Flow

```
Sample: SAMPLE-001

Initial State:
  No COA reports

After First Export:
  ├── COAReport v1 (FINAL)
  └── PDF: sample-001-v1.pdf

After Second Export (retest):
  ├── COAReport v1 (SUPERSEDED) ← status changed
  ├── COAReport v2 (FINAL)      ← new report
  └── PDF: sample-001-v2.pdf    ← new PDF

After Third Export:
  ├── COAReport v1 (SUPERSEDED)
  ├── COAReport v2 (SUPERSEDED) ← status changed
  ├── COAReport v3 (FINAL)      ← new report
  └── PDF: sample-001-v3.pdf    ← new PDF
```

## API Endpoints

```typescript
@Controller('coa-reports')
export class COAReportsController {
  // Export/Generate COA
  @Post('samples/:sampleId/export')
  @RequirePermission(Action.CREATE, Resource.REPORT)
  async exportCOA(@Param('sampleId') sampleId: string) {
    return this.coaService.exportCOA(sampleId, context);
  }

  // Preview COA (no save)
  @Get('samples/:sampleId/preview')
  @RequirePermission(Action.READ, Resource.REPORT)
  async previewCOA(@Param('sampleId') sampleId: string) {
    return this.coaService.previewCOA(sampleId, context);
  }

  // Download PDF
  @Get(':id/download')
  @RequirePermission(Action.READ, Resource.REPORT)
  async downloadPDF(@Param('id') id: string, @Res() res: Response) {
    const report = await this.coaService.getCOAReport(id);
    const pdfBuffer = await this.coaService.downloadCOAPdf(report.pdfKey);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${report.sample.sampleCode}-v${report.version}.pdf"`,
    });
    res.send(pdfBuffer);
  }

  // List all versions for a sample
  @Get('samples/:sampleId')
  @RequirePermission(Action.READ, Resource.REPORT)
  async listReports(@Param('sampleId') sampleId: string) {
    return this.coaService.listCOAReportsForSample(sampleId);
  }
}
```

## Implementation Reference

See the actual implementation in:
- `packages/api/src/coa-reports/coa-reports.service.ts`
- `packages/api/src/coa-reports/coa-reports.controller.ts`
- `packages/api/src/modules/coa/renderer.ts`
- `packages/api/src/pdf/pdf.service.ts`

## Follow-Up Prompts

After implementing the COA service, you might want to:

1. **Add Email Distribution:**
   ```
   Copilot, add a method sendCOA(reportId, recipients[]) that:
   - Retrieves the COA PDF
   - Generates an email with lab branding
   - Attaches the PDF
   - Sends to specified recipients
   - Logs the distribution in audit trail
   ```

2. **Add Batch Export:**
   ```
   Copilot, add a method exportBatch(jobId) that:
   - Finds all samples in a job
   - Exports COA for each sample
   - Creates a ZIP archive with all PDFs
   - Returns download link for the archive
   ```

3. **Add Custom Templates:**
   ```
   Copilot, create a template management system that allows:
   - Multiple COA templates per lab
   - Template selection at export time
   - Custom field visibility per template
   - Label overrides and formatting options
   - Preview before saving
   ```

## Testing

```typescript
describe('COAReportsService', () => {
  it('exports COA with version increment', async () => {
    const result = await service.exportCOA(sampleId, context);
    
    expect(result.version).toBe(1);
    expect(result.pdfUrl).toContain('/download');
  });

  it('marks previous FINAL as SUPERSEDED', async () => {
    // First export
    await service.exportCOA(sampleId, context);
    
    // Second export
    await service.exportCOA(sampleId, context);
    
    const reports = await service.listCOAReportsForSample(sampleId);
    
    expect(reports[0].version).toBe(2);
    expect(reports[0].status).toBe('FINAL');
    expect(reports[1].version).toBe(1);
    expect(reports[1].status).toBe('SUPERSEDED');
  });

  it('captures immutable data snapshot', async () => {
    const result = await service.exportCOA(sampleId, context);
    
    const report = await service.getCOAReport(result.id);
    
    expect(report.dataSnapshot).toHaveProperty('sample');
    expect(report.dataSnapshot).toHaveProperty('tests');
    expect(report.dataSnapshot).toHaveProperty('reportMetadata');
  });
});
```

## Best Practices

1. **Immutable Snapshots**: Never modify dataSnapshot after creation
2. **Version Control**: Always increment, never overwrite
3. **Audit Trail**: Log all COA generation events
4. **Access Control**: Restrict COA generation to authorized roles
5. **Storage Organization**: Use consistent naming convention for PDFs
6. **Error Handling**: Handle PDF generation failures gracefully
7. **Transaction Safety**: Use database transactions for atomic operations
8. **Performance**: Consider async PDF generation for large reports

## Compliance Notes

### FDA 21 CFR Part 11
- ✅ Version control
- ✅ Audit trail
- ✅ Immutable records
- ✅ Electronic signatures (via reportedBy)

### ISO 17025
- ✅ Test report requirements
- ✅ Traceability
- ✅ Document control
- ✅ Archive retention

## Troubleshooting

### PDF Generation Fails
- Check Puppeteer/Chrome installation
- Verify memory limits
- Check HTML template validity
- Ensure fonts are available

### Version Conflicts
- Use database transactions
- Handle concurrent exports
- Implement retry logic

### Storage Issues
- Verify MinIO/S3 credentials
- Check network connectivity
- Ensure sufficient storage space
- Handle upload failures with retry
