import { headers } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import type Stripe from "stripe"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "No signature provided" }, { status: 400 })
    }

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "customer.created":
        const customer = event.data.object as Stripe.Customer
        console.log("New customer created:", customer.id)
        // Add your customer creation logic here
        break

      case "customer.subscription.created":
        const subscription = event.data.object as Stripe.Subscription
        console.log("New subscription created:", subscription.id)
        // Add your subscription creation logic here
        break

      case "customer.subscription.updated":
        const updatedSubscription = event.data.object as Stripe.Subscription
        console.log("Subscription updated:", updatedSubscription.id)
        // Add your subscription update logic here
        break

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object as Stripe.Subscription
        console.log("Subscription cancelled:", deletedSubscription.id)
        // Add your subscription cancellation logic here
        break

      case "invoice.payment_succeeded":
        const invoice = event.data.object as Stripe.Invoice
        console.log("Payment succeeded for invoice:", invoice.id)
        // Add your payment success logic here
        break

      case "invoice.payment_failed":
        const failedInvoice = event.data.object as Stripe.Invoice
        console.log("Payment failed for invoice:", failedInvoice.id)
        // Add your payment failure logic here
        break

      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log("Payment intent succeeded:", paymentIntent.id)
        // Add your payment intent success logic here
        break

      case "payment_intent.payment_failed":
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent
        console.log("Payment intent failed:", failedPaymentIntent.id)
        // Add your payment intent failure logic here
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
