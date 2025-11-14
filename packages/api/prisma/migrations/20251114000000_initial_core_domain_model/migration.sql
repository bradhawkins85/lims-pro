-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'LAB_MANAGER', 'ANALYST', 'SALES_ACCOUNTING', 'CLIENT');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TestAssignmentStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'COMPLETED', 'REVIEWED', 'RELEASED');

-- CreateEnum
CREATE TYPE "COAReportStatus" AS ENUM ('DRAFT', 'FINAL', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "contactName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" UUID NOT NULL,
    "updatedById" UUID NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Method" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "unit" TEXT,
    "lod" DOUBLE PRECISION,
    "loq" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" UUID NOT NULL,
    "updatedById" UUID NOT NULL,

    CONSTRAINT "Method_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specification" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "target" TEXT,
    "min" DOUBLE PRECISION,
    "max" DOUBLE PRECISION,
    "unit" TEXT,
    "oosRule" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" UUID NOT NULL,
    "updatedById" UUID NOT NULL,

    CONSTRAINT "Specification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" UUID NOT NULL,
    "updatedById" UUID NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestDefinition" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "defaultDueDays" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" UUID NOT NULL,
    "updatedById" UUID NOT NULL,
    "sectionId" UUID NOT NULL,
    "methodId" UUID NOT NULL,
    "specificationId" UUID,

    CONSTRAINT "TestDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestPack" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" UUID NOT NULL,
    "updatedById" UUID NOT NULL,

    CONSTRAINT "TestPack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestPackItem" (
    "id" UUID NOT NULL,
    "order" INTEGER NOT NULL,
    "testPackId" UUID NOT NULL,
    "testDefinitionId" UUID NOT NULL,

    CONSTRAINT "TestPackItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" UUID NOT NULL,
    "jobNumber" TEXT NOT NULL,
    "needByDate" TIMESTAMP(3),
    "mcdDate" TIMESTAMP(3),
    "status" "JobStatus" NOT NULL DEFAULT 'DRAFT',
    "quoteNumber" TEXT,
    "poNumber" TEXT,
    "soNumber" TEXT,
    "amountExTax" DECIMAL(12,2),
    "invoiced" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" UUID NOT NULL,
    "updatedById" UUID NOT NULL,
    "clientId" UUID NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sample" (
    "id" UUID NOT NULL,
    "dateReceived" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateDue" TIMESTAMP(3),
    "sampleCode" TEXT NOT NULL,
    "rmSupplier" TEXT,
    "sampleDescription" TEXT,
    "uinCode" TEXT,
    "sampleBatch" TEXT,
    "temperatureOnReceiptC" DECIMAL(5,2),
    "storageConditions" TEXT,
    "comments" TEXT,
    "expiredRawMaterial" BOOLEAN NOT NULL DEFAULT false,
    "postIrradiatedRawMaterial" BOOLEAN NOT NULL DEFAULT false,
    "stabilityStudy" BOOLEAN NOT NULL DEFAULT false,
    "urgent" BOOLEAN NOT NULL DEFAULT false,
    "allMicroTestsAssigned" BOOLEAN NOT NULL DEFAULT false,
    "allChemistryTestsAssigned" BOOLEAN NOT NULL DEFAULT false,
    "released" BOOLEAN NOT NULL DEFAULT false,
    "retest" BOOLEAN NOT NULL DEFAULT false,
    "releaseDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" UUID NOT NULL,
    "updatedById" UUID NOT NULL,
    "jobId" UUID NOT NULL,
    "clientId" UUID NOT NULL,

    CONSTRAINT "Sample_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestAssignment" (
    "id" UUID NOT NULL,
    "customTestName" TEXT,
    "dueDate" TIMESTAMP(3),
    "status" "TestAssignmentStatus" NOT NULL DEFAULT 'DRAFT',
    "testDate" TIMESTAMP(3),
    "result" TEXT,
    "resultUnit" TEXT,
    "oos" BOOLEAN NOT NULL DEFAULT false,
    "comments" TEXT,
    "invoiceNote" TEXT,
    "precision" TEXT,
    "linearity" TEXT,
    "chkDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" UUID NOT NULL,
    "updatedById" UUID NOT NULL,
    "sampleId" UUID NOT NULL,
    "sectionId" UUID NOT NULL,
    "methodId" UUID NOT NULL,
    "specificationId" UUID,
    "testDefinitionId" UUID,
    "analystId" UUID,
    "chkById" UUID,

    CONSTRAINT "TestAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" UUID NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" UUID NOT NULL,
    "updatedById" UUID NOT NULL,
    "sampleId" UUID,
    "testAssignmentId" UUID,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "COAReport" (
    "id" UUID NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" "COAReportStatus" NOT NULL DEFAULT 'DRAFT',
    "dataSnapshot" JSONB NOT NULL,
    "htmlSnapshot" TEXT,
    "pdfKey" TEXT,
    "reportedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" UUID NOT NULL,
    "updatedById" UUID NOT NULL,
    "sampleId" UUID NOT NULL,
    "reportedById" UUID,
    "approvedById" UUID,

    CONSTRAINT "COAReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" UUID NOT NULL,
    "actorId" UUID NOT NULL,
    "actorEmail" TEXT NOT NULL,
    "ip" TEXT,
    "userAgent" TEXT,
    "action" "AuditAction" NOT NULL,
    "table" TEXT NOT NULL,
    "recordId" UUID NOT NULL,
    "changes" JSONB,
    "reason" TEXT,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "txId" TEXT,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Client_name_idx" ON "Client"("name");

-- CreateIndex
CREATE INDEX "Client_email_idx" ON "Client"("email");

-- CreateIndex
CREATE INDEX "Client_createdById_idx" ON "Client"("createdById");

-- CreateIndex
CREATE INDEX "Client_updatedById_idx" ON "Client"("updatedById");

-- CreateIndex
CREATE UNIQUE INDEX "Method_code_key" ON "Method"("code");

-- CreateIndex
CREATE INDEX "Method_code_idx" ON "Method"("code");

-- CreateIndex
CREATE INDEX "Method_name_idx" ON "Method"("name");

-- CreateIndex
CREATE INDEX "Method_createdById_idx" ON "Method"("createdById");

-- CreateIndex
CREATE INDEX "Method_updatedById_idx" ON "Method"("updatedById");

-- CreateIndex
CREATE UNIQUE INDEX "Specification_code_key" ON "Specification"("code");

-- CreateIndex
CREATE INDEX "Specification_code_idx" ON "Specification"("code");

-- CreateIndex
CREATE INDEX "Specification_name_idx" ON "Specification"("name");

-- CreateIndex
CREATE INDEX "Specification_createdById_idx" ON "Specification"("createdById");

-- CreateIndex
CREATE INDEX "Specification_updatedById_idx" ON "Specification"("updatedById");

-- CreateIndex
CREATE UNIQUE INDEX "Section_name_key" ON "Section"("name");

-- CreateIndex
CREATE INDEX "Section_name_idx" ON "Section"("name");

-- CreateIndex
CREATE INDEX "Section_createdById_idx" ON "Section"("createdById");

-- CreateIndex
CREATE INDEX "Section_updatedById_idx" ON "Section"("updatedById");

-- CreateIndex
CREATE INDEX "TestDefinition_name_idx" ON "TestDefinition"("name");

-- CreateIndex
CREATE INDEX "TestDefinition_sectionId_idx" ON "TestDefinition"("sectionId");

-- CreateIndex
CREATE INDEX "TestDefinition_methodId_idx" ON "TestDefinition"("methodId");

-- CreateIndex
CREATE INDEX "TestDefinition_specificationId_idx" ON "TestDefinition"("specificationId");

-- CreateIndex
CREATE INDEX "TestDefinition_createdById_idx" ON "TestDefinition"("createdById");

-- CreateIndex
CREATE INDEX "TestDefinition_updatedById_idx" ON "TestDefinition"("updatedById");

-- CreateIndex
CREATE UNIQUE INDEX "TestPack_name_key" ON "TestPack"("name");

-- CreateIndex
CREATE INDEX "TestPack_name_idx" ON "TestPack"("name");

-- CreateIndex
CREATE INDEX "TestPack_createdById_idx" ON "TestPack"("createdById");

-- CreateIndex
CREATE INDEX "TestPack_updatedById_idx" ON "TestPack"("updatedById");

-- CreateIndex
CREATE INDEX "TestPackItem_testPackId_idx" ON "TestPackItem"("testPackId");

-- CreateIndex
CREATE INDEX "TestPackItem_testDefinitionId_idx" ON "TestPackItem"("testDefinitionId");

-- CreateIndex
CREATE INDEX "TestPackItem_order_idx" ON "TestPackItem"("order");

-- CreateIndex
CREATE UNIQUE INDEX "TestPackItem_testPackId_testDefinitionId_key" ON "TestPackItem"("testPackId", "testDefinitionId");

-- CreateIndex
CREATE UNIQUE INDEX "Job_jobNumber_key" ON "Job"("jobNumber");

-- CreateIndex
CREATE INDEX "Job_jobNumber_idx" ON "Job"("jobNumber");

-- CreateIndex
CREATE INDEX "Job_clientId_idx" ON "Job"("clientId");

-- CreateIndex
CREATE INDEX "Job_status_idx" ON "Job"("status");

-- CreateIndex
CREATE INDEX "Job_createdById_idx" ON "Job"("createdById");

-- CreateIndex
CREATE INDEX "Job_updatedById_idx" ON "Job"("updatedById");

-- CreateIndex
CREATE UNIQUE INDEX "Sample_sampleCode_key" ON "Sample"("sampleCode");

-- CreateIndex
CREATE INDEX "Sample_sampleCode_idx" ON "Sample"("sampleCode");

-- CreateIndex
CREATE INDEX "Sample_jobId_idx" ON "Sample"("jobId");

-- CreateIndex
CREATE INDEX "Sample_clientId_idx" ON "Sample"("clientId");

-- CreateIndex
CREATE INDEX "Sample_dateReceived_idx" ON "Sample"("dateReceived");

-- CreateIndex
CREATE INDEX "Sample_dateDue_idx" ON "Sample"("dateDue");

-- CreateIndex
CREATE INDEX "Sample_released_idx" ON "Sample"("released");

-- CreateIndex
CREATE INDEX "Sample_createdById_idx" ON "Sample"("createdById");

-- CreateIndex
CREATE INDEX "Sample_updatedById_idx" ON "Sample"("updatedById");

-- CreateIndex
CREATE INDEX "TestAssignment_sampleId_idx" ON "TestAssignment"("sampleId");

-- CreateIndex
CREATE INDEX "TestAssignment_sectionId_idx" ON "TestAssignment"("sectionId");

-- CreateIndex
CREATE INDEX "TestAssignment_methodId_idx" ON "TestAssignment"("methodId");

-- CreateIndex
CREATE INDEX "TestAssignment_specificationId_idx" ON "TestAssignment"("specificationId");

-- CreateIndex
CREATE INDEX "TestAssignment_testDefinitionId_idx" ON "TestAssignment"("testDefinitionId");

-- CreateIndex
CREATE INDEX "TestAssignment_analystId_idx" ON "TestAssignment"("analystId");

-- CreateIndex
CREATE INDEX "TestAssignment_chkById_idx" ON "TestAssignment"("chkById");

-- CreateIndex
CREATE INDEX "TestAssignment_status_idx" ON "TestAssignment"("status");

-- CreateIndex
CREATE INDEX "TestAssignment_testDate_idx" ON "TestAssignment"("testDate");

-- CreateIndex
CREATE INDEX "TestAssignment_createdById_idx" ON "TestAssignment"("createdById");

-- CreateIndex
CREATE INDEX "TestAssignment_updatedById_idx" ON "TestAssignment"("updatedById");

-- CreateIndex
CREATE INDEX "Attachment_fileName_idx" ON "Attachment"("fileName");

-- CreateIndex
CREATE INDEX "Attachment_sampleId_idx" ON "Attachment"("sampleId");

-- CreateIndex
CREATE INDEX "Attachment_testAssignmentId_idx" ON "Attachment"("testAssignmentId");

-- CreateIndex
CREATE INDEX "Attachment_createdById_idx" ON "Attachment"("createdById");

-- CreateIndex
CREATE INDEX "Attachment_updatedById_idx" ON "Attachment"("updatedById");

-- CreateIndex
CREATE INDEX "COAReport_sampleId_idx" ON "COAReport"("sampleId");

-- CreateIndex
CREATE INDEX "COAReport_version_idx" ON "COAReport"("version");

-- CreateIndex
CREATE INDEX "COAReport_status_idx" ON "COAReport"("status");

-- CreateIndex
CREATE INDEX "COAReport_reportedAt_idx" ON "COAReport"("reportedAt");

-- CreateIndex
CREATE INDEX "COAReport_reportedById_idx" ON "COAReport"("reportedById");

-- CreateIndex
CREATE INDEX "COAReport_approvedById_idx" ON "COAReport"("approvedById");

-- CreateIndex
CREATE INDEX "COAReport_createdById_idx" ON "COAReport"("createdById");

-- CreateIndex
CREATE INDEX "COAReport_updatedById_idx" ON "COAReport"("updatedById");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_table_idx" ON "AuditLog"("table");

-- CreateIndex
CREATE INDEX "AuditLog_recordId_idx" ON "AuditLog"("recordId");

-- CreateIndex
CREATE INDEX "AuditLog_at_idx" ON "AuditLog"("at");

-- CreateIndex
CREATE INDEX "AuditLog_txId_idx" ON "AuditLog"("txId");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Method" ADD CONSTRAINT "Method_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Method" ADD CONSTRAINT "Method_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Specification" ADD CONSTRAINT "Specification_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Specification" ADD CONSTRAINT "Specification_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestDefinition" ADD CONSTRAINT "TestDefinition_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestDefinition" ADD CONSTRAINT "TestDefinition_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestDefinition" ADD CONSTRAINT "TestDefinition_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestDefinition" ADD CONSTRAINT "TestDefinition_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "Method"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestDefinition" ADD CONSTRAINT "TestDefinition_specificationId_fkey" FOREIGN KEY ("specificationId") REFERENCES "Specification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestPack" ADD CONSTRAINT "TestPack_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestPack" ADD CONSTRAINT "TestPack_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestPackItem" ADD CONSTRAINT "TestPackItem_testPackId_fkey" FOREIGN KEY ("testPackId") REFERENCES "TestPack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestPackItem" ADD CONSTRAINT "TestPackItem_testDefinitionId_fkey" FOREIGN KEY ("testDefinitionId") REFERENCES "TestDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sample" ADD CONSTRAINT "Sample_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAssignment" ADD CONSTRAINT "TestAssignment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAssignment" ADD CONSTRAINT "TestAssignment_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAssignment" ADD CONSTRAINT "TestAssignment_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "Sample"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAssignment" ADD CONSTRAINT "TestAssignment_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAssignment" ADD CONSTRAINT "TestAssignment_methodId_fkey" FOREIGN KEY ("methodId") REFERENCES "Method"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAssignment" ADD CONSTRAINT "TestAssignment_specificationId_fkey" FOREIGN KEY ("specificationId") REFERENCES "Specification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAssignment" ADD CONSTRAINT "TestAssignment_testDefinitionId_fkey" FOREIGN KEY ("testDefinitionId") REFERENCES "TestDefinition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAssignment" ADD CONSTRAINT "TestAssignment_analystId_fkey" FOREIGN KEY ("analystId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAssignment" ADD CONSTRAINT "TestAssignment_chkById_fkey" FOREIGN KEY ("chkById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "Sample"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_testAssignmentId_fkey" FOREIGN KEY ("testAssignmentId") REFERENCES "TestAssignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "COAReport" ADD CONSTRAINT "COAReport_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "COAReport" ADD CONSTRAINT "COAReport_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "COAReport" ADD CONSTRAINT "COAReport_sampleId_fkey" FOREIGN KEY ("sampleId") REFERENCES "Sample"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "COAReport" ADD CONSTRAINT "COAReport_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "COAReport" ADD CONSTRAINT "COAReport_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
