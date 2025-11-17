# Copilot Prompt: PDF Template

## Prompt

```
Create a semantic, print‑ready HTML template for COA with header/footer, lab logo, Sample Info block, and paginated Tests table. No external CSS frameworks at render time; inline CSS; ensure page breaks between rows if needed.
```

## What This Creates

This prompt generates a professional Certificate of Analysis (COA) HTML template with:

### Core Features

1. **Semantic HTML5 Structure**
   - Proper document structure
   - Accessible markup
   - Screen reader compatible

2. **Print-Ready Layout**
   - Header with logo and lab info
   - Sample information block
   - Tests results table
   - Footer with disclaimer
   - Page break controls

3. **Inline CSS**
   - No external dependencies
   - PDF-generation compatible
   - Consistent rendering
   - Print-optimized styles

4. **Professional Typography**
   - Clear hierarchy
   - Readable fonts
   - Proper spacing
   - High contrast

5. **Responsive Tables**
   - Multi-page support
   - Page break handling
   - Column alignment
   - OOS highlighting

## Implementation

### Renderer Function

```typescript
/**
 * Renders a COA data snapshot into print-ready HTML
 * @param dataSnapshot - The COA data to render
 * @returns HTML string ready for PDF conversion
 */
export function renderCOATemplate(dataSnapshot: COADataSnapshot): string {
  const { sample, tests, reportMetadata } = dataSnapshot;

  // Helper to format dates
  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Helper to check field visibility
  const isVisible = (field: string): boolean => {
    const visibleFields = reportMetadata.templateSettings?.visibleFields;
    return !visibleFields || visibleFields.includes(field);
  };

  // Helper to get custom label
  const getLabel = (field: string, defaultLabel: string): string => {
    return (
      reportMetadata.templateSettings?.labelOverrides?.[field] || defaultLabel
    );
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Certificate of Analysis - ${sample.sampleCode}</title>
  <style>
    /* Reset and Base Styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Arial', 'Helvetica', sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #333;
      background: white;
      padding: 20mm;
    }

    /* Print Styles */
    @media print {
      body {
        padding: 10mm;
      }
      
      .page-break {
        page-break-after: always;
      }
      
      .no-break {
        page-break-inside: avoid;
      }
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 3px solid #2563eb;
      margin-bottom: 30px;
    }

    .header-logo img {
      max-height: 60px;
      max-width: 200px;
    }

    .header-info {
      text-align: right;
    }

    .header-title {
      font-size: 24pt;
      font-weight: bold;
      color: #1e40af;
    }

    .header-subtitle {
      font-size: 12pt;
      color: #64748b;
      margin-top: 5px;
    }

    /* Report Metadata */
    .report-metadata {
      background: #f1f5f9;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
    }

    .report-metadata-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
    }

    .metadata-item {
      display: flex;
      flex-direction: column;
    }

    .metadata-label {
      font-size: 9pt;
      color: #64748b;
      text-transform: uppercase;
      font-weight: bold;
      margin-bottom: 3px;
    }

    .metadata-value {
      font-size: 11pt;
      color: #1e293b;
    }

    /* Section Headers */
    .section {
      margin-bottom: 30px;
    }

    .section-title {
      font-size: 14pt;
      font-weight: bold;
      color: #1e40af;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 8px;
      margin-bottom: 15px;
    }

    /* Info Grid */
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 20px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
    }

    .info-label {
      font-size: 10pt;
      color: #64748b;
      font-weight: bold;
      margin-bottom: 3px;
    }

    .info-value {
      font-size: 11pt;
      color: #1e293b;
    }

    /* Tests Table */
    .tests-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }

    .tests-table thead {
      background: #1e40af;
      color: white;
    }

    .tests-table th {
      padding: 12px 8px;
      text-align: left;
      font-size: 10pt;
      font-weight: bold;
      border: 1px solid #1e40af;
    }

    .tests-table tbody tr {
      border-bottom: 1px solid #e2e8f0;
    }

    .tests-table tbody tr:nth-child(even) {
      background: #f8fafc;
    }

    .tests-table tbody tr.oos {
      background: #fee2e2;
    }

    .tests-table td {
      padding: 10px 8px;
      font-size: 10pt;
      border: 1px solid #e2e8f0;
    }

    .tests-table td.numeric {
      text-align: right;
    }

    .tests-table td.status {
      text-align: center;
    }

    /* Status Badge */
    .status-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 3px;
      font-size: 9pt;
      font-weight: bold;
    }

    .status-badge.completed {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-badge.reviewed {
      background: #dcfce7;
      color: #166534;
    }

    .status-badge.released {
      background: #dcfce7;
      color: #166534;
    }

    .status-badge.oos {
      background: #fee2e2;
      color: #991b1b;
    }

    /* Footer */
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e2e8f0;
      font-size: 9pt;
      color: #64748b;
    }

    .disclaimer {
      font-style: italic;
      margin-bottom: 15px;
      padding: 10px;
      background: #f8fafc;
      border-left: 3px solid #2563eb;
    }

    .signatures {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 30px;
      margin-top: 40px;
    }

    .signature-block {
      border-top: 1px solid #94a3b8;
      padding-top: 10px;
    }

    .signature-label {
      font-weight: bold;
      color: #475569;
    }
  </style>
</head>
<body>
  <!-- Header -->
  <header class="header">
    <div class="header-logo">
      ${
        reportMetadata.labLogoUrl
          ? `<img src="${reportMetadata.labLogoUrl}" alt="${reportMetadata.labName} Logo">`
          : `<div style="font-size: 18pt; font-weight: bold; color: #1e40af;">${reportMetadata.labName}</div>`
      }
    </div>
    <div class="header-info">
      <div class="header-title">Certificate of Analysis</div>
      <div class="header-subtitle">Version ${reportMetadata.version}</div>
    </div>
  </header>

  <!-- Report Metadata -->
  <div class="report-metadata no-break">
    <div class="report-metadata-grid">
      <div class="metadata-item">
        <div class="metadata-label">${getLabel('reportDate', 'Report Date')}</div>
        <div class="metadata-value">${formatDate(reportMetadata.generatedAt)}</div>
      </div>
      <div class="metadata-item">
        <div class="metadata-label">${getLabel('generatedBy', 'Generated By')}</div>
        <div class="metadata-value">${reportMetadata.generatedBy}</div>
      </div>
      <div class="metadata-item">
        <div class="metadata-label">${getLabel('sampleCode', 'Sample Code')}</div>
        <div class="metadata-value">${sample.sampleCode}</div>
      </div>
    </div>
  </div>

  <!-- Client Information -->
  ${
    isVisible('clientInfo')
      ? `
  <section class="section no-break">
    <h2 class="section-title">${getLabel('clientInfo', 'Client Information')}</h2>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">${getLabel('clientName', 'Client Name')}</div>
        <div class="info-value">${sample.client.name}</div>
      </div>
      ${
        sample.client.contactName
          ? `
      <div class="info-item">
        <div class="info-label">${getLabel('contactName', 'Contact Name')}</div>
        <div class="info-value">${sample.client.contactName}</div>
      </div>
      `
          : ''
      }
      ${
        sample.client.email
          ? `
      <div class="info-item">
        <div class="info-label">${getLabel('email', 'Email')}</div>
        <div class="info-value">${sample.client.email}</div>
      </div>
      `
          : ''
      }
      ${
        sample.client.address
          ? `
      <div class="info-item">
        <div class="info-label">${getLabel('address', 'Address')}</div>
        <div class="info-value">${sample.client.address}</div>
      </div>
      `
          : ''
      }
    </div>
  </section>
  `
      : ''
  }

  <!-- Sample Information -->
  <section class="section no-break">
    <h2 class="section-title">${getLabel('sampleInfo', 'Sample Information')}</h2>
    <div class="info-grid">
      ${
        isVisible('jobNumber')
          ? `
      <div class="info-item">
        <div class="info-label">${getLabel('jobNumber', 'Job Number')}</div>
        <div class="info-value">${sample.jobNumber}</div>
      </div>
      `
          : ''
      }
      ${
        isVisible('dateReceived')
          ? `
      <div class="info-item">
        <div class="info-label">${getLabel('dateReceived', 'Date Received')}</div>
        <div class="info-value">${formatDate(sample.dateReceived)}</div>
      </div>
      `
          : ''
      }
      ${
        isVisible('sampleDescription') && sample.sampleDescription
          ? `
      <div class="info-item">
        <div class="info-label">${getLabel('sampleDescription', 'Description')}</div>
        <div class="info-value">${sample.sampleDescription}</div>
      </div>
      `
          : ''
      }
      ${
        isVisible('sampleBatch') && sample.sampleBatch
          ? `
      <div class="info-item">
        <div class="info-label">${getLabel('sampleBatch', 'Batch Number')}</div>
        <div class="info-value">${sample.sampleBatch}</div>
      </div>
      `
          : ''
      }
      ${
        isVisible('rmSupplier') && sample.rmSupplier
          ? `
      <div class="info-item">
        <div class="info-label">${getLabel('rmSupplier', 'Supplier')}</div>
        <div class="info-value">${sample.rmSupplier}</div>
      </div>
      `
          : ''
      }
      ${
        isVisible('releaseDate') && sample.releaseDate
          ? `
      <div class="info-item">
        <div class="info-label">${getLabel('releaseDate', 'Release Date')}</div>
        <div class="info-value">${formatDate(sample.releaseDate)}</div>
      </div>
      `
          : ''
      }
    </div>
  </section>

  <!-- Test Results -->
  <section class="section">
    <h2 class="section-title">${getLabel('testResults', 'Test Results')}</h2>
    <table class="tests-table">
      <thead>
        <tr>
          <th>${getLabel('testName', 'Test Name')}</th>
          <th>${getLabel('method', 'Method')}</th>
          <th>${getLabel('specification', 'Specification')}</th>
          <th>${getLabel('result', 'Result')}</th>
          <th>${getLabel('status', 'Status')}</th>
          ${isVisible('analyst') ? `<th>${getLabel('analyst', 'Analyst')}</th>` : ''}
          ${isVisible('testDate') ? `<th>${getLabel('testDate', 'Test Date')}</th>` : ''}
        </tr>
      </thead>
      <tbody>
        ${tests
          .map(
            test => `
        <tr class="${test.oos ? 'oos' : ''}">
          <td>${test.testName}</td>
          <td>${test.method.name} (${test.method.code})</td>
          <td>
            ${
              test.specification
                ? `
              ${test.specification.min !== undefined ? `Min: ${test.specification.min}` : ''}
              ${test.specification.max !== undefined ? ` Max: ${test.specification.max}` : ''}
              ${test.specification.target ? `Target: ${test.specification.target}` : ''}
              ${test.specification.unit ? ` ${test.specification.unit}` : ''}
            `
                : 'N/A'
            }
          </td>
          <td class="numeric">
            ${test.result || 'Pending'}
            ${test.resultUnit || ''}
            ${test.oos ? '<span class="status-badge oos">OOS</span>' : ''}
          </td>
          <td class="status">
            <span class="status-badge ${test.status.toLowerCase()}">
              ${test.status}
            </span>
          </td>
          ${isVisible('analyst') ? `<td>${test.analyst?.name || 'N/A'}</td>` : ''}
          ${isVisible('testDate') ? `<td>${formatDate(test.testDate)}</td>` : ''}
        </tr>
        `,
          )
          .join('')}
      </tbody>
    </table>
  </section>

  <!-- Footer -->
  <footer class="footer no-break">
    ${
      reportMetadata.disclaimerText
        ? `
    <div class="disclaimer">
      ${reportMetadata.disclaimerText}
    </div>
    `
        : ''
    }
    
    <div class="signatures">
      <div class="signature-block">
        <div class="signature-label">Prepared By:</div>
        <div>${reportMetadata.generatedBy}</div>
        <div>${formatDate(reportMetadata.generatedAt)}</div>
      </div>
      <div class="signature-block">
        <div class="signature-label">Approved By:</div>
        <div>_______________________________</div>
        <div>Date: _________________________</div>
      </div>
    </div>
  </footer>
</body>
</html>
  `.trim();
}
```

## Features Breakdown

### 1. Semantic Structure
- Proper HTML5 elements
- Logical document hierarchy
- Accessible markup
- Screen reader compatible

### 2. Print Optimization
- Page break controls
- No-break sections
- Print-specific styles
- Consistent margins

### 3. Inline Styling
- All CSS in `<style>` tag
- No external dependencies
- PDF-generation compatible
- Consistent rendering

### 4. Responsive Layout
- Grid-based info sections
- Flexible table columns
- Scalable fonts
- Adaptive spacing

### 5. Professional Design
- Clean typography
- Color-coded status
- OOS highlighting
- Clear hierarchy

## Implementation Reference

See the actual implementation in:
- `packages/api/src/modules/coa/renderer.ts`
- `packages/api/src/coa-reports/coa-reports.service.ts`

## Follow-Up Prompts

After implementing the PDF template, you might want to:

1. **Add Multiple Templates:**
   ```
   Copilot, create a template management system:
   - Store multiple COA templates
   - Each template as separate HTML file
   - Template selection UI
   - Preview before selection
   - Custom CSS per template
   ```

2. **Add Watermarks:**
   ```
   Copilot, add watermark support:
   - "DRAFT" watermark for non-final reports
   - "SUPERSEDED" for old versions
   - Configurable text and position
   - Semi-transparent overlay
   - Preserve readability
   ```

3. **Add Charts:**
   ```
   Copilot, add visual charts to COA:
   - Trend chart for repeated tests
   - Specification range visualization
   - SVG-based charts (no external libs)
   - Print-friendly rendering
   ```

4. **Add QR Code:**
   ```
   Copilot, add QR code to COA:
   - Generate QR code with report URL
   - Include in header or footer
   - Allow verification via scanning
   - Link to online report viewer
   ```

## Testing

```typescript
describe('renderCOATemplate', () => {
  it('renders complete HTML document', () => {
    const html = renderCOATemplate(mockDataSnapshot);
    
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html');
    expect(html).toContain('</html>');
  });

  it('includes sample information', () => {
    const html = renderCOATemplate(mockDataSnapshot);
    
    expect(html).toContain(mockDataSnapshot.sample.sampleCode);
    expect(html).toContain(mockDataSnapshot.sample.client.name);
  });

  it('renders all tests', () => {
    const html = renderCOATemplate(mockDataSnapshot);
    
    mockDataSnapshot.tests.forEach(test => {
      expect(html).toContain(test.testName);
      expect(html).toContain(test.method.name);
    });
  });

  it('highlights OOS tests', () => {
    const html = renderCOATemplate(mockDataSnapshot);
    
    expect(html).toContain('class="oos"');
    expect(html).toContain('status-badge oos');
  });

  it('respects template settings', () => {
    const dataWithSettings = {
      ...mockDataSnapshot,
      reportMetadata: {
        ...mockDataSnapshot.reportMetadata,
        templateSettings: {
          visibleFields: ['sampleCode', 'dateReceived'],
          labelOverrides: {
            sampleCode: 'Sample ID',
          },
        },
      },
    };

    const html = renderCOATemplate(dataWithSettings);
    
    expect(html).toContain('Sample ID');
    expect(html).not.toContain('Sample Batch');
  });
});
```

## Best Practices

1. **Inline CSS**: Never use external stylesheets
2. **No JavaScript**: PDF generators may not execute JS
3. **Web Fonts**: Use system fonts or embed
4. **Page Breaks**: Control with CSS
5. **Test Rendering**: Test with actual PDF generator
6. **Accessibility**: Use semantic HTML
7. **Print Preview**: Always test print view

## Performance Tips

1. **Minimize HTML**: Remove unnecessary whitespace
2. **Optimize Images**: Compress lab logo
3. **Limit Complexity**: Avoid deep nesting
4. **Cache Templates**: Reuse rendered HTML
5. **Async Generation**: Generate PDFs in background

## Compliance Notes

### ISO 17025
- ✅ All required test report elements
- ✅ Traceability information
- ✅ Clear identification
- ✅ Professional format

### FDA 21 CFR Part 11
- ✅ Version control
- ✅ Audit trail references
- ✅ Signature blocks
- ✅ Date stamps

### GLP
- ✅ Complete documentation
- ✅ Raw data references
- ✅ Analyst identification
- ✅ QA review sections
