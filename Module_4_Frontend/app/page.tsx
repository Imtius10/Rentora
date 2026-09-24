"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  BedDouble,
  Building2,
  CheckCircle2,
  CreditCard,
  Heart,
  Quote,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { useCategories, useProperties } from "@/hooks/queries";
import { categoryGradient, CategoryIcon } from "@/components/properties/category-icon";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertyCardSkeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StarRating } from "@/components/ui/rating";
import { Reveal } from "@/components/ui/reveal";
import { HeroScene } from "@/components/hero-scene";
import { initials, titleCase } from "@/lib/utils";
import { getCategoryLabel } from "@/lib/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/shadcn/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/shadcn/carousel";

const FEATURES = [
  {
    icon: BadgeCheck,
    title: "Verified listings",
    description: "Every property is posted by registered landlords you can trust.",
    className: "md:col-span-2",
  },
  {
    icon: Wallet,
    title: "Zero commission",
    description: "No hidden fees — renters and landlords deal directly.",
  },
  {
    icon: Heart,
    title: "Tenant reviews",
    description: "Real ratings from real tenants after every rental.",
  },
  {
    icon: CreditCard,
    title: "Stripe payments",
    description: "Secure card checkout with a full payment trail.",
  },
  {
    icon: Users,
    title: "3 user roles",
    description: "Dedicated dashboards for tenants, landlords and admins.",
    className: "md:col-span-2",
  },
  {
    icon: Building2,
    title: "Built for Bangladesh",
    description: "BDT pricing, local areas and familiar property types across Dhaka and beyond.",
  },
];

const STEPS = [
  { step: "01", title: "Create an account", description: "Sign up as a tenant or landlord in seconds." },
  { step: "02", title: "Apply or list", description: "Tenants request rentals; landlords publish properties." },
  { step: "03", title: "Get approved & pay", description: "Landlords approve requests, tenants pay securely via Stripe." },
  { step: "04", title: "Move in", description: "Rate the rental and leave a review for other tenants." },
];

const TESTIMONIALS = [
  {
    name: "Tanvir Ahmed",
    role: "Tenant · Dhanmondi",
    rating: 5,
    text: "Found a beautiful 2-bedroom flat near my university in under a week. Approval was instant and the Stripe payment felt totally secure. Highly recommend!",
  },
  {
    name: "Imtius Rahman",
    role: "Landlord · Gulshan",
    rating: 5,
    text: "Listing my apartment took two minutes. I reviewed three requests in a day, approved the best tenant, and received rent directly. Zero friction.",
  },
  {
    name: "Nusrat Jahan",
    role: "Tenant · Uttara",
    rating: 4,
    text: "Great selection of studios and houses with honest photos. The dashboard made it easy to track my rental requests from application to move-in.",
  },
  {
    name: "Sadman Sakib",
    role: "Landlord · Banani",
    rating: 5,
    text: "The admin-quality analytics for landlords is superb. I can see all my properties, renters and payment statuses in one clean dashboard.",
  },
  {
    name: "Fariha Islam",
    role: "Tenant · Mirpur",
    rating: 4,
    text: "Process was smooth end to end — search, apply, get approved, pay, move in. The review system helped me pick a landlord with a great track record.",
  },
];

