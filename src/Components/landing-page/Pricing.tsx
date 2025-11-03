"use client";

import clsx from "clsx";
import { Button } from "./Button";
import { Container } from "./Container";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Api from "@/lib/Api";
import toast from "react-hot-toast";
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { isValidLanguageCode } from '@/Utils/languageUtils'
import { LandingTranslations } from '@/transalations/CommonTransaltion'
import { getPlanCopy, LanguageCode } from '@/config/planCopy'

function SwirlyDoodle(props: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 281 40"
      preserveAspectRatio="none"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M240.172 22.994c-8.007 1.246-15.477 2.23-31.26 4.114-18.506 2.21-26.323 2.977-34.487 3.386-2.971.149-3.727.324-6.566 1.523-15.124 6.388-43.775 9.404-69.425 7.31-26.207-2.14-50.986-7.103-78-15.624C10.912 20.7.988 16.143.734 14.657c-.066-.381.043-.344 1.324.456 10.423 6.506 49.649 16.322 77.8 19.468 23.708 2.65 38.249 2.95 55.821 1.156 9.407-.962 24.451-3.773 25.101-4.692.074-.104.053-.155-.058-.135-1.062.195-13.863-.271-18.848-.687-16.681-1.389-28.722-4.345-38.142-9.364-15.294-8.15-7.298-19.232 14.802-20.514 16.095-.934 32.793 1.517 47.423 6.96 13.524 5.033 17.942 12.326 11.463 18.922l-.859.874.697-.006c2.681-.026 15.304-1.302 29.208-2.953 25.845-3.07 35.659-4.519 54.027-7.978 9.863-1.858 11.021-2.048 13.055-2.145a61.901 61.901 0 0 0 4.506-.417c1.891-.259 2.151-.267 1.543-.047-.402.145-2.33.913-4.285 1.707-4.635 1.882-5.202 2.07-8.736 2.903-3.414.805-19.773 3.797-26.404 4.829Zm40.321-9.93c.1-.066.231-.085.29-.041.059.043-.024.096-.183.119-.177.024-.219-.007-.107-.079ZM172.299 26.22c9.364-6.058 5.161-12.039-12.304-17.51-11.656-3.653-23.145-5.47-35.243-5.576-22.552-.198-33.577 7.462-21.321 14.814 12.012 7.205 32.994 10.557 61.531 9.831 4.563-.116 5.372-.288 7.337-1.559Z"
      />
    </svg>
  );
}

