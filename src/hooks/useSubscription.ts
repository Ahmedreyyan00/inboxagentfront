import { IPlan } from "@/Components/Subscription/SubscriptionTable";
import Api from "@/lib/Api";
import React, { useEffect, useState } from "react";

interface ISubscription {
  _id: string;
  user: string;
  status: string;
  expiry: Date;
  plan: IPlan;
  usage:number;
  cancelled: boolean;
}

const useSubscription = () => {
  const [currentSubscription, setCurrentSubscription] =
    useState<ISubscription>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getCurrentSubscription();
  }, []);

const refreshSubscription = () => {
  getCurrentSubscription()
}

  const getCurrentSubscription = async () => {
    try {
      setIsLoading(true);
      const { data } = await Api.getCurrentSubscription();
      setCurrentSubscription(data.subscription);
    } catch (error) {
      console.error("Error fetching current subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return { currentSubscription, isLoading,refreshSubscription };
};

export default useSubscription;
