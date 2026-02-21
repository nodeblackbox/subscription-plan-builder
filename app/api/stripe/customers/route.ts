import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const email = searchParams.get("email")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const startingAfter = searchParams.get("starting_after")

    const params: any = {
      limit,
      expand: ["data.subscriptions"],
    }

    if (email) {
      params.email = email
    }

    if (startingAfter) {
      params.starting_after = startingAfter
    }

    const customers = await stripe.customers.list(params)

    return NextResponse.json({
      success: true,
      customers: customers.data,
      has_more: customers.has_more,
    })
  } catch (error: any) {
    console.error("Error fetching customers:", error)
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
    const { name, email, phone, address, metadata } = body

    const customer = await stripe.customers.create({
      name,
      email,
      phone,
      address,
      metadata,
    })

    return NextResponse.json({
      success: true,
      customer,
    })
  } catch (error: any) {
    console.error("Error creating customer:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
