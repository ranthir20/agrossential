import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const expertId = request.nextUrl.searchParams.get("expertId");

    const validations = await prisma.expertValidation.findMany({
      where: expertId ? { expertId } : undefined,
      include: {
        User: true,
        DiseaseReport: {
          include: {
            Crop: {
              include: {
                Farm: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(validations);
  } catch (error) {
    console.error("GET /api/expert-validations error:", error);

    return NextResponse.json(
      { error: "Failed to fetch expert validations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      reportId,
      expertId,
      finalDisease,
      decision,
      comments,
    } = body;

    if (!reportId || !expertId || !decision) {
      return NextResponse.json(
        {
          error: "reportId, expertId and decision are required",
        },
        { status: 400 }
      );
    }

    if (
      !["CONFIRMED", "REJECTED", "UNCERTAIN"].includes(decision)
    ) {
      return NextResponse.json(
        {
          error:
            "decision must be CONFIRMED, REJECTED or UNCERTAIN",
        },
        { status: 400 }
      );
    }

    const expert = await prisma.user.findUnique({
      where: {
        id: expertId,
      },
    });

    if (!expert || expert.role !== "EXPERT") {
      return NextResponse.json(
        { error: "Agricultural Expert not found" },
        { status: 404 }
      );
    }

    const report = await prisma.diseaseReport.findUnique({
      where: {
        id: reportId,
      },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Disease report not found" },
        { status: 404 }
      );
    }

    const existingValidation =
      await prisma.expertValidation.findUnique({
        where: {
          reportId,
        },
      });

    if (existingValidation) {
      return NextResponse.json(
        {
          error: "This disease report has already been validated",
        },
        { status: 409 }
      );
    }

    const validation = await prisma.$transaction(async (tx) => {
      const newValidation = await tx.expertValidation.create({
        data: {
          id: crypto.randomUUID(),
          reportId,
          expertId,
          finalDisease: finalDisease ?? null,
          decision,
          comments: comments ?? null,
        },
        include: {
          User: true,
          DiseaseReport: {
            include: {
              Crop: {
                include: {
                  Farm: true,
                },
              },
            },
          },
        },
      });

      const reportStatus =
        decision === "CONFIRMED"
          ? "CONFIRMED"
          : decision === "REJECTED"
            ? "REJECTED"
            : "PENDING";

      await tx.diseaseReport.update({
        where: {
          id: reportId,
        },
        data: {
          status: reportStatus,
        },
      });

      return newValidation;
    });

    return NextResponse.json(validation, { status: 201 });
  } catch (error) {
    console.error("POST /api/expert-validations error:", error);

    return NextResponse.json(
      { error: "Failed to create expert validation" },
      { status: 500 }
    );
  }
}
