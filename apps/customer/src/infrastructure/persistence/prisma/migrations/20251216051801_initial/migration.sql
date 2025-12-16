-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobileNumber" TEXT,
    "creditLimit" DECIMAL(10,2) NOT NULL,
    "creditLimitCurrency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "requiredLogin" BOOLEAN NOT NULL,
    "failedLoginAttempts" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "dateConfirmed" TIMESTAMP(3),
    "lastLoginDate" TIMESTAMP(3),
    "lastActivityDate" TIMESTAMP(3),
    "lastPasswordChangeDate" TIMESTAMP(3),
    "hashedPassword" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "iterations" INTEGER NOT NULL,
    "lastIpAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "street1" TEXT NOT NULL,
    "street2" TEXT,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "zip" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_userId_key" ON "Customer"("userId");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
