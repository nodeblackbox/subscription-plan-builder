"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Zap, Users, BarChart3, Coins, Clock } from "lucide-react"

interface PlanTypeSelectorProps {
  data: any
  setData: (data: any) => void
}

const planTypes = [
  {
    id: "freemium",
    title: "Freemium Model",
    description: "Free tier with premium upgrades",
    icon: Users,
    features: ["Free starter plan", "Limited features", "Upgrade prompts", "User onboarding"],
    badge: "Popular",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "tiered",
    title: "Tiered Pricing",
    description: "Multiple pricing tiers with different features",
    icon: BarChart3,
    features: ["3-5 pricing tiers", "Feature differentiation", "Clear value proposition", "Upgrade paths"],
    badge: "Recommended",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "credit-based",
    title: "Credit System",
    description: "Pay-per-use with credits or tokens",
    icon: Coins,
    features: ["Flexible usage", "API token allocation", "Credit packages", "Usage tracking"],
    badge: "Flexible",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "usage-based",
    title: "Usage-Based",
    description: "Pay based on actual consumption",
    icon: Zap,
    features: ["Metered billing", "Scalable pricing", "Usage analytics", "Fair pricing"],
    badge: "Scalable",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "subscription",
    title: "Fixed Subscription",
    description: "Traditional monthly/yearly plans",
    icon: CreditCard,
    features: ["Predictable revenue", "Simple billing", "Annual discounts", "Easy management"],
    badge: "Classic",
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "hybrid",
    title: "Hybrid Model",
    description: "Combination of subscription + usage",
    icon: Clock,
    features: ["Base subscription", "Usage overages", "Flexible limits", "Best of both worlds"],
    badge: "Advanced",
    color: "from-pink-500 to-rose-500",
  },
]

export function PlanTypeSelector({ data, setData }: PlanTypeSelectorProps) {
  const handleSelectPlanType = (planTypeId: string) => {
    setData({ ...data, planType: planTypeId })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Choose Your Subscription Model</h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Select the pricing strategy that best fits your SaaS platform and business goals
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {planTypes.map((planType) => {
          const Icon = planType.icon
          const isSelected = data.planType === planType.id

          return (
            <Card
              key={planType.id}
              className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                isSelected
                  ? "bg-white/15 border-purple-500/50 ring-2 ring-purple-500/30"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
              onClick={() => handleSelectPlanType(planType.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${planType.color} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                    {planType.badge}
                  </Badge>
                </div>
                <CardTitle className="text-white text-xl">{planType.title}</CardTitle>
                <CardDescription className="text-gray-300">{planType.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {planType.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-300">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {data.planType && (
        <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">
                  {planTypes.find((p) => p.id === data.planType)?.title} Selected
                </h3>
                <p className="text-gray-300 text-sm">
                  Great choice! This model works well for most SaaS platforms. Continue to customize your plans.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
