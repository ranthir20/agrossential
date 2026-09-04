import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const farmerId = request.nextUrl.searchParams.get("farmerId");

    if (!farmerId) {
      return NextResponse.json(
        { error: "farmerId is required" },
        { status: 400 }
      );
    }

    const farms = await prisma.farm.findMany({
      where: {
        farmerId,
      },
      include: {
        Crop: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(farms);
  } catch (error) {
    console.error("GET /api/farms error:", error);

    return NextResponse.json(
      { error: "Failed to fetch farms" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      farmerId,
      farmName,
      village,
      district,
      state,
      area,
      areaUnit,
      soilType,
      irrigationMethod,
      latitude,
      longitude,
    } = body;

    if (
      !farmerId ||
      !farmName ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return NextResponse.json(
        {
          error:
            "farmerId, farmName, latitude and longitude are required",
        },
        { status: 400 }
      );
    }

    const farm = await prisma.farm.create({
      data: {
        id: crypto.randomUUID(),
        farmerId,
        farmName,
        village: village ?? null,
        district: district ?? null,
        state: state ?? null,
        area: area ?? null,
        areaUnit: areaUnit ?? null,
        soilType: soilType ?? null,
        irrigationMethod: irrigationMethod ?? null,
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
    });

    return NextResponse.json(farm, { status: 201 });
  } catch (error) {
    console.error("POST /api/farms error:", error);

    return NextResponse.json(
      { error: "Failed to create farm" },
      { status: 500 }
    );
  }
}
