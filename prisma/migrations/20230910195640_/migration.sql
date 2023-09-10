-- CreateTable
CREATE TABLE "ProductLog" (
    "id" SERIAL NOT NULL,
    "errorCode" INTEGER,
    "data" TEXT,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductLog_pkey" PRIMARY KEY ("id")
);
