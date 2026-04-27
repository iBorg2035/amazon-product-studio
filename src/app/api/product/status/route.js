import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { aiService } from "@/lib/services/ai";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const requestId = searchParams.get("requestId");

    if (!requestId) {
      return NextResponse.json({ error: "requestId is required" }, { status: 400 });
    }

    // Check local DB first
    const shot = await prisma.productShot.findFirst({
      where: { requestId, userId: session.user.id },
    });

    if (!shot) {
      return NextResponse.json({ error: "Shot not found" }, { status: 404 });
    }

    // Check MuAPI status
    const status = await aiService.checkProductShotStatus(requestId);

    // Update local record if status changed
    if (status.status !== shot.status) {
      await prisma.productShot.update({
        where: { id: shot.id },
        data: {
          status: status.status,
          resultUrl: status.resultUrl || shot.resultUrl,
        },
      });
    }

    return NextResponse.json({
      requestId,
      status: status.status,
      resultUrl: status.resultUrl || shot.resultUrl,
    });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
