-- CreateEnum
CREATE TYPE "ReviewRequestStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'COMPLETED');

-- CreateTable
CREATE TABLE "ExpertReviewRequest" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "farmerId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "response" TEXT,
    "expertId" TEXT,
    "status" "ReviewRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExpertReviewRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExpertReviewRequest_reportId_idx" ON "ExpertReviewRequest"("reportId");

-- CreateIndex
CREATE INDEX "ExpertReviewRequest_farmerId_idx" ON "ExpertReviewRequest"("farmerId");

-- CreateIndex
CREATE INDEX "ExpertReviewRequest_expertId_idx" ON "ExpertReviewRequest"("expertId");

-- CreateIndex
CREATE INDEX "ExpertReviewRequest_status_idx" ON "ExpertReviewRequest"("status");

-- AddForeignKey
ALTER TABLE "ExpertReviewRequest" ADD CONSTRAINT "ExpertReviewRequest_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "DiseaseReport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpertReviewRequest" ADD CONSTRAINT "ExpertReviewRequest_farmerId_fkey" FOREIGN KEY ("farmerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpertReviewRequest" ADD CONSTRAINT "ExpertReviewRequest_expertId_fkey" FOREIGN KEY ("expertId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

