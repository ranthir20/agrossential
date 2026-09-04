import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const cropId = request.nextUrl.searchParams.get("cropId");
    const status = request.nextUrl.searchParams.get("status");

    const validStatuses = ["PENDING", "CONFIRMED", "REJECTED"];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        {
          error:
            "status must be PENDING, CONFIRMED or REJECTED",
        },
        { status: 400 }
      );
    }

    const reports = await prisma.diseaseReport.findMany({
      where: {
        ...(cropId ? { cropId } : {}),
        ...(status
          ? {
              status:
                status as
                  | "PENDING"
                  | "CONFIRMED"
                  | "REJECTED",
            }
          : {}),
      },
      include: {
        Crop: {
          include: {
            Farm: true,
          },
        },
        ExpertValidation: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("GET /api/disease-reports error:", error);

    return NextResponse.json(
      { error: "Failed to fetch disease reports" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      cropId,
      imageUrl,
      predictedDisease,
      confidence,
    } = body;

    if (!cropId || !predictedDisease) {
      return NextResponse.json(
        {
          error:
            "cropId and predictedDisease are required",
        },
        { status: 400 }
      );
    }

    const crop = await prisma.crop.findUnique({
      where: {
        id: cropId,
      },
    });

    if (!crop) {
      return NextResponse.json(
        {
          error: "Crop not found",
        },
        { status: 404 }
      );
    }

    const report = await prisma.diseaseReport.create({
      data: {
        id: crypto.randomUUID(),
        cropId,
        imageUrl: imageUrl ?? null,
        predictedDisease,
        confidence:
          confidence !== undefined &&
          confidence !== null
            ? Number(confidence)
            : null,
        status: "PENDING",
      },
      include: {
        Crop: {
          include: {
            Farm: true,
          },
        },
      },
    });

    return NextResponse.json(
      report,
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST /api/disease-reports error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create disease report",
      },
      { status: 500 }
    );
  }
}
