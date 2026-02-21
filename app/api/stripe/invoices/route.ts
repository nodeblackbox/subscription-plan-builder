import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const customer = searchParams.get("customer")
    const subscription = searchParams.get("subscription")
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const startingAfter = searchParams.get("starting_after")

    const params: any = {
      limit,
      expand: ["data.customer", "data.subscription"],
    }

    if (customer) {
      params.customer = customer
    }

    if (subscription) {
      params.subscription = subscription
    }

    if (status) {
      params.status = status
    }

    if (startingAfter) {
      params.starting_after = startingAfter
    }

    const invoices = await stripe.invoices.list(params)

    return NextResponse.json({
      success: true,
      invoices: invoices.data,
      has_more: invoices.has_more,
    })
  } catch (error: any) {
    console.error("Error fetching invoices:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
