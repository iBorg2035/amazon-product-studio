import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { aiService } from "@/lib/services/ai";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { imageUrl, category, aspectRatio } = await req.json();

    if (!imageUrl || !category) {
      return NextResponse.json({ error: "imageUrl and category are required" }, { status: 400 });
    }

    // Check credit balance
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });

    const creditCost = process.env.AI_CREDIT_COST || 65;
    if (!user || user.credits < creditCost) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
    }

    // Generate via MuAPI
    const result = await aiService.generateProductShot({
      imageUrl,
      category,
      aspectRatio: aspectRatio || "1:1",
    });

    if (!result.requestId) {
      return NextResponse.json({ error: "Generation failed" }, { status: 500 });
    }

    // Deduct credits
    await prisma.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: creditCost } },
    });

    // Log creation
    await prisma.productShot.create({
      data: {
        userId: session.user.id,
        requestId: result.requestId,
        imageUrl,
        category,
        aspectRatio: aspectRatio || "1:1",
        status: "processing",
      },
    });

    return NextResponse.json({
      requestId: result.requestId,
      remainingCredits: user.credits - creditCost,
    });
  } catch (error) {
    console.error("Product generation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