function CheckIcon({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"svg">) {
  return (
    <svg
      aria-hidden="true"
      className={clsx(
        "h-6 w-6 flex-none fill-current stroke-current",
        className
      )}
      {...props}
    >
      <path
        d="M9.307 12.248a.75.75 0 1 0-1.114 1.004l1.114-1.004ZM11 15.25l-.557.502a.75.75 0 0 0 1.15-.043L11 15.25Zm4.844-5.041a.75.75 0 0 0-1.188-.918l1.188.918Zm-7.651 3.043 2.25 2.5 1.114-1.004-2.25-2.5-1.114 1.004Zm3.4 2.457 4.25-5.5-1.187-.918-4.25 5.5 1.188.918Z"
        strokeWidth={0}
      />
      <circle
        cx={12}
        cy={12}
        r={8.25}
        fill="none"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface PlanProps {
  plan: PlanData;
  features: Array<string>;
  featured?: boolean;
  onPlanClick: (plan: PlanData) => void;
  isLoading?: boolean;
  getStartedLabel: string;
  openingCheckoutLabel: string;
}

function Plan({
  plan,
  features,
  featured = false,
  onPlanClick,
  isLoading = false,
  getStartedLabel,
  openingCheckoutLabel,
}: PlanProps) {
  return (
    <section
      className={clsx(
        "flex flex-col rounded-3xl px-6 sm:px-8",
        featured ? "order-first bg-blue-600 py-8 lg:order-0" : "lg:py-8"
      )}
    >
      <h3 className="mt-5 font-display text-lg text-white">{plan.name}</h3>
      {plan.description && (
        <p
          className={clsx(
            "mt-2 text-base",
            featured ? "text-white" : "text-slate-400"
          )}
        >
          {plan.description}
        </p>
      )}
      <p className="order-first font-display text-5xl font-light tracking-tight text-white">
        €{plan.price}
      </p>
     
      <ul
        role="list"
        className={clsx(
          "order-last mt-10 flex flex-col gap-y-3 text-sm",
          featured ? "text-white" : "text-slate-200"
        )}
      >
        {features.map((feature) => (
          <li key={feature} className="flex">
            <CheckIcon className={featured ? "text-white" : "text-slate-400"} />
            <span className="ml-4">{feature}</span>
          </li>
        ))}
      </ul>
      {featured ? (
        <Button
          onClick={() => onPlanClick(plan)}
          variant="solid"
          color="white"
          className="mt-8"
          disabled={isLoading}
          aria-label={`Get started with the ${plan.name} plan for €${plan.price}`}
        >
          {isLoading ? openingCheckoutLabel : getStartedLabel}
        </Button>
      ) : (
        <Button
          onClick={() => onPlanClick(plan)}
          variant="outline"
          color="white"
          className="mt-8"
          disabled={isLoading}
          aria-label={`Get started with the ${plan.name} plan for $${plan.price}`}
        >
          {isLoading ? openingCheckoutLabel : getStartedLabel}
        </Button>
      )}
    </section>
  );
}

interface PlanData {
  _id: string;
  name: string;
  price: number;
  description?: string;
  features: string[];
  isPopular?: boolean;
  maxInvoicesPerMonth?: number;
  maxEmailsPerScan?: number;
  mailboxes?: number;
  supportLevel?: string;
  storageRegion?: string;
}

export function Pricing() {
  const language = useSelector((state: RootState) => state.language.activeLanguage)
  const currentLanguage = isValidLanguageCode(language) ? language : 'en'
  const t = LandingTranslations[currentLanguage]
  const { data: session } = useSession();
  const router = useRouter();
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/plans`
        );
        if (response.data && response.data.length > 0) {
          setPlans(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch plans:", err);
        // Continue with fallback plans instead of showing error
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handlePlanClick = async (plan: PlanData) => {
    if (!session?.accessToken) {
      // Store the selected plan ID in localStorage for after login
      localStorage.setItem("selectedPlanId", plan._id);
      localStorage.setItem("selectedPlanName", plan.name);

      // Redirect to login with plan info in URL for better UX
      router.push(
        `/login?plan=${plan._id}&planName=${encodeURIComponent(plan.name)}`
      );
      return;
    }

    // If user is authenticated, create Stripe checkout session
    setCheckoutLoading(plan._id);
    toast.loading(`Opening checkout for ${plan.name}...`, { id: "checkout" });

    try {
      // Use the proper API class which handles authentication automatically
      const response = await Api.createSubscription(plan._id);

      // Redirect to Stripe checkout
      if (response.data.url) {
        toast.success("Redirecting to checkout...", { id: "checkout" });
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      toast.error("Failed to open checkout. Please try again.", {
        id: "checkout",
      });
      // Fallback to subscriptions page if Stripe fails
      router.push("/subscriptions");
    } finally {
      setCheckoutLoading(null);
    }
  };

  const getDisplay = (plan: PlanData) => {
    const lang = (currentLanguage as LanguageCode) || 'en';
    const copy = getPlanCopy(plan._id, lang);
    return {
      name: copy?.name ?? plan.name,
      description: copy?.tagline ?? plan.description,
      priceText: copy?.price ?? `€${plan.price}`,
      billing: copy?.billing ?? '',
      features: copy?.features && copy.features.length > 0 ? copy.features : formatFeatures(plan),
      cta: copy?.cta ?? t.pricingGetStarted,
      label: copy?.label,
    };
  };

  const formatFeatures = (plan: PlanData): string[] => {
    const i18n = (LandingTranslations as any)[currentLanguage]?.pricingFeatures || (LandingTranslations as any).en.pricingFeatures;
    const features: string[] = [];

    if (plan.maxInvoicesPerMonth) {
      if (plan.maxInvoicesPerMonth === -1) {
        features.push(i18n.unlimitedInvoices);
      } else {
        features.push(i18n.invoicesPerMonth.replace('{count}', String(plan.maxInvoicesPerMonth)));
      }
    }

    if (plan.maxEmailsPerScan) {
      features.push(i18n.emailsPerScan.replace('{count}', String(plan.maxEmailsPerScan)));
    }

    if (plan.mailboxes && plan.mailboxes > 1) {
      features.push(i18n.mailboxesUpTo.replace('{count}', String(plan.mailboxes)));
    } else if (plan.mailboxes === 1) {
      features.push(i18n.mailboxSingle);
    }

    if (plan.supportLevel) {
      features.push(i18n.supportLevel.replace('{level}', String(plan.supportLevel)));
    }

    if (plan.storageRegion) {
      features.push(i18n.storageRegion.replace('{region}', String(plan.storageRegion)));
    }

    if (plan.features && plan.features.length > 0) {
      features.push(...plan.features);
    }

    if (features.length === 0) {
      features.push(
        i18n.defaultAutomaticCollection,
        i18n.defaultForwarding,
        i18n.defaultEmailSupport
      );
    }

    return features;
  };

  if (loading) {
    return (
      <section
        id="pricing"
        aria-label={t.pricingAria}
        className="bg-slate-900 py-20 sm:py-32"
      >
        <Container>
          <div className="md:text-center">
            <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
              <span className="relative whitespace-nowrap">
                <SwirlyDoodle className="absolute top-1/2 left-0 h-[1em] w-full fill-blue-400" />
                <span className="relative">{t.pricingLoadingTitleStart}</span>
              </span>{" "}
              {t.pricingLoadingTitleEnd}
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              {t.pricingLoadingSubtitle}
            </p>
          </div>
        </Container>
      </section>
    );
  }
  console.log({ plans });
  return (
    <section
      id="pricing"
      aria-label={t.pricingAria}
      className="bg-slate-900 py-20 sm:py-32"
    >
      <Container>
        <div className="md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            <span className="relative whitespace-nowrap">
              <SwirlyDoodle className="absolute top-1/2 left-0 h-[1em] w-full fill-blue-400" />
              <span className="relative">{t.pricingTitleStart}</span>
            </span>{" "}
            {t.pricingTitleEnd}
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            {t.pricingSubtitle}
          </p>
        </div>
        <div className="-mx-4 mt-16 grid max-w-2xl grid-cols-1 gap-y-10 sm:mx-auto lg:-mx-8 lg:max-w-none lg:grid-cols-4 xl:mx-0 xl:gap-x-8">
          {plans.map((plan, index) => (
            (() => {
              const display = getDisplay(plan);
              // Wrap plan with display-only overrides
              const displayPlan = { ...plan, name: display.name, description: display.description } as PlanData;
              return (
                <Plan
                  key={plan._id}
                  plan={displayPlan}
                  features={display.features}
                  featured={index === 2}
                  onPlanClick={handlePlanClick}
                  isLoading={checkoutLoading === plan._id}
                  getStartedLabel={display.cta}
                  openingCheckoutLabel={t.pricingOpeningCheckout}
                />
              );
            })()
          ))}
        </div>
      </Container>
    </section>
  );
}
