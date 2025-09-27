"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Phone,
  Zap,
  Globe,
  CheckCircle,
  ArrowRight,
  Play,
  ShoppingCart,
  CreditCard,
  BarChart3,
  Settings,
  Cpu,
  Database,
  Cloud,
  Star,
} from "lucide-react";

const features = [
  {
    name: "Voice & Multichannel Support",
    description:
      "Handle phone calls, WhatsApp, SMS, and Social Media seamlessly with unified conversation management.",
    icon: Phone,
    color: "bg-voca-cyan",
  },
  {
    name: "AI-Driven Conversations",
    description: "Natural, human-like conversations with context awareness.",
    icon: Cpu,
    color: "bg-green-500",
  },
  {
    name: "Intelligent Routing",
    description:
      "Automatically route customers to the right department or agent based on conversation context.",
    icon: Settings,
    color: "bg-voca-cyan",
  },
  {
    name: "Scalable Architecture",
    description:
      "Built for enterprise-grade scalability, security, and reliability.",
    icon: Cloud,
    color: "bg-orange-500",
  },
  {
    name: "Multilingual Support",
    description:
      "Support customers in their preferred language with real-time translation capabilities.",
    icon: Globe,
    color: "bg-red-500",
  },
  {
    name: "Advanced Analytics",
    description:
      "Comprehensive insights into conversation performance, customer satisfaction, and business metrics.",
    icon: BarChart3,
    color: "bg-indigo-500",
  },
];

const useCases = [
  {
    title: "Microfinance Banks",
    description:
    "Streamline loan processing and enhance customer support with intelligent AI agents.",
    icon: CreditCard,
    benefits: [
      "24/7 loan inquiry support",
      "Automated KYC verification",
      "Payment reminder calls",
      "Account balance inquiries",
      "Loan application status updates",
    ],
    color: "bg-voca-light border-voca-light",
    iconColor: "bg-voca-cyan",
  },
  {
    title: "Online Retailers",
    description:
      "Enhance customer experience and boost sales with AI-powered support.",
    icon: ShoppingCart,
    benefits: [
      "Order status inquiries",
      "Return and refund processing",
      "Product recommendations and enquiries",
      "Delivery tracking updates",
      "Upsell and cross-sell opportunities",
    ],
    color: "bg-green-50 border-green-200",
    iconColor: "bg-green-500",
  },
];

const howItWorks = [
  {
    step: "01",
    title: "Integrate Your Systems",
    description:
      "Connect your social media platforms, CRM, payment systems, and existing infrastructure through our APIs.",
    icon: Database,
  },
  {
    step: "02",
    title: "Configure AI Agents",
    description:
      "Set up conversation flows, routing rules, and business logic tailored to your industry needs.",
    icon: Settings,
  },
  {
    step: "03",
    title: "Deploy & Scale",
    description:
      "Launch your AI agents across multiple channels and scale automatically based on demand.",
    icon: Zap,
  },
  {
    step: "04",
    title: "Monitor & Optimize",
    description:
      "Track performance metrics, analyze conversations, and continuously improve your AI agents.",
    icon: BarChart3,
  },
];

