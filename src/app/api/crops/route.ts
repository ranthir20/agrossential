import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const farmId = request.nextUrl.searchParams.get("farmId");

    if (!farmId) {
      return NextResponse.json(
        { error: "farmId is required" },
        { status: 400 }
      );
    }

    const crops = await prisma.crop.findMany({
      where: {
        farmId,
      },
      include: {
        DiseaseReport: true,
        RiskAssessment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(crops);
  } catch (error) {
    console.error("GET /api/crops error:", error);

    return NextResponse.json(
      { error: "Failed to fetch crops" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      farmId,
      crop,
      variety,
      sowingDate,
      growthStage,
      cropHealth,
    } = body;

    if (!farmId || !crop || !sowingDate) {
      return NextResponse.json(
        {
          error: "farmId, crop and sowingDate are required",
        },
        { status: 400 }
      );
    }

    const farm = await prisma.farm.findUnique({
      where: {
        id: farmId,
      },
    });

    if (!farm) {
      return NextResponse.json(
        { error: "Farm not found" },
        { status: 404 }
      );
    }

    const parsedSowingDate = new Date(sowingDate);

    if (Number.isNaN(parsedSowingDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid sowingDate" },
        { status: 400 }
      );
    }

    const newCrop = await prisma.crop.create({
      data: {
        id: crypto.randomUUID(),
        farmId,
        crop,
        variety: variety ?? null,
        sowingDate: parsedSowingDate,
        growthStage: growthStage ?? null,
        cropHealth: cropHealth ?? null,
      },
    });

    return NextResponse.json(newCrop, { status: 201 });
  } catch (error) {
    console.error("POST /api/crops error:", error);

    return NextResponse.json(
      { error: "Failed to create crop" },
      { status: 500 }
    );
  }
}
