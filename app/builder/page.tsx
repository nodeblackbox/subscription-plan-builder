"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle, Settings, Eye, Code, Save } from "lucide-react"
import { PlanTypeSelector } from "@/components/plan-type-selector"
import { PlanCustomizer } from "@/components/plan-customizer"
import { CreditSystemBuilder } from "@/components/credit-system-builder"
import { FlowDesigner } from "@/components/flow-designer"
import { PreviewGenerator } from "@/components/preview-generator"
import { ProjectManager } from "@/components/project-manager"
import { EnhancedRouteProtection } from "@/components/enhanced-route-protection"
import { ConfigurationManager } from "@/components/configuration-manager"

const steps = [
  { id: 1, title: "Project Setup", description: "Choose your SaaS project", icon: Settings },
  { id: 2, title: "Plan Type", description: "Select subscription model", icon: CheckCircle },
  { id: 3, title: "Plan Design", description: "Customize your plans", icon: Settings },
  { id: 4, title: "Credit System", description: "Configure credit packages", icon: CheckCircle },
  { id: 5, title: "Route Protection", description: "Set up access control", icon: Settings },
  { id: 6, title: "User Flow", description: "Design user experience", icon: CheckCircle },
  { id: 7, title: "Configuration", description: "Manage settings", icon: Settings },
  { id: 8, title: "Preview & Export", description: "Generate template", icon: Eye },
]

export default function BuilderPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [currentProject, setCurrentProject] = useState<any>(null)
  const [data, setData] = useState({
    planType: "subscription",
    plans: [],
    creditSystem: { enabled: false, packages: [] },
    protectedRoutes: [],
    userFlow: {},
    features: [],
    styling: { theme: "purple" },
    integrations: { stripe: true, nextauth: true },
  })

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = (step: number) => {
    setCurrentStep(step)
  }

  const progress = (currentStep / steps.length) * 100

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProjectManager
            onSelectProject={(project) => {
              setCurrentProject(project)
              setData({ ...data, ...project.config })
            }}
            currentProject={currentProject}
          />
        )
      case 2:
        return <PlanTypeSelector data={data} setData={setData} />
      case 3:
        return <PlanCustomizer data={data} setData={setData} />
      case 4:
        return <CreditSystemBuilder data={data} setData={setData} />
      case 5:
        return (
          <EnhancedRouteProtection data={data} setData={setData} projectType={currentProject?.type || data.planType} />
        )
      case 6:
        return <FlowDesigner data={data} setData={setData} />
      case 7:
        return <ConfigurationManager data={data} setData={setData} currentProject={currentProject} />
      case 8:
        return <PreviewGenerator data={data} setData={setData} />
      default:
        return <PlanTypeSelector data={data} setData={setData} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">SaaS Platform Builder</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Build comprehensive SaaS platforms with multi-tenant architecture, advanced route protection, and complete
            template generation
          </p>
          {currentProject && (
            <div className="mt-4">
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-lg px-4 py-2">
                Editing: {currentProject.name}
              </Badge>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <Card className="bg-white/5 border-white/10 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
              </h2>
              <div className="text-white">{Math.round(progress)}% Complete</div>
            </div>
            <Progress value={progress} className="mb-4" />
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {steps.map((step) => {
                const Icon = step.icon
                const isCompleted = step.id < currentStep
                const isCurrent = step.id === currentStep

                return (
                  <button
                    key={step.id}
                    onClick={() => goToStep(step.id)}
                    className={`p-3 rounded-lg text-center transition-all ${
                      isCompleted
                        ? "bg-green-500/20 text-green-300 border border-green-500/30"
                        : isCurrent
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-xs font-medium">{step.title}</div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <div className="mb-8">{renderStepContent()}</div>

        {/* Navigation */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <Button
                onClick={prevStep}
                disabled={currentStep === 1}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{data.plans?.length || 0}</div>
                  <div className="text-gray-400 text-sm">Plans</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{data.creditSystem?.packages?.length || 0}</div>
                  <div className="text-gray-400 text-sm">Credit Packages</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{data.protectedRoutes?.length || 0}</div>
                  <div className="text-gray-400 text-sm">Protected Routes</div>
                </div>
              </div>

              <Button
                onClick={nextStep}
                disabled={currentStep === steps.length}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white disabled:opacity-50"
              >
                {currentStep === steps.length ? (
                  <>
                    <Code className="w-4 h-4 mr-2" />
                    Generate Template
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="fixed bottom-6 right-6 flex flex-col space-y-2">
          <Button
            onClick={() => goToStep(7)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 p-0"
            title="Configuration Manager"
          >
            <Settings className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => goToStep(8)}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full w-12 h-12 p-0"
            title="Preview & Export"
          >
            <Eye className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => {
              // Auto-save current configuration
              const config = {
                timestamp: new Date().toISOString(),
                data: { ...data },
                project: currentProject,
              }
              localStorage.setItem("saas-builder-autosave", JSON.stringify(config))
            }}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full w-12 h-12 p-0"
            title="Auto-save"
          >
            <Save className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