const testimonials = [
  {
    content:
      "Voca AI transformed our customer service. We now handle 10x more calls with 95% customer satisfaction.",
    author: "Umaru Musa",
    role: "CEO, MicroFinance Plus",
    company: "Microfinance Bank",
  },
  {
    content:
      "Our online store saw a 40% increase in sales after implementing Voca AI's intelligent customer support.",
    author: "Opeyemi Olawale",
    role: "Operations Director",
    company: "RetailCorp Inc",
  },
  {
    content:
      "The multilingual support helped us expand to new markets seamlessly. Our customers love the experience.",
    author: "Emily Adigwe",
    role: "Customer Success Manager",
    company: "Community Bank",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    description:
      "Perfect for small businesses getting started with AI phone agents.",
    features: [
      "Up to 1,000 calls/month",
      "2 channels (Voice + whatsapp)",
      "Basic AI conversation flows",
      "No Email support",
      "Standard integrations",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "$49",
    period: "/month",
    description: "Ideal for growing businesses with advanced AI capabilities.",
    features: [
      "Up to 10,000 calls/month",
      "All channels (Voice, SMS, WhatsApp, Social Media)",
      "Advanced AI with custom flows",
      "Priority support",
      "Advanced analytics",
      "Custom integrations",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "Unlimited",
    description:
      "For large organizations with unlimited scale and custom requirements.",
    features: [
      "Unlimited calls",
      "All channels and features",
      "Custom AI model training",
      "Dedicated support team",
      "White-label options",
      "On-premise deployment",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              The Future of Contact Centre —
              <span className="text-voca-cyan">Voca AI</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Omni-channel AI agent orchestration platform for conversational
              AI for social commerce
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="#contact"
                className="rounded-md bg-voca-cyan px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-voca-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-voca-cyan"
              >
                Get started
              </Link>
              <button
                onClick={() => {}}
                className="flex items-center space-x-2 text-sm font-semibold leading-6 text-gray-900"
              >
                <Play className="h-5 w-5" />
                <span className="text-voca-cyan cursor-pointer hover:text-voca-cyan">
                  Watch demo
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-voca-cyan">
              Voca Core
            </h2>
            <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Purpose-built for financial services and e-commerce
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Voca AI delivers exceptional customer experience with zero human
              intervention.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center ${feature.color}`}
                    >
                      <feature.icon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-voca-cyan">
              Bespoke Solutions
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Tailored for your business needs
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Voca AI is specifically designed to address the unique challenges
              faced by microfinance banks and online retailers.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {useCases.map((useCase) => (
                <div
                  key={useCase.title}
                  className={`rounded-2xl border p-8 ${useCase.color}`}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div
                      className={`h-12 w-12 rounded-lg flex items-center justify-center ${useCase.iconColor}`}
                    >
                      <useCase.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {useCase.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6">{useCase.description}</p>
                  <ul className="space-y-3">
                    {useCase.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-voca-cyan">
              4 Easy Steps to Get Started
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              From setup to scale in four simple steps
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our proven implementation guide ensures rapid deployment and
              measurable ROI within minutes.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
              {howItWorks.map((step, index) => (
                <div key={step.step} className="relative">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="h-12 w-12 rounded-full bg-voca-cyan flex items-center justify-center text-white font-bold">
                      {step.step}
                    </div>
                    {index < howItWorks.length - 1 && (
                      <div className="hidden lg:block absolute top-6 left-16 w-full h-0.5 bg-gray-200" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-voca-cyan">
              Customer Success
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Still wondering how? Hear directly from the users
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.author}
                  className="bg-white rounded-2xl p-8 shadow-sm border"
                >
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6">
                    &quot;{testimonial.content}&quot;
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    <p className="text-sm text-voca-cyan">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      {/* <section id="pricing" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-voca-cyan">
              Pricing
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Choose the right plan for your business
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Start with our free trial and scale as you grow. No hidden fees,
              no surprises.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative rounded-2xl border p-8 ${
                    plan.popular
                      ? "border-voca-cyan shadow-lg"
                      : "border-gray-200"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-voca-cyan text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {plan.name}
                    </h3>
                    <div className="mt-4 flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-gray-500">{plan.period}</span>
                    </div>
                    <p className="mt-4 text-gray-600">{plan.description}</p>
                  </div>
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <button
                      onClick={() => {
                        if (plan.cta === "Start Free Trial") {
                          router.push("/login");
                        } else if (plan.cta === "Contact Sales") {
                          router.push("/contact");
                        }
                      }}
                      className={`w-full rounded-lg px-4 py-2 font-semibold transition-colors ${
                        plan.popular
                          ? "bg-voca-cyan text-white hover:bg-voca-cyan"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section id="contact" className="py-24 sm:py-32 bg-voca-dark">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to revolutionize your customer experience?
            </h2>
            <p className="mt-6 text-lg leading-8 text-voca-light">
              Leverage Voca AI to deliver exceptional customer engagements and
              drive business growth.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/login"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-voca-dark shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Start free trial
              </Link>
              <Link
                href="/contact"
                className="text-sm font-semibold leading-6 text-white hover:text-voca-light"
              >
                Contact sales <ArrowRight className="inline h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