const FAQS = [
  {
    question: "Is RentNest free to use?",
    answer:
      "Yes. Creating an account, browsing listings, submitting rental requests and messaging landlords are completely free. We never charge renters or landlords a commission.",
  },
  {
    question: "How do payments work?",
    answer:
      "Once a landlord approves your rental request, you're given a secure Stripe Checkout link. Payments are processed by Stripe and every transaction is recorded in your payment history under your dashboard.",
  },
  {
    question: "Can I list more than one property?",
    answer:
      "Absolutely. Landlords can publish as many listings as they like, edit them anytime, and manage rental requests for each property from a single dashboard.",
  },
  {
    question: "How are tenants verified?",
    answer:
      "Every rental request is reviewed by the landlord, who approves or rejects each application. Tenants also build a history through reviews, so landlords can check credibility before approving.",
  },
  {
    question: "Which areas does RentNest cover?",
    answer:
      "We currently focus on Dhaka and surrounding areas of Bangladesh, with more regions on the way. Use the price and category filters to narrow down exactly what you need.",
  },
  {
    question: "What happens after I move in?",
    answer:
      "You can leave a rating and review for the property — helping future tenants make confident decisions. Your profile keeps a record of every rental you've completed.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [heroQuery, setHeroQuery] = useState("");
  const { data: categories } = useCategories();
  const { data, isLoading } = useProperties({ params: { limit: 6 } });

  const recentProperties = data?.data ?? [];

  // Repeat the list so each marquee half is far wider than any viewport —
  // otherwise the loop shows blank gaps on wide screens.
  const marqueeLoop =
    categories && categories.length > 0
      ? Array.from({ length: 4 }, () => categories).flat()
      : [];

  const searchHero = () => {
    const params = new URLSearchParams();
    if (heroQuery.trim()) params.set("search", heroQuery.trim());
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-900">
        <HeroScene />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.25),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:26px_26px]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <Reveal className="max-w-2xl" y={32}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              <Sparkles className="size-3.5 text-indigo-300" />
              Bangladesh&apos;s rental marketplace
            </span>
            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find your next home,{" "}
              <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
                simply.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
              RentNest connects tenants and landlords with verified listings, transparent
              approvals and secure payments.
            </p>
            <div className="mt-8 flex max-w-xl items-center gap-2 rounded-2xl border border-white/10 bg-white/10 p-2 shadow-2xl shadow-black/20 backdrop-blur">
              <Search className="ml-2 size-5 shrink-0 text-slate-300" />
              <input
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchHero()}
                placeholder="Search by area or property type…"
                className="h-10 w-full min-w-0 bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
              />
              <Button onClick={searchHero} className="shrink-0 rounded-xl">
                Search
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-400" /> Verified landlords
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-400" /> Secure Stripe payments
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="size-4 fill-amber-400 text-amber-400" /> 4.8/5 tenant rating
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Category marquee ─────────────────────────────────── */}
      <section className="border-b border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              Popular categories
            </h2>
            <Link
              href="/properties"
              className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              View all <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
        <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max animate-marquee will-change-transform hover:[animation-play-state:paused] motion-reduce:animate-none">
            <CategoryMarqueeRow categories={marqueeLoop} />
            <CategoryMarqueeRow categories={marqueeLoop} aria-hidden />
          </div>
        </div>
      </section>

      {/* ── Why RentNest ─────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Why RentNest
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Renting, done right
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
            Everything you need to find a home or rent yours — designed around trust and
            transparency.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={Math.min(i, 3) * 0.08} className="h-full">
              <Card
                className={`group relative h-full overflow-hidden p-6 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10 ${feature.className ?? ""}`}
              >
              <div
                className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-indigo-100/60 opacity-0 blur-2xl transition group-hover:opacity-100"
              />
              <div
                className={`relative flex size-12 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md ${categoryGradient(
                  feature.title
                )}`}
              >
                <feature.icon className="size-5.5" />
              </div>
              <h3 className="relative mt-5 text-base font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-slate-500">
                {feature.description}
              </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Latest listings ──────────────────────────────────── */}
      <section className="border-y border-slate-200 bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="flex items-end justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                Fresh on the market
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Latest listings
              </h2>
              <p className="mt-2 text-sm text-slate-500">Fresh properties just added</p>
            </div>
            <Link
              href="/properties"
              className="hidden items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 sm:flex"
            >
              View all <ArrowRight className="size-4" />
            </Link>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)
              : recentProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" onClick={() => router.push("/properties")}>
              View all properties <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────── */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { value: "1,200+", label: "Listed properties" },
            { value: "3", label: "User roles" },
            { value: "4", label: "Step rental flow" },
            { value: "100%", label: "Secure payments" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-3xl font-black text-transparent sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Simple by design
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            How RentNest works
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            A simple rental journey from search to move-in
          </p>
        </Reveal>
        <div className="relative mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent lg:block" />
          {STEPS.map((item, i) => (
            <Reveal key={item.step} delay={i * 0.08} className="h-full">
              <div className="relative h-full rounded-2xl border border-slate-200 bg-white p-6 text-center transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10">
              <span className="relative mx-auto flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-black text-white shadow-lg shadow-indigo-600/25">
                {item.step}
              </span>
              <h3 className="mt-5 font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Testimonials carousel ────────────────────────────── */}
      <section className="border-y border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Loved by tenants & landlords
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              What people say
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
          <Carousel
            opts={{ align: "start", loop: true }}
            className="mx-auto mt-10 max-w-4xl md:px-12"
          >
            <CarouselContent>
              {TESTIMONIALS.map((t) => (
                <CarouselItem key={t.name} className="md:basis-1/2 lg:basis-1/3">
                  <div className="flex h-full min-h-[15rem] flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5 transition hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <QuoteIcon />
                      <StarRating value={t.rating} readonly />
                    </div>
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                      <span
                        className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white ${categoryGradient(
                          t.name
                        )}`}
                      >
                        {initials(t.name)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">{t.name}</p>
                        <p className="truncate text-xs text-slate-500">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Good to know
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Frequently asked questions
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Everything you need to know before you start renting with RentNest.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
        <Accordion type="single" collapsible className="mt-8 w-full">
          {FAQS.map((faq, index) => (
            <AccordionItem key={faq.question} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-semibold text-slate-900 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="leading-relaxed text-slate-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        </Reveal>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 px-6 py-14 text-center sm:px-12">
          <div className="pointer-events-none absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:20px_20px]" />
          <div className="pointer-events-none absolute -left-10 -top-10 size-52 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 size-52 rounded-full bg-fuchsia-500/30 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to find your next home?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-indigo-100 sm:text-base">
              Join RentNest today — browse listings, submit rental requests, and manage everything
              from your dashboard.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={() => router.push("/register")}
                className="bg-white text-indigo-700 shadow-lg shadow-black/20 hover:bg-indigo-50"
              >
                <BedDouble className="size-5" />
                Get started free
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => router.push("/properties")}
                className="text-white hover:bg-white/10 hover:text-white"
              >
                Browse listings <ArrowRight className="size-5" />
              </Button>
            </div>
          </div>
        </div>
        </Reveal>
      </section>
    </div>
  );
}

function CategoryMarqueeRow({
  categories,
  ariaHidden,
}: {
  categories: string[];
  ariaHidden?: boolean;
}) {
  if (categories.length === 0) return null;
  return (
    <div className="flex shrink-0 gap-4 pr-4" aria-hidden={ariaHidden}>
      {categories.map((category, n) => (
        <Link
          key={`${category}-${n}`}
          href={`/properties?category=${encodeURIComponent(category)}`}
          tabIndex={ariaHidden ? -1 : undefined}
          className="group flex shrink-0 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/50 hover:shadow-lg hover:shadow-indigo-500/10"
        >
          <span
            className={`flex size-9 items-center justify-center rounded-xl bg-gradient-to-br text-white ${categoryGradient(
              category
            )}`}
          >
            <CategoryIcon category={category} className="size-4.5" />
          </span>
          <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-700">
            {titleCase(getCategoryLabel(category))}
          </span>
        </Link>
      ))}
    </div>
  );
}

function QuoteIcon() {
  return (
    <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
      <Quote className="size-4.5 fill-indigo-600" />
    </span>
  );
}