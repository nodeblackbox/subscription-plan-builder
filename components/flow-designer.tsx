"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Plus, Settings, Users, CreditCard, Zap, Target } from "lucide-react"

interface FlowDesignerProps {
  data: any
  setData: (data: any) => void
}

const flowSteps = [
  {
    id: "welcome",
    title: "Welcome Screen",
    description: "Introduce your service",
    icon: Users,
    required: true,
  },
  {
    id: "needs_assessment",
    title: "Needs Assessment",
    description: "Understand user requirements",
    icon: Target,
    required: false,
  },
  {
    id: "plan_recommendation",
    title: "Plan Recommendation",
    description: "Suggest the best plan",
    icon: Zap,
    required: false,
  },
  {
    id: "customization",
    title: "Plan Customization",
    description: "Let users modify their plan",
    icon: Settings,
    required: false,
  },
  {
    id: "checkout",
    title: "Checkout",
    description: "Complete the purchase",
    icon: CreditCard,
    required: true,
  },
]

const questionTypes = [
  { id: "multiple_choice", name: "Multiple Choice" },
  { id: "slider", name: "Slider/Range" },
  { id: "text_input", name: "Text Input" },
  { id: "yes_no", name: "Yes/No" },
]

export function FlowDesigner({ data, setData }: FlowDesignerProps) {
  const [userFlow, setUserFlow] = useState(
    data.userFlow || {
      enabled: true,
      steps: ["welcome", "checkout"],
      questions: [],
      recommendations: true,
      customization: false,
    },
  )

  const updateUserFlow = (updates: any) => {
    const updated = { ...userFlow, ...updates }
    setUserFlow(updated)
    setData({ ...data, userFlow: updated })
  }

  const toggleStep = (stepId: string) => {
    const step = flowSteps.find((s) => s.id === stepId)
    if (step?.required) return

    const currentSteps = userFlow.steps || []
    const updatedSteps = currentSteps.includes(stepId)
      ? currentSteps.filter((s: string) => s !== stepId)
      : [...currentSteps, stepId]

    updateUserFlow({ steps: updatedSteps })
  }

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      type: "multiple_choice",
      question: "What best describes your use case?",
      options: ["Option 1", "Option 2", "Option 3"],
      required: true,
    }
    updateUserFlow({
      questions: [...(userFlow.questions || []), newQuestion],
    })
  }

  const updateQuestion = (questionId: number, updates: any) => {
    const updatedQuestions = (userFlow.questions || []).map((q: any) =>
      q.id === questionId ? { ...q, ...updates } : q,
    )
    updateUserFlow({ questions: updatedQuestions })
  }

  const removeQuestion = (questionId: number) => {
    const updatedQuestions = (userFlow.questions || []).filter((q: any) => q.id !== questionId)
    updateUserFlow({ questions: updatedQuestions })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Design User Flow</h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Create a guided experience that helps users find the perfect plan for their needs
        </p>
      </div>

      {/* Flow Steps */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Flow Steps</CardTitle>
          <CardDescription className="text-gray-300">
            Choose which steps to include in your user journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {flowSteps.map((step, index) => {
              const Icon = step.icon
              const isEnabled = userFlow.steps?.includes(step.id)
              const isRequired = step.required

              return (
                <div
                  key={step.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold flex items-center gap-2">
                        {step.title}
                        {isRequired && (
                          <Badge variant="secondary" className="bg-red-500/20 text-red-300 text-xs">
                            Required
                          </Badge>
                        )}
                      </h3>
                      <p className="text-gray-400 text-sm">{step.description}</p>
                    </div>
                  </div>
                  <Switch checked={isEnabled} onCheckedChange={() => toggleStep(step.id)} disabled={isRequired} />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Needs Assessment Questions */}
      {userFlow.steps?.includes("needs_assessment") && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Assessment Questions</CardTitle>
                <CardDescription className="text-gray-300">
                  Create questions to understand user needs and recommend the right plan
                </CardDescription>
              </div>
              <Button
                onClick={addQuestion}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {(userFlow.questions || []).map((question: any, index: number) => (
              <Card key={question.id} className="bg-white/10 border-white/20">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">Question {index + 1}</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeQuestion(question.id)}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      Remove
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-white">Question Text</Label>
                    <Textarea
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Question Type</Label>
                      <Select value={question.type} onValueChange={(type) => updateQuestion(question.id, { type })}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {questionTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-white">Required</Label>
                      <Switch
                        checked={question.required}
                        onCheckedChange={(required) => updateQuestion(question.id, { required })}
                      />
                    </div>
                  </div>

                  {(question.type === "multiple_choice" || question.type === "yes_no") && (
                    <div>
                      <Label className="text-white">Options</Label>
                      <div className="space-y-2">
                        {(question.options || []).map((option: string, optionIndex: number) => (
                          <Input
                            key={optionIndex}
                            value={option}
                            onChange={(e) => {
                              const updatedOptions = [...(question.options || [])]
                              updatedOptions[optionIndex] = e.target.value
                              updateQuestion(question.id, { options: updatedOptions })
                            }}
                            className="bg-white/10 border-white/20 text-white"
                            placeholder={`Option ${optionIndex + 1}`}
                          />
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updatedOptions = [
                              ...(question.options || []),
                              `Option ${(question.options?.length || 0) + 1}`,
                            ]
                            updateQuestion(question.id, { options: updatedOptions })
                          }}
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Option
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Flow Settings */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Flow Settings</CardTitle>
          <CardDescription className="text-gray-300">Configure how the user flow behaves</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Smart Recommendations</Label>
              <p className="text-sm text-gray-400">Use AI to suggest the best plan based on user answers</p>
            </div>
            <Switch
              checked={userFlow.recommendations}
              onCheckedChange={(recommendations) => updateUserFlow({ recommendations })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-white">Allow Plan Customization</Label>
              <p className="text-sm text-gray-400">Let users modify recommended plans</p>
            </div>
            <Switch
              checked={userFlow.customization}
              onCheckedChange={(customization) => updateUserFlow({ customization })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Flow Preview */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Flow Preview</CardTitle>
          <CardDescription className="text-gray-300">Visual representation of your user journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-4 overflow-x-auto pb-4">
            {(userFlow.steps || []).map((stepId: string, index: number) => {
              const step = flowSteps.find((s) => s.id === stepId)
              if (!step) return null

              const Icon = step.icon

              return (
                <div key={stepId} className="flex items-center">
                  <div className="flex flex-col items-center space-y-2 min-w-max">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="text-white font-semibold text-sm">{step.title}</div>
                      <div className="text-gray-400 text-xs">{step.description}</div>
                    </div>
                  </div>
                  {index < (userFlow.steps?.length || 0) - 1 && <ArrowRight className="w-6 h-6 text-gray-400 mx-4" />}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
