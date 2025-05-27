-- CreateTable
CREATE TABLE "Bid" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "serviceProviderId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
