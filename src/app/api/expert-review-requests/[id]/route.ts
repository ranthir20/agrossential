import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const body = await request.json();

    const {
      expertId,
      response,
      status,
    } = body;

    if (!expertId) {
      return NextResponse.json(
        { error: "expertId is required" },
        { status: 400 }
      );
    }

    const expert = await prisma.user.findUnique({
      where: { id: expertId },
    });

    if (!expert || expert.role !== "EXPERT") {
      return NextResponse.json(
        { error: "Agricultural Expert not found" },
        { status: 404 }
      );
    }

    const existingRequest =
      await prisma.expertReviewRequest.findUnique({
        where: { id },
      });

    if (!existingRequest) {
      return NextResponse.json(
        { error: "Expert review request not found" },
        { status: 404 }
      );
    }

    if (status === "COMPLETED" && !response?.trim()) {
      return NextResponse.json(
        {
          error:
            "Expert response is required when completing a request",
        },
        { status: 400 }
      );
    }

    const updated =
      await prisma.expertReviewRequest.update({
        where: { id },
        data: {
          expertId,
          response: response?.trim() || null,
          status:
            status === "IN_REVIEW"
              ? "IN_REVIEW"
              : status === "COMPLETED"
                ? "COMPLETED"
                : existingRequest.status,
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
      });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(
      "PATCH /api/expert-review-requests error:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to update expert review request",
      },
      { status: 500 }
    );
  }
}