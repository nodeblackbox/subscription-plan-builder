import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const customer = await stripe.customers.retrieve(params.id, {
      expand: ["subscriptions", "sources"],
    })

    // Get payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: params.id,
      type: "card",
    })

    // Get recent invoices
    const invoices = await stripe.invoices.list({
      customer: params.id,
      limit: 10,
    })

    // Get recent charges
    const charges = await stripe.charges.list({
      customer: params.id,
      limit: 10,
    })

    return NextResponse.json({
      success: true,
      customer,
      paymentMethods: paymentMethods.data,
      invoices: invoices.data,
      charges: charges.data,
    })
  } catch (error: any) {
    console.error("Error fetching customer:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, email, phone, address, metadata } = body

    const customer = await stripe.customers.update(params.id, {
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
    console.error("Error updating customer:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await stripe.customers.del(params.id)

    return NextResponse.json({
      success: true,
      deleted,
    })
  } catch (error: any) {
    console.error("Error deleting customer:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
