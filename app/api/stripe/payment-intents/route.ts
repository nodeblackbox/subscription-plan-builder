import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const customer = searchParams.get("customer")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const startingAfter = searchParams.get("starting_after")

    const params: any = {
      limit,
    }

    if (customer) {
      params.customer = customer
    }

    if (startingAfter) {
      params.starting_after = startingAfter
    }

    const paymentIntents = await stripe.paymentIntents.list(params)

    return NextResponse.json({
      success: true,
      orders: paymentIntents.data.map((pi) => ({
        id: pi.id,
        customer: pi.customer,
        amount_total: pi.amount,
        currency: pi.currency,
        payment_status: pi.status === "succeeded" ? "paid" : "unpaid",
        status: pi.status === "succeeded" ? "complete" : "open",
        created: pi.created,
        metadata: pi.metadata,
        payment_intent: pi,
      })),
      has_more: paymentIntents.has_more,
    })
  } catch (error: any) {
    console.error("Error fetching payment intents:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
