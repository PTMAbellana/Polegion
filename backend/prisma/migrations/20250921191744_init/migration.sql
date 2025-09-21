-- AlterTable
ALTER TABLE "public"."_CompetitionToProblem" ADD CONSTRAINT "_CompetitionToProblem_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "public"."_CompetitionToProblem_AB_unique";
