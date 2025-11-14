import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lims.local' },
    update: {},
    create: {
      email: 'admin@lims.local',
      password: adminPassword,
      name: 'Admin User',
      role: Role.ADMIN,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create lab manager user
  const managerPassword = await bcrypt.hash('manager123', 10);
  const manager = await prisma.user.upsert({
    where: { email: 'manager@lims.local' },
    update: {},
    create: {
      email: 'manager@lims.local',
      password: managerPassword,
      name: 'Lab Manager',
      role: Role.LAB_MANAGER,
    },
  });
  console.log('✅ Lab Manager user created:', manager.email);

  // Create analyst user
  const analystPassword = await bcrypt.hash('analyst123', 10);
  const analyst = await prisma.user.upsert({
    where: { email: 'analyst@lims.local' },
    update: {},
    create: {
      email: 'analyst@lims.local',
      password: analystPassword,
      name: 'Lab Analyst',
      role: Role.ANALYST,
    },
  });
  console.log('✅ Analyst user created:', analyst.email);

  // Create sales/accounting user
  const salesPassword = await bcrypt.hash('sales123', 10);
  const sales = await prisma.user.upsert({
    where: { email: 'sales@lims.local' },
    update: {},
    create: {
      email: 'sales@lims.local',
      password: salesPassword,
      name: 'Sales Representative',
      role: Role.SALES_ACCOUNTING,
    },
  });
  console.log('✅ Sales/Accounting user created:', sales.email);

  // Create client user
  const clientPassword = await bcrypt.hash('client123', 10);
  const clientUser = await prisma.user.upsert({
    where: { email: 'client@lims.local' },
    update: {},
    create: {
      email: 'client@lims.local',
      password: clientPassword,
      name: 'Client Portal User',
      role: Role.CLIENT,
    },
  });
  console.log('✅ Client user created:', clientUser.email);

  // === MASTER DATA ===
  
  // Create Client entity
  const client = await prisma.client.create({
    data: {
      name: 'Acme Pharmaceuticals',
      contactName: 'John Smith',
      email: 'john.smith@acme.com',
      phone: '+1-555-0123',
      address: '123 Pharma Street, Medical City, MC 12345',
      createdById: admin.id,
      updatedById: admin.id,
    },
  });
  console.log('✅ Client created:', client.name);

  // Create Sections
  const microSection = await prisma.section.create({
    data: {
      name: 'Microbiology',
      createdById: admin.id,
      updatedById: admin.id,
    },
  });
  
  const chemSection = await prisma.section.create({
    data: {
      name: 'Chemistry',
      createdById: admin.id,
      updatedById: admin.id,
    },
  });
  
  const physSection = await prisma.section.create({
    data: {
      name: 'Physical',
      createdById: admin.id,
      updatedById: admin.id,
    },
  });
  console.log('✅ Sections created');

  // Create Methods
  const method1 = await prisma.method.create({
    data: {
      code: 'MET-001',
      name: 'Total Plate Count',
      description: 'Enumeration of aerobic mesophilic bacteria',
      unit: 'CFU/g',
      lod: 1.0,
      loq: 10.0,
      createdById: admin.id,
      updatedById: admin.id,
    },
  });
  
  const method2 = await prisma.method.create({
    data: {
      code: 'MET-002',
      name: 'Heavy Metals Analysis',
      description: 'ICP-MS analysis for heavy metals',
      unit: 'ppm',
      lod: 0.01,
      loq: 0.05,
      createdById: admin.id,
      updatedById: admin.id,
    },
  });
  console.log('✅ Methods created');

  // Create Specifications
  const spec1 = await prisma.specification.create({
    data: {
      code: 'SPEC-001',
      name: 'TPC Limit',
      target: '< 1000',
      max: 1000.0,
      unit: 'CFU/g',
      oosRule: 'result > 1000',
      createdById: admin.id,
      updatedById: admin.id,
    },
  });
  
  const spec2 = await prisma.specification.create({
    data: {
      code: 'SPEC-002',
      name: 'Lead Limit',
      target: '< 0.5',
      max: 0.5,
      unit: 'ppm',
      oosRule: 'result > 0.5',
      createdById: admin.id,
      updatedById: admin.id,
    },
  });
  console.log('✅ Specifications created');

  // Create Test Definitions
  const testDef1 = await prisma.testDefinition.create({
    data: {
      name: 'Total Plate Count Test',
      sectionId: microSection.id,
      methodId: method1.id,
      specificationId: spec1.id,
      defaultDueDays: 5,
      createdById: admin.id,
      updatedById: admin.id,
    },
  });
  
  const testDef2 = await prisma.testDefinition.create({
    data: {
      name: 'Heavy Metals Test',
      sectionId: chemSection.id,
      methodId: method2.id,
      specificationId: spec2.id,
      defaultDueDays: 7,
      createdById: admin.id,
      updatedById: admin.id,
    },
  });
  console.log('✅ Test Definitions created');

  // Create Test Pack
  const testPack = await prisma.testPack.create({
    data: {
      name: 'Basic 6 Micro Tests',
      createdById: admin.id,
      updatedById: admin.id,
      items: {
        create: [
          {
            order: 1,
            testDefinitionId: testDef1.id,
          },
        ],
      },
    },
  });
  console.log('✅ Test Pack created:', testPack.name);

  // === OPERATIONAL DATA ===
  
  // Create Job
  const job = await prisma.job.create({
    data: {
      jobNumber: 'JOB-2025-001',
      needByDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      status: 'ACTIVE',
      clientId: client.id,
      quoteNumber: 'Q-2025-001',
      poNumber: 'PO-2025-001',
      soNumber: 'SO-2025-001',
      amountExTax: 1500.00,
      invoiced: false,
      createdById: admin.id,
      updatedById: admin.id,
    },
  });
  console.log('✅ Job created:', job.jobNumber);

  // Create Sample
  const sample = await prisma.sample.create({
    data: {
      sampleCode: 'SAMPLE-001',
      dateReceived: new Date(),
      dateDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      sampleDescription: 'Raw material batch for testing',
      sampleBatch: 'BATCH-2025-001',
      temperatureOnReceiptC: 22.5,
      storageConditions: 'Room temperature, dry',
      jobId: job.id,
      clientId: client.id,
      createdById: admin.id,
      updatedById: admin.id,
    },
  });
  console.log('✅ Sample created:', sample.sampleCode);

  // Create Test Assignment
  const testAssignment = await prisma.testAssignment.create({
    data: {
      sampleId: sample.id,
      sectionId: microSection.id,
      methodId: method1.id,
      specificationId: spec1.id,
      testDefinitionId: testDef1.id,
      analystId: analyst.id,
      status: 'IN_PROGRESS',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      createdById: admin.id,
      updatedById: admin.id,
    },
  });
  console.log('✅ Test Assignment created');

  // Create Attachment
  const attachment = await prisma.attachment.create({
    data: {
      fileName: 'sample_image.jpg',
      fileUrl: 's3://lims-files/samples/sample-001/image.jpg',
      fileSize: 204800,
      mimeType: 'image/jpeg',
      sampleId: sample.id,
      createdById: analyst.id,
      updatedById: analyst.id,
    },
  });
  console.log('✅ Attachment created:', attachment.fileName);

  // Create COA Report
  const coaReport = await prisma.cOAReport.create({
    data: {
      sampleId: sample.id,
      version: 1,
      status: 'DRAFT',
      dataSnapshot: {
        sampleCode: sample.sampleCode,
        clientName: client.name,
        tests: [
          {
            testName: testDef1.name,
            method: method1.name,
            result: 'Pending',
          },
        ],
      },
      createdById: analyst.id,
      updatedById: analyst.id,
    },
  });
  console.log('✅ COA Report created');

  // Create Audit Log entry
  const auditLog = await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      actorEmail: admin.email,
      action: 'CREATE',
      table: 'Sample',
      recordId: sample.id,
      changes: {
        sampleCode: { old: null, new: sample.sampleCode },
        status: { old: null, new: 'created' },
      },
      at: new Date(),
    },
  });
  console.log('✅ Audit Log entry created');

  console.log('🎉 Database seeding completed!');
  console.log('\n📋 Test Users:');
  console.log('  - Admin: admin@lims.local / admin123');
  console.log('  - Lab Manager: manager@lims.local / manager123');
  console.log('  - Analyst: analyst@lims.local / analyst123');
  console.log('  - Sales/Accounting: sales@lims.local / sales123');
  console.log('  - Client: client@lims.local / client123');
  console.log('\n📊 Sample Data:');
  console.log(`  - Client: ${client.name}`);
  console.log(`  - Job: ${job.jobNumber}`);
  console.log(`  - Sample: ${sample.sampleCode}`);
  console.log(`  - Test Pack: ${testPack.name}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
