import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const product = searchParams.get("product")
    const active = searchParams.get("active")
    const type = searchParams.get("type")
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    const params: any = {
      limit,
      expand: ["data.product"],
    }

    if (product) {
      params.product = product
    }

    if (active !== null) {
      params.active = active === "true"
    }

    if (type) {
      params.type = type
    }

    const prices = await stripe.prices.list(params)

    // Filter for recurring prices (subscription plans)
    const subscriptionPrices = prices.data.filter((price) => price.type === "recurring")

    return NextResponse.json({
      success: true,
      subscriptions: subscriptionPrices,
      prices: prices.data,
    })
  } catch (error: any) {
    console.error("Error fetching prices:", error)
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
    const { product, unit_amount, currency, recurring, metadata } = body

    const price = await stripe.prices.create({
      product,
      unit_amount,
      currency,
      recurring,
      metadata,
    })

    return NextResponse.json({
      success: true,
      price,
    })
  } catch (error: any) {
    console.error("Error creating price:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
