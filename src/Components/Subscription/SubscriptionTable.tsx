"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  FaCircleCheck,
  FaSpinner,
  FaCrown,
  FaCheck,
  FaRegCreditCard,
} from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import Header from "../Layout/Header";
import useSubscription from "@/hooks/useSubscription";
import Api from "@/lib/Api";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { SubscriptionPageSkeleton } from "../ui/skeleton-loaders";
import { Progress } from "../ui/progress";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { isValidLanguageCode } from "@/Utils/languageUtils";
import { SubscriptionTranslations } from "@/transalations/CommonTransaltion";
import TransactionHistorySection from "../TransactionHistory/TransactionHistorySection";
import { getPlanCopy, LanguageCode } from "@/config/planCopy";

export interface IPlan {
  name: string;
  price: any;
  durationInDays: number;
  description?: string;
  features: string[];
  isPopular?: boolean;
  maxInvoicesPerMonth?: number | null;
  mailboxes?: number;
  supportLevel?: "Email" | "Priority" | "Premium";
  storageRegion?: string;
  _id: string;
  isClaimed: boolean;
  usage: number;
}

const SubscriptionTable = () => {
  const language = useSelector(
    (state: RootState) => state.language.activeLanguage
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [showUpdateConfirmation, setShowUpdateConfirmation] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { currentSubscription, isLoading, refreshSubscription } =
    useSubscription();
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);

  const currentLanguage = isValidLanguageCode(language) ? language : "en";
  const t = SubscriptionTranslations[currentLanguage];
  console.log({ currentSubscription, isCanceling });
  useEffect(() => {
    getPlans();
  }, []);

  const getPlans = async () => {
    try {
      setIsLoadingPlans(true);
      const { data } = await Api.getPlans();
      setPlans(data);
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const currentPlan = plans?.find(
    (plan) => plan?._id === currentSubscription?.plan?._id
  );

  const getDisplayFor = (plan: IPlan) => {
    const lang = (currentLanguage as LanguageCode) || "en";
    const copy = getPlanCopy(plan._id, lang);
    return {
      name: copy?.name ?? plan.name,
      description: copy?.tagline ?? plan.description,
      priceText: copy?.price ?? (typeof plan.price === "object" ? plan.price.$numberDecimal : String(plan.price)),
      billing: copy?.billing ?? "/month",
      features: copy?.features && copy.features.length > 0 ? copy.features : plan.features,
      label: copy?.label,
    };
  };

  // Usage and limit logic
  const usage = currentSubscription?.usage ?? 0;
  const usageLimit = currentPlan?.maxInvoicesPerMonth ?? null;
  const isOverLimit = usageLimit !== null && usage > usageLimit;
  const usagePercent =
    usageLimit && usageLimit > 0
      ? Math.min((usage / usageLimit) * 100, 100)
      : 0;

  const handlePlanSelect = async (planId: string) => {
    if (planId === currentPlan?._id) {
      return;
    }
    try {
      setIsUpdating(true);
      setSelectedPlan(planId);
      const { data } = await Api.createSubscription(planId);
      window.location.href = data.url;
      setShowUpdateConfirmation(true);
      setTimeout(() => setShowUpdateConfirmation(false), 3000);
    } catch (error) {
      console.error("Error updating plan:", error);
    } finally {
      setIsUpdating(false);
      setSelectedPlan(null);
    }
  };

  const handleChangePaymentMethod = async () => {
    return;
    try {
      const { data } = await Api.changePaymentMethod();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error changing payment method:", error);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      console.log("called");
      setIsCanceling(true);
      if (currentSubscription) {
        const { data } = await Api.cancelSubscription(currentSubscription._id);
        console.log({ data });
        await refreshSubscription();
      }
      setShowCancelConfirmation(true);
      setTimeout(() => setShowCancelConfirmation(false), 3000);
    } catch (error) {
      console.error("Error canceling subscription:", error);
    } finally {
      setIsCanceling(false);
    }
  };

  if (isLoadingPlans) {
    return <SubscriptionPageSkeleton />;
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-10">
      <Header title={"Subscription"} />

      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3 font-bold" style={{ color: 'var(--card-accent)' }}>
          {t.subscriptionPlans}
        </h1>
        <p className="text-sm sm:text-lg text-neutral-600 max-w-2xl">{t.choosePlan}</p>
      </div>

      {/* No Active Subscription Alert */}
      {!currentSubscription && (
        <div className="mb-8">
          <Alert variant="destructive">
            <AlertTitle>{t.noActiveSubscription}</AlertTitle>
            <AlertDescription>
              {t.noActiveSubscriptionDescription}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Usage Alert & Progress */}
      {currentPlan && usageLimit !== null && (
        <div className="mb-8 rounded-xl border-2 p-4 sm:p-6 shadow-sm" style={{ backgroundColor: 'var(--card-bg-light)', borderColor: 'var(--card-border-light)' }}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--card-accent)' }}>
            {t.currentUsage}
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-neutral-700">
                {t.invoicesThisMonth}:{" "}
                <span className="font-semibold text-lg">{usage}</span> /{" "}
                {usageLimit}
              </span>
              <span className="text-sm text-neutral-500">
                {Math.round(usagePercent)} {t.usagePercentUsed}
              </span>
            </div>
            <Progress value={usagePercent} className="h-3" />
            {isOverLimit && (
              <Alert variant="destructive">
                <AlertTitle>{t.usageLimitExceeded}</AlertTitle>
                <AlertDescription>
                  {t.usageLimitExceededDescription}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      )}

      {/* Current Plan Info */}
      {currentPlan && (
        <div className="mb-8 rounded-xl border-2 p-4 sm:p-6" style={{ backgroundColor: 'var(--card-bg-medium)', borderColor: 'var(--card-border-light)' }}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-lg font-medium" style={{ color: 'var(--card-accent)' }}>
                  {t.currentPlanLabel}
                </span>
                <span className="px-3 py-1 rounded-full text-white text-sm font-medium" style={{ backgroundColor: 'var(--card-accent)' }}>
                  {currentPlan.name}
                </span>
                {!!currentSubscription && currentSubscription.cancelled && (
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                    {t.cancelled}
                  </span>
                )}
                {!!currentSubscription && !currentSubscription.cancelled && (
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                    {t.active}
                  </span>
                )}
              </div>
              <p className="text-neutral-600">
                {t.nextBilling} <span className="font-medium">2025-06-10</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
              <div className="text-left sm:text-right">
                <div className="text-2xl sm:text-3xl font-bold leading-tight" style={{ color: 'var(--card-accent)' }}>
                  ${currentPlan.price}
                  <span className="text-lg font-normal text-neutral-600">
                    /month
                  </span>
                </div>
              </div>
              {!!currentSubscription && !currentSubscription.cancelled && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <button
                    disabled
                    onClick={handleChangePaymentMethod}
                    title="Coming soon"
                    className="w-full sm:w-auto px-4 py-2 border-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-sm"
                    style={{ borderColor: 'var(--card-border-light)', color: 'var(--card-accent)', backgroundColor: 'white' }}
                  >
                    <FaRegCreditCard className="text-sm" />
                    {t.updatePaymentMethod} — Coming soon
                  </button>
                  <button
                    disabled={isCanceling}
                    onClick={handleCancelSubscription}
                    className="w-full sm:w-auto px-4 py-2 border-2 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-sm"
                    style={{ borderColor: '#ef4444', color: '#ef4444', backgroundColor: 'white' }}
                  >
                    {isCanceling ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        {t.canceling}
                      </>
                    ) : (
                      <>
                        <FaTimes className="text-sm" />
                        {t.cancel}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {plans?.map((plan) => (
          <div
            key={plan._id}
            className={`rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
              currentPlan?._id === plan._id
                ? "shadow-lg"
                : ""
            } ${plan.isPopular ? "ring-2 ring-orange-200" : ""}`}
            style={{
              backgroundColor: 'var(--card-bg-light)',
              borderColor: currentPlan?._id === plan._id ? 'var(--card-accent)' : 'var(--card-border-light)'
            }}
          >
            {/* Plan Header */}
            <div className="p-4 sm:p-6 border-b border-neutral-100">
              <div className="flex items-start justify-between mb-4">
                {(() => {
                  const d = getDisplayFor(plan);
                  return (
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold mb-2" style={{ color: 'var(--card-accent)' }}>
                        {d.name}
                      </h3>
                      {d.description && (
                        <p className="text-neutral-600 text-sm">
                          {d.description}
                        </p>
                      )}
                    </div>
                  );
                })()}
                {plan.isPopular && (
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-medium flex items-center gap-1">
                    <FaCrown className="text-xs" />
                    {t.popular}
                  </span>
                )}
              </div>

              <div className="mb-4">
                {(() => {
                  const d = getDisplayFor(plan);
                  return (
                    <div className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--card-accent)' }}>
                      {d.priceText}
                      <span className="text-lg font-normal text-neutral-600">
                        {d.billing}
                      </span>
                    </div>
                  );
                })()}
              </div>

              {currentPlan?._id === plan._id && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                  <FaCheck className="mr-1 text-xs" />
                  {t.currentPlan}
                </span>
              )}
            </div>

            {/* Plan Features */}
            <div className="p-4 sm:p-6">
              <div className="space-y-4">
                {/* Features List */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--card-accent)' }}>
                    {t.features}
                  </h4>
                  {(() => {
                    const d = getDisplayFor(plan);
                    return (
                      <ul className="space-y-2">
                        {d.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <FaCheck className="text-green-500 text-sm mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-neutral-700">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    );
                  })()}
                </div>

                {/* Plan Details */}
                <div className="pt-4 border-t border-neutral-100">
                  <h4 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--card-accent)' }}>
                    {t.planDetails}
                  </h4>
                  <div className="space-y-2 text-sm">
                    {plan.maxInvoicesPerMonth && (
                      <div className="flex justify-between">
                        <span className="text-neutral-600">
                          {t.invoicesMonthLabel}:
                        </span>
                        <span className="font-medium text-neutral-800">
                          {plan.maxInvoicesPerMonth === -1
                            ? t.unlimited
                            : plan.maxInvoicesPerMonth}
                        </span>
                      </div>
                    )}
                    {plan.mailboxes && (
                      <div className="flex justify-between">
                        <span className="text-neutral-600">{t.mailboxes}:</span>
                        <span className="font-medium text-neutral-800">
                          {plan.mailboxes}
                        </span>
                      </div>
                    )}
                    {plan.supportLevel && (
                      <div className="flex justify-between">
                        <span className="text-neutral-600">{t.support}:</span>
                        <span className="font-medium text-neutral-800">
                          {plan.supportLevel}
                        </span>
                      </div>
                    )}
                    {plan.storageRegion && (
                      <div className="flex justify-between">
                        <span className="text-neutral-600">{t.storage}:</span>
                        <span className="font-medium text-neutral-800">
                          {plan.storageRegion}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Plan Action */}
            {!plan?.isClaimed && (
              <div className="p-4 sm:p-6 pt-0">
                {currentPlan?._id === plan._id ? (
                  <button className="w-full px-4 py-3 bg-neutral-100 text-neutral-500 rounded-lg text-sm font-medium cursor-not-allowed">
                    {t.currentPlanLabel}
                  </button>
                ) : (
                  <button
                    onClick={() => handlePlanSelect(plan._id)}
                    disabled={isUpdating && selectedPlan === plan._id}
                    className="w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-sm"
                    style={{ 
                      backgroundColor: 'var(--card-accent)',
                      borderColor: 'var(--card-accent)',
                      color: 'white'
                    }}
                  >
                    {isUpdating && selectedPlan === plan._id ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        {t.updating}
                      </>
                    ) : currentPlan &&
                      (typeof plan.price === "object"
                        ? plan.price.$numberDecimal
                        : plan.price) >
                        (typeof currentPlan.price === "object"
                          ? currentPlan.price.$numberDecimal
                          : currentPlan.price) ? (
                      t.upgradePlan
                    ) : (
                      t.selectPlan
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Confirmation Messages */}
      {(showUpdateConfirmation || showCancelConfirmation) && (
        <div className="mb-6">
          {showUpdateConfirmation && (
            <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              <FaCircleCheck className="mr-3 text-green-500 text-lg" />
              <span className="font-medium">
                {t.subscriptionUpdatedSuccess}
              </span>
            </div>
          )}
          {showCancelConfirmation && (
            <div className="flex items-center p-4 bg-orange-50 border border-orange-200 rounded-lg text-orange-700">
              <FaCircleCheck className="mr-3 text-orange-500 text-lg" />
              <span className="font-medium">{t.subscriptionCanceled}</span>
            </div>
          )}
        </div>
      )}

      {/* Transaction History Section */}
      <div className="mb-8">
        <TransactionHistorySection showFullHistory={false} maxTransactions={5} />
      </div>

      {/* Help Section */}
      <div className="rounded-xl border-2 p-6" style={{ backgroundColor: 'var(--card-bg-medium)', borderColor: 'var(--card-border-light)' }}>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--card-accent)' }}>
            {t.helpSectionHeader}
          </h3>
          <p className="mb-4 max-w-2xl mx-auto" style={{ color: 'var(--card-accent)', opacity: 0.8 }}>
            {t.helpSectionDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="/help-center#contact-form"
              className="px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 hover:shadow-sm"
              style={{ backgroundColor: 'var(--card-accent)', color: 'white' }}
            >
              <FaRegCreditCard />
              {t.contactSales}
            </a>
            <button className="px-6 py-3 border-2 rounded-lg font-medium transition-colors hover:shadow-sm"
              style={{ borderColor: 'var(--card-accent)', color: 'var(--card-accent)', backgroundColor: 'white' }}
            >
              {t.scheduleDemo}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SubscriptionTable;
