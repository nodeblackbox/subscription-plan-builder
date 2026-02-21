export interface Customer {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  created: number
  address?: {
    line1?: string | null
    line2?: string | null
    city?: string | null
    state?: string | null
    postal_code?: string | null
    country?: string | null
  } | null
  metadata?: Record<string, string>
}

export interface Product {
  id: string
  name: string
  description: string | null
  images: string[]
  metadata: Record<string, string>
  active: boolean
  created: number
  updated: number
}

export interface Price {
  id: string
  product: string | Product
  active: boolean
  currency: string
  unit_amount: number | null
  recurring: {
    interval: "day" | "week" | "month" | "year"
    interval_count: number
  } | null
  type: "one_time" | "recurring"
  created: number
  metadata: Record<string, string>
}

export interface Subscription {
  id: string
  customer: string | Customer
  status: "incomplete" | "incomplete_expired" | "trialing" | "active" | "past_due" | "canceled" | "unpaid" | "paused"
  current_period_start: number
  current_period_end: number
  created: number
  items: {
    data: Array<{
      id: string
      price: Price
      quantity: number
    }>
  }
  metadata: Record<string, string>
}

export interface Invoice {
  id: string
  customer: string | Customer
  subscription: string | null
  status: "draft" | "open" | "paid" | "uncollectible" | "void"
  amount_due: number
  amount_paid: number
  amount_remaining: number
  currency: string
  created: number
  due_date: number | null
  hosted_invoice_url: string | null
  invoice_pdf: string | null
  number: string | null
  metadata: Record<string, string>
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status:
    | "requires_payment_method"
    | "requires_confirmation"
    | "requires_action"
    | "processing"
    | "requires_capture"
    | "canceled"
    | "succeeded"
  customer: string | null
  created: number
  metadata: Record<string, string>
}

export interface Order {
  id: string
  customer: string | Customer | null
  amount_total: number
  currency: string
  payment_status: "paid" | "unpaid" | "no_payment_required"
  status: "open" | "complete" | "expired"
  created: number
  metadata: Record<string, string>
  line_items?: Array<{
    id: string
    description: string
    amount_total: number
    quantity: number
  }>
}
