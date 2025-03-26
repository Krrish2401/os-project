-- DropForeignKey
ALTER TABLE "Directory" DROP CONSTRAINT "Directory_parentId_fkey";

-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_dirId_fkey";

-- AddForeignKey
ALTER TABLE "Directory" ADD CONSTRAINT "Directory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Directory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_dirId_fkey" FOREIGN KEY ("dirId") REFERENCES "Directory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
