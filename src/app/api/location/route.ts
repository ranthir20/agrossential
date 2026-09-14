import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://ipwho.is/", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Location service returned ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Unable to determine location");
    }

    return NextResponse.json({
      city: data.city || "",
      state: data.region || "",
      country: data.country || "",
      countryCode: data.country_code || "",
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      source: "ip",
    });
  } catch (error) {
    console.error("GET /api/location error:", error);

    return NextResponse.json(
      { error: "Unable to determine location" },
      { status: 500 }
    );
  }
}
