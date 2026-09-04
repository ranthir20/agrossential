import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const farmerId =
      request.nextUrl.searchParams.get("farmerId");

    const expertId =
      request.nextUrl.searchParams.get("expertId");

    const reportId =
      request.nextUrl.searchParams.get("reportId");

    const requests =
      await prisma.expertReviewRequest.findMany({
        where: {
          ...(farmerId ? { farmerId } : {}),
          ...(expertId ? { expertId } : {}),
          ...(reportId ? { reportId } : {}),
        },
        include: {
          Farmer: true,
          Expert: true,
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

    return NextResponse.json(requests);
  } catch (error) {
    console.error(
      "GET /api/expert-review-requests error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch expert review requests",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      reportId,
      farmerId,
      question,
    } = body;

    if (
      !reportId ||
      !farmerId ||
      !question?.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "reportId, farmerId and question are required",
        },
        { status: 400 }
      );
    }

    const farmer =
      await prisma.user.findUnique({
        where: {
          id: farmerId,
        },
      });

    if (!farmer || farmer.role !== "FARMER") {
      return NextResponse.json(
        {
          error: "Farmer not found",
        },
        { status: 404 }
      );
    }

    const report =
      await prisma.diseaseReport.findUnique({
        where: {
          id: reportId,
        },
      });

    if (!report) {
      return NextResponse.json(
        {
          error: "Disease report not found",
        },
        { status: 404 }
      );
    }

    const reviewRequest =
      await prisma.expertReviewRequest.create({
        data: {
          id: crypto.randomUUID(),
          reportId,
          farmerId,
          question: question.trim(),
          status: "PENDING",
        },
        include: {
          Farmer: true,
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

    return NextResponse.json(
      reviewRequest,
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST /api/expert-review-requests error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create expert review request",
      },
      { status: 500 }
    );
  }
}