import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const customer = searchParams.get("customer")
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const startingAfter = searchParams.get("starting_after")

    const params: any = {
      limit,
      expand: ["data.customer", "data.items.data.price"],
    }

    if (customer) {
      params.customer = customer
    }

    if (status) {
      params.status = status
    }

    if (startingAfter) {
      params.starting_after = startingAfter
    }

    const subscriptions = await stripe.subscriptions.list(params)

    return NextResponse.json({
      success: true,
      subscriptions: subscriptions.data,
      has_more: subscriptions.has_more,
    })
  } catch (error: any) {
    console.error("Error fetching subscriptions:", error)
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
    const { customer, items, trial_period_days, metadata } = body

    const subscription = await stripe.subscriptions.create({
      customer,
      items,
      trial_period_days,
      metadata,
      expand: ["latest_invoice.payment_intent"],
    })

    return NextResponse.json({
      success: true,
      subscription,
    })
  } catch (error: any) {
    console.error("Error creating subscription:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
