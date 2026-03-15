import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      productId,
      imageUrl,
      altText,
      priority = 5,
      isPrimary = false,
    } = body;

    // Basic validation
    if (!productId || !imageUrl) {
      return NextResponse.json(
        { error: "productId and imageUrl are required" },
        { status: 400 }
      );
    }

    // If setting this image as primary,
    // unset previous primary images for the product
    if (isPrimary) {
      await prisma.productImage.updateMany({
        where: {
          productId,
          isPrimary: true,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    const image = await prisma.productImage.create({
      data: {
        productId,
        imageUrl,
        altText,
        priority,
        isPrimary,
      },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error("Create Product Image Error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
