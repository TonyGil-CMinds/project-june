-- CreateTable
CREATE TABLE "CeibaRegistration" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "motivation" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'es',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CeibaRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CeibaRegistration_email_key" ON "CeibaRegistration"("email");

-- CreateIndex
CREATE INDEX "CeibaRegistration_createdAt_idx" ON "CeibaRegistration"("createdAt");
