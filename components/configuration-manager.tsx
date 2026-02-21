"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Save, Download, Copy, RefreshCw, Settings, Code, CheckCircle, AlertTriangle, Info } from "lucide-react"

interface ConfigurationManagerProps {
  data: any
  setData: (data: any) => void
  currentProject?: any
}

export function ConfigurationManager({ data, setData, currentProject }: ConfigurationManagerProps) {
  const [savedConfigs, setSavedConfigs] = useState<any[]>([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [configName, setConfigName] = useState("")
  const [configDescription, setConfigDescription] = useState("")

  const saveConfiguration = () => {
    const config = {
      id: `config_${Date.now()}`,
      name: configName,
      description: configDescription,
      timestamp: new Date().toISOString(),
      projectId: currentProject?.id,
      projectName: currentProject?.name,
      data: { ...data },
      version: "1.0.0",
    }

    setSavedConfigs([...savedConfigs, config])
    setConfigName("")
    setConfigDescription("")
    setShowSaveDialog(false)
  }

  const loadConfiguration = (config: any) => {
    setData(config.data)
  }

  const exportConfiguration = (config?: any) => {
    const exportData = config || {
      id: `export_${Date.now()}`,
      name: "Current Configuration",
      description: "Exported configuration",
      timestamp: new Date().toISOString(),
      projectId: currentProject?.id,
      projectName: currentProject?.name,
      data: { ...data },
      version: "1.0.0",
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `${(exportData.name || "configuration").toLowerCase().replace(/\s+/g, "-")}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const generateComprehensiveTemplate = () => {
    const template = {
      metadata: {
        name: currentProject?.name || "SaaS Application",
        description: currentProject?.description || "Generated SaaS template",
        version: "1.0.0",
        generatedAt: new Date().toISOString(),
        generator: "PlanCraft v2.0",
      },
      configuration: {
        projectType: currentProject?.type || "subscription",
        plans: data.plans || [],
        creditSystem: data.creditSystem || null,
        routeProtection: data.protectedRoutes || [],
        features: data.features || [],
        styling: data.styling || {},
        integrations: data.integrations || {},
      },
      architecture: {
        authentication: {
          provider: "NextAuth.js",
          providers: ["google", "github", "credentials"],
          features: ["session-management", "jwt-tokens", "password-reset"],
        },
        database: {
          type: "PostgreSQL",
          orm: "Prisma",
          migrations: true,
          schema: generateDatabaseSchema(),
        },
        payments: {
          provider: "Stripe",
          features: ["subscriptions", "one-time-payments", "webhooks", "billing-portal"],
          webhookEvents: [
            "customer.subscription.created",
            "customer.subscription.updated",
            "customer.subscription.deleted",
            "invoice.payment_succeeded",
          ],
        },
        middleware: {
          routeProtection: true,
          rateLimiting: true,
          cors: true,
          logging: true,
        },
      },
      fileStructure: generateFileStructure(),
      environmentVariables: generateEnvironmentVariables(),
      packageDependencies: generatePackageDependencies(),
      deploymentConfig: generateDeploymentConfig(),
      documentation: generateDocumentation(),
    }

    return template
  }

  const generateDatabaseSchema = () => {
    return `
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  stripe_subscription_id VARCHAR(255) UNIQUE,
  plan_name VARCHAR(100),
  status VARCHAR(50),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

${
  data.creditSystem?.enabled
    ? `
-- Credits table
CREATE TABLE credits (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  credit_type VARCHAR(100),
  amount INTEGER DEFAULT 0,
  used_amount INTEGER DEFAULT 0,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Credit transactions table
CREATE TABLE credit_transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  credit_type VARCHAR(100),
  amount INTEGER,
  transaction_type VARCHAR(50), -- 'purchase', 'usage', 'refund'
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
`
    : ""
}

-- Audit log table
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(100),
  resource_type VARCHAR(100),
  resource_id VARCHAR(255),
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
`
  }

  const generateFileStructure = () => {
    const structure = {
      "app/": {
        "layout.tsx": "Root layout with providers",
        "page.tsx": "Landing page",
        "globals.css": "Global styles",
        "(auth)/": {
          "signin/page.tsx": "Sign in page",
          "signup/page.tsx": "Sign up page",
          "callback/page.tsx": "OAuth callback",
        },
        "(dashboard)/": {
          "dashboard/page.tsx": "User dashboard",
          "billing/page.tsx": "Billing management",
          "settings/page.tsx": "User settings",
        },
        "admin/": {
          "dashboard/page.tsx": "Admin dashboard",
          "users/page.tsx": "User management",
          "subscriptions/page.tsx": "Subscription management",
          "analytics/page.tsx": "Analytics dashboard",
        },
        "api/": {
          "auth/[...nextauth]/route.ts": "NextAuth configuration",
          "webhooks/stripe/route.ts": "Stripe webhook handler",
          "subscriptions/route.ts": "Subscription API",
          "users/route.ts": "User management API",
          ...(data.creditSystem?.enabled && {
            "credits/route.ts": "Credits API",
            "credits/purchase/route.ts": "Credit purchase API",
          }),
        },
      },
      "components/": {
        "ui/": "shadcn/ui components",
        "auth/": {
          "signin-form.tsx": "Sign in form component",
          "signup-form.tsx": "Sign up form component",
          "auth-provider.tsx": "Authentication provider",
        },
        "subscription/": {
          "pricing-plans.tsx": "Pricing plans component",
          "billing-portal.tsx": "Billing portal component",
          "subscription-status.tsx": "Subscription status component",
        },
        ...(data.creditSystem?.enabled && {
          "credits/": {
            "credit-balance.tsx": "Credit balance component",
            "credit-purchase.tsx": "Credit purchase component",
            "credit-history.tsx": "Credit usage history",
          },
        }),
        "admin/": {
          "admin-dashboard.tsx": "Admin dashboard component",
          "user-management.tsx": "User management component",
          "analytics-charts.tsx": "Analytics charts",
        },
      },
      "lib/": {
        "auth.ts": "NextAuth configuration",
        "db.ts": "Database connection",
        "stripe.ts": "Stripe configuration",
        "utils.ts": "Utility functions",
        "validations.ts": "Zod schemas",
      },
      "middleware.ts": "Route protection middleware",
      "prisma/": {
        "schema.prisma": "Database schema",
        "migrations/": "Database migrations",
      },
      ".env.example": "Environment variables template",
      "package.json": "Dependencies and scripts",
      "tailwind.config.js": "Tailwind configuration",
      "next.config.js": "Next.js configuration",
    }

    return structure
  }

  const generateEnvironmentVariables = () => {
    return {
      required: {
        DATABASE_URL: "postgresql://username:password@localhost:5432/database",
        NEXTAUTH_URL: "http://localhost:3000",
        NEXTAUTH_SECRET: "your-secret-key-here",
        STRIPE_PUBLISHABLE_KEY: "pk_test_...",
        STRIPE_SECRET_KEY: "sk_test_...",
        STRIPE_WEBHOOK_SECRET: "whsec_...",
      },
      optional: {
        GOOGLE_CLIENT_ID: "your-google-client-id",
        GOOGLE_CLIENT_SECRET: "your-google-client-secret",
        GITHUB_CLIENT_ID: "your-github-client-id",
        GITHUB_CLIENT_SECRET: "your-github-client-secret",
        SMTP_HOST: "smtp.gmail.com",
        SMTP_PORT: "587",
        SMTP_USER: "your-email@gmail.com",
        SMTP_PASS: "your-app-password",
        SENTRY_DSN: "your-sentry-dsn",
        ANALYTICS_ID: "your-analytics-id",
      },
    }
  }

  const generatePackageDependencies = () => {
    const baseDependencies = {
      next: "^14.0.0",
      react: "^18.0.0",
      "react-dom": "^18.0.0",
      typescript: "^5.0.0",
      "@next/font": "^14.0.0",
      tailwindcss: "^3.3.0",
      autoprefixer: "^10.4.0",
      postcss: "^8.4.0",
      "@tailwindcss/forms": "^0.5.0",
      "@tailwindcss/typography": "^0.5.0",
      clsx: "^2.0.0",
      "class-variance-authority": "^0.7.0",
      "lucide-react": "^0.294.0",
      "@radix-ui/react-dialog": "^1.0.0",
      "@radix-ui/react-dropdown-menu": "^2.0.0",
      "@radix-ui/react-tabs": "^1.0.0",
      "@radix-ui/react-switch": "^1.0.0",
      "next-auth": "^4.24.0",
      "@next-auth/prisma-adapter": "^1.0.0",
      prisma: "^5.0.0",
      "@prisma/client": "^5.0.0",
      stripe: "^14.0.0",
      zod: "^3.22.0",
      "react-hook-form": "^7.47.0",
      "@hookform/resolvers": "^3.3.0",
    }

    const creditSystemDependencies = data.creditSystem?.enabled
      ? {
          "@stripe/stripe-js": "^2.1.0",
          "date-fns": "^2.30.0",
        }
      : {}

    return {
      dependencies: { ...baseDependencies, ...creditSystemDependencies },
      devDependencies: {
        "@types/node": "^20.0.0",
        "@types/react": "^18.0.0",
        "@types/react-dom": "^18.0.0",
        eslint: "^8.0.0",
        "eslint-config-next": "^14.0.0",
        prettier: "^3.0.0",
        "prettier-plugin-tailwindcss": "^0.5.0",
        "@typescript-eslint/eslint-plugin": "^6.0.0",
        "@typescript-eslint/parser": "^6.0.0",
        husky: "^8.0.0",
        "lint-staged": "^15.0.0",
      },
    }
  }

  const generateDeploymentConfig = () => {
    return {
      vercel: {
        "vercel.json": {
          framework: "nextjs",
          buildCommand: "npm run build",
          devCommand: "npm run dev",
          installCommand: "npm install",
          env: {
            DATABASE_URL: "@database_url",
            NEXTAUTH_SECRET: "@nextauth_secret",
            STRIPE_SECRET_KEY: "@stripe_secret_key",
          },
        },
      },
      docker: {
        Dockerfile: `FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]`,
        "docker-compose.yml": `version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/saas
    depends_on:
      - db
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=saas
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:`,
      },
    }
  }

  const generateDocumentation = () => {
    return {
      "README.md": `# ${currentProject?.name || "SaaS Application"}

${currentProject?.description || "A modern SaaS application built with Next.js"}

## Features

${data.plans?.length > 0 ? "- 💳 Subscription management with multiple plans" : ""}
${data.creditSystem?.enabled ? "- 🪙 Credit-based system with flexible packages" : ""}
- 🔐 Authentication with NextAuth.js
- 🛡️ Route protection and middleware
- 📊 Admin dashboard with analytics
- 💰 Stripe integration for payments
- 📧 Email notifications
- 🎨 Modern UI with Tailwind CSS

## Quick Start

1. Clone the repository
2. Install dependencies: \`npm install\`
3. Set up environment variables (see .env.example)
4. Run database migrations: \`npx prisma migrate dev\`
5. Start development server: \`npm run dev\`

## Environment Setup

Copy \`.env.example\` to \`.env.local\` and fill in your values:

\`\`\`env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
\`\`\`

## Database Setup

\`\`\`bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed
\`\`\`

## Stripe Setup

1. Create a Stripe account
2. Set up your products and prices
3. Configure webhooks pointing to \`/api/webhooks/stripe\`
4. Add webhook events: ${generateWebhookEvents().join(", ")}

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker

\`\`\`bash
# Build image
docker build -t saas-app .

# Run container
docker run -p 3000:3000 saas-app
\`\`\`

## Project Structure

\`\`\`
${generateProjectStructureText()}
\`\`\`

## API Routes

${generateAPIDocumentation()}

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: \`npm test\`
5. Submit a pull request

## License

MIT License - see LICENSE file for details
`,
      "DEPLOYMENT.md": generateDeploymentGuide(),
      "API.md": generateAPIDocumentation(),
      "CONTRIBUTING.md": generateContributingGuide(),
    }
  }

  const generateWebhookEvents = () => {
    const events = [
      "customer.subscription.created",
      "customer.subscription.updated",
      "customer.subscription.deleted",
      "invoice.payment_succeeded",
      "invoice.payment_failed",
    ]

    if (data.creditSystem?.enabled) {
      events.push("checkout.session.completed")
    }

    return events
  }

  const generateProjectStructureText = () => {
    return `app/
├── (auth)/
│   ├── signin/
│   └── signup/
├── (dashboard)/
│   ├── dashboard/
│   ├── billing/
│   └── settings/
├── admin/
├── api/
└── globals.css
components/
├── ui/
├── auth/
├── subscription/
${data.creditSystem?.enabled ? "├── credits/" : ""}
└── admin/
lib/
├── auth.ts
├── db.ts
├── stripe.ts
└── utils.ts
prisma/
├── schema.prisma
└── migrations/`
  }

  const generateAPIDocumentation = () => {
    return `## Authentication
- \`POST /api/auth/signin\` - Sign in user
- \`POST /api/auth/signup\` - Register new user
- \`GET /api/auth/session\` - Get current session

## Subscriptions
- \`GET /api/subscriptions\` - List user subscriptions
- \`POST /api/subscriptions\` - Create subscription
- \`PUT /api/subscriptions/[id]\` - Update subscription
- \`DELETE /api/subscriptions/[id]\` - Cancel subscription

${
  data.creditSystem?.enabled
    ? `## Credits
- \`GET /api/credits\` - Get credit balance
- \`POST /api/credits/purchase\` - Purchase credits
- \`GET /api/credits/history\` - Credit usage history`
    : ""
}

## Admin
- \`GET /api/admin/users\` - List all users
- \`GET /api/admin/subscriptions\` - List all subscriptions
- \`GET /api/admin/analytics\` - Get analytics data

## Webhooks
- \`POST /api/webhooks/stripe\` - Stripe webhook handler`
  }

  const generateDeploymentGuide = () => {
    return `# Deployment Guide

## Vercel Deployment

1. **Connect Repository**
   - Go to Vercel dashboard
   - Click "New Project"
   - Import your GitHub repository

2. **Environment Variables**
   Set these in Vercel dashboard:
   - \`DATABASE_URL\`
   - \`NEXTAUTH_SECRET\`
   - \`STRIPE_SECRET_KEY\`
   - \`STRIPE_WEBHOOK_SECRET\`

3. **Database Setup**
   - Set up PostgreSQL database (Neon, Supabase, or PlanetScale)
   - Run migrations after first deployment

## Docker Deployment

1. **Build Image**
   \`\`\`bash
   docker build -t saas-app .
   \`\`\`

2. **Run with Docker Compose**
   \`\`\`bash
   docker-compose up -d
   \`\`\`

## Manual Server Deployment

1. **Server Requirements**
   - Node.js 18+
   - PostgreSQL 13+
   - SSL certificate

2. **Setup Steps**
   \`\`\`bash
   # Clone repository
   git clone <your-repo>
   cd saas-app
   
   # Install dependencies
   npm ci --production
   
   # Build application
   npm run build
   
   # Start application
   npm start
   \`\`\`

## Post-Deployment Checklist

- [ ] Database migrations completed
- [ ] Stripe webhooks configured
- [ ] Environment variables set
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Email service configured
- [ ] Monitoring set up`
  }

  const generateContributingGuide = () => {
    return `# Contributing Guide

## Development Setup

1. **Fork and Clone**
   \`\`\`bash
   git clone <your-fork>
   cd saas-app
   \`\`\`

2. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**
   \`\`\`bash
   cp .env.example .env.local
   # Fill in your values
   \`\`\`

4. **Database Setup**
   \`\`\`bash
   npx prisma migrate dev
   npx prisma db seed
   \`\`\`

## Code Standards

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write tests for new features
- Update documentation

## Pull Request Process

1. Create feature branch from main
2. Make your changes
3. Run tests: \`npm test\`
4. Run linting: \`npm run lint\`
5. Update documentation if needed
6. Submit pull request

## Commit Messages

Use conventional commits:
- \`feat: add new feature\`
- \`fix: resolve bug\`
- \`docs: update documentation\`
- \`style: formatting changes\`
- \`refactor: code refactoring\`
- \`test: add tests\`

## Testing

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
\`\`\`

## Questions?

Open an issue or start a discussion!`
  }

  const validateConfiguration = () => {
    const issues = []
    const warnings = []
    const info = []

    // Check required fields
    if (!data.plans || data.plans.length === 0) {
      issues.push("No subscription plans configured")
    }

    if (data.creditSystem?.enabled && (!data.creditSystem.packages || data.creditSystem.packages.length === 0)) {
      warnings.push("Credit system enabled but no packages configured")
    }

    if (!data.protectedRoutes || data.protectedRoutes.length === 0) {
      warnings.push("No route protection configured")
    }

    // Check plan configuration
    data.plans?.forEach((plan: any, index: number) => {
      if (!plan.name) issues.push(`Plan ${index + 1} missing name`)
      if (!plan.price && plan.price !== 0) issues.push(`Plan ${index + 1} missing price`)
      if (!plan.features || plan.features.length === 0) warnings.push(`Plan ${index + 1} has no features`)
    })

    // Check integrations
    if (!data.integrations?.stripe) {
      issues.push("Stripe integration not configured")
    }

    if (!data.integrations?.nextauth) {
      warnings.push("NextAuth integration not configured")
    }

    // Provide recommendations
    if (data.plans?.length > 0) {
      info.push(`${data.plans.length} subscription plans configured`)
    }

    if (data.creditSystem?.enabled) {
      info.push("Credit system enabled")
    }

    if (data.protectedRoutes?.length > 0) {
      info.push(`${data.protectedRoutes.length} protected routes configured`)
    }

    return { issues, warnings, info }
  }

  const validation = validateConfiguration()

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Configuration Manager</h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Save, load, and export your SaaS configurations with comprehensive template generation
        </p>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white/10">
          <TabsTrigger value="current" className="data-[state=active]:bg-white/20 text-white">
            Current Config
          </TabsTrigger>
          <TabsTrigger value="saved" className="data-[state=active]:bg-white/20 text-white">
            Saved Configs
          </TabsTrigger>
          <TabsTrigger value="template" className="data-[state=active]:bg-white/20 text-white">
            Template Generator
          </TabsTrigger>
          <TabsTrigger value="validation" className="data-[state=active]:bg-white/20 text-white">
            Validation
          </TabsTrigger>
          <TabsTrigger value="debug" className="data-[state=active]:bg-white/20 text-white">
            Debug
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Current Configuration</CardTitle>
                  <CardDescription className="text-gray-300">Manage your current project configuration</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                        <Save className="w-4 h-4 mr-2" />
                        Save Config
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-white/20 text-white">
                      <DialogHeader>
                        <DialogTitle>Save Configuration</DialogTitle>
                        <DialogDescription className="text-gray-300">
                          Save your current configuration for later use
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-white">Configuration Name</Label>
                          <Input
                            value={configName}
                            onChange={(e) => setConfigName(e.target.value)}
                            className="bg-white/10 border-white/20 text-white"
                            placeholder="My SaaS Configuration"
                          />
                        </div>
                        <div>
                          <Label className="text-white">Description</Label>
                          <Input
                            value={configDescription}
                            onChange={(e) => setConfigDescription(e.target.value)}
                            className="bg-white/10 border-white/20 text-white"
                            placeholder="Brief description of this configuration"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => setShowSaveDialog(false)}
                            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                          >
                            Cancel
                          </Button>
                          <Button onClick={saveConfiguration} className="bg-purple-600 hover:bg-purple-700 text-white">
                            Save Configuration
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    onClick={() => exportConfiguration()}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white/10 border-white/20">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-white">{data.plans?.length || 0}</div>
                    <div className="text-gray-400 text-sm">Subscription Plans</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 border-white/20">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-white">{data.creditSystem?.packages?.length || 0}</div>
                    <div className="text-gray-400 text-sm">Credit Packages</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 border-white/20">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-white">{data.protectedRoutes?.length || 0}</div>
                    <div className="text-gray-400 text-sm">Protected Routes</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 border-white/20">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-white">{Object.keys(data.integrations || {}).length}</div>
                    <div className="text-gray-400 text-sm">Integrations</div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <h3 className="text-white font-semibold mb-3">Configuration Summary</h3>
                <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-gray-300 max-h-64 overflow-y-auto">
                  <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Saved Configurations</CardTitle>
              <CardDescription className="text-gray-300">Load previously saved configurations</CardDescription>
            </CardHeader>
            <CardContent>
              {savedConfigs.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No Saved Configurations</h3>
                  <p className="text-gray-400 mb-6">Save your current configuration to see it here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedConfigs.map((config) => (
                    <Card key={config.id} className="bg-white/10 border-white/20">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-medium">{config.name}</h3>
                            <p className="text-gray-400 text-sm">{config.description}</p>
                            <p className="text-gray-500 text-xs">
                              Saved {new Date(config.timestamp).toLocaleDateString()} • v{config.version}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => loadConfiguration(config)}
                              className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                              Load
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => exportConfiguration(config)}
                              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="template" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Comprehensive Template Generator</CardTitle>
                  <CardDescription className="text-gray-300">
                    Generate a complete SaaS template with all configurations
                  </CardDescription>
                </div>
                <Button
                  onClick={() => {
                    const template = generateComprehensiveTemplate()
                    const dataStr = JSON.stringify(template, null, 2)
                    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
                    const exportFileDefaultName = `${(currentProject?.name || "saas-template").toLowerCase().replace(/\s+/g, "-")}-complete.json`

                    const linkElement = document.createElement("a")
                    linkElement.setAttribute("href", dataUri)
                    linkElement.setAttribute("download", exportFileDefaultName)
                    linkElement.click()
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Generate Complete Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Template Includes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white">Complete file structure</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white">Database schema & migrations</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white">Environment variables</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white">Package dependencies</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white">Deployment configuration</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white">Complete documentation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white">API documentation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white">Docker configuration</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Template Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Components:</span>
                      <span className="text-white">25+ React components</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">API Routes:</span>
                      <span className="text-white">15+ API endpoints</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Database Tables:</span>
                      <span className="text-white">{data.creditSystem?.enabled ? "6" : "4"} tables</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Middleware:</span>
                      <span className="text-white">Route protection</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Documentation:</span>
                      <span className="text-white">Complete guides</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <h3 className="text-white font-semibold mb-3">Template Preview</h3>
                <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-gray-300 max-h-64 overflow-y-auto">
                  <pre>{JSON.stringify(generateComprehensiveTemplate(), null, 2).slice(0, 1000)}...</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Configuration Validation</CardTitle>
              <CardDescription className="text-gray-300">
                Check your configuration for issues and get recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {validation.issues.length > 0 && (
                <Card className="bg-red-500/10 border-red-500/30">
                  <CardHeader>
                    <CardTitle className="text-red-300 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Issues ({validation.issues.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {validation.issues.map((issue, index) => (
                        <li key={index} className="text-red-300 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {validation.warnings.length > 0 && (
                <Card className="bg-yellow-500/10 border-yellow-500/30">
                  <CardHeader>
                    <CardTitle className="text-yellow-300 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Warnings ({validation.warnings.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {validation.warnings.map((warning, index) => (
                        <li key={index} className="text-yellow-300 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {validation.info.length > 0 && (
                <Card className="bg-blue-500/10 border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-blue-300 flex items-center">
                      <Info className="w-5 h-5 mr-2" />
                      Information ({validation.info.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {validation.info.map((info, index) => (
                        <li key={index} className="text-blue-300 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          {info}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {validation.issues.length === 0 && validation.warnings.length === 0 && (
                <Card className="bg-green-500/10 border-green-500/30">
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-green-300 mb-2">Configuration Valid!</h3>
                    <p className="text-green-400">Your configuration looks good and ready for template generation.</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debug" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Debug Information</CardTitle>
              <CardDescription className="text-gray-300">
                Debug your configuration and troubleshoot issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Configuration Debug</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={() => console.log("Current Data:", data)}
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      <Code className="w-4 h-4 mr-2" />
                      Log to Console
                    </Button>
                    <Button
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(data, null, 2))}
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy JSON
                    </Button>
                    <Button
                      onClick={() => {
                        const validation = validateConfiguration()
                        console.log("Validation Results:", validation)
                      }}
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Validate Config
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">System Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Generator Version:</span>
                      <span className="text-white">PlanCraft v2.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Modified:</span>
                      <span className="text-white">{new Date().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Project Type:</span>
                      <span className="text-white">{currentProject?.type || "Unknown"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Config Size:</span>
                      <span className="text-white">{JSON.stringify(data).length} bytes</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Raw Configuration Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-gray-300 max-h-96 overflow-y-auto">
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
