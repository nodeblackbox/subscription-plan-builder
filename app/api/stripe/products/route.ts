import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const active = searchParams.get("active")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const params: any = {
      limit,
      expand: ["data.default_price"],
    }

    if (active !== null) {
      params.active = active === "true"
    }

    const products = await stripe.products.list(params)

    return NextResponse.json({
      success: true,
      products: products.data,
    })
  } catch (error: any) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, images, metadata } = body

    const product = await stripe.products.create({
      name,
      description,
      images,
      metadata,
    })

    return NextResponse.json({
      success: true,
      product,
    })
  } catch (error: any) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
