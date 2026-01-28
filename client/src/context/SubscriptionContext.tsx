import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import api from "@/services/api";
import { Food } from "@/services/api";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

/* =========================
   EXPORTED PLANS (UI NEEDS THIS)
========================= */

export type SubscriptionPlan = {
  id: string;
  name: string;
  mealsPerWeek: number;
  discountPercent: number;
  price: number;
  description: string;
};

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "starter",
    name: "Starter",
    mealsPerWeek: 5,
    discountPercent: 10,
    price: 999,
    description: "5 meals per week with 10% discount",
  },
  {
    id: "balanced",
    name: "Balanced",
    mealsPerWeek: 10,
    discountPercent: 15,
    price: 1799,
    description: "10 meals per week with 15% discount",
  },
  {
    id: "complete",
    name: "Complete",
    mealsPerWeek: 21,
    discountPercent: 20,
    price: 3499,
    description: "21 meals per week with 20% discount",
  },
];

/* =========================
   TYPES
========================= */

export type DeliveryDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type MealSlot = {
  day: DeliveryDay;
  mealType: "breakfast" | "lunch" | "dinner";
  food: Food | null;
};

export type Subscription = {
  _id: string;
  plan: SubscriptionPlan | string;
  meals: MealSlot[];
  active: boolean;
  status?: 'active' | 'paused' | 'cancelled';
  totalWeeklyPrice?: number;
  savedAmount?: number;
  nextDelivery?: string;
  createdAt: string;
};

/* =========================
   CONTEXT
========================= */

interface SubscriptionContextType {
  subscription: Subscription | null;
  selectedPlan: SubscriptionPlan | null;
  setSelectedPlan: (plan: SubscriptionPlan | null) => void;
  draftMeals: MealSlot[];
  addMealToSlot: (
    day: DeliveryDay,
    mealType: "breakfast" | "lunch" | "dinner",
    food: Food
  ) => void;
  removeMealFromSlot: (
    day: DeliveryDay,
    mealType: "breakfast" | "lunch" | "dinner"
  ) => void;
  clearDraftMeals: () => void;
  createSubscription: () => Promise<void>;
  cancelSubscription: () => Promise<void>;
  pauseSubscription: () => Promise<void>;
  resumeSubscription: () => Promise<void>;
  getWeeklyTotal: () => { original: number; discounted: number; saved: number };
  getMealCount: () => number;
}

const SubscriptionContext =
  createContext<SubscriptionContextType | undefined>(undefined);

/* =========================
   HELPERS
========================= */

const generateEmptyMealSlots = (): MealSlot[] => {
  const days: DeliveryDay[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const meals: ("breakfast" | "lunch" | "dinner")[] = [
    "breakfast",
    "lunch",
    "dinner",
  ];

  return days.flatMap((day) =>
    meals.map((mealType) => ({
      day,
      mealType,
      food: null,
    }))
  );
};

/* =========================
   PROVIDER
========================= */

export const SubscriptionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [selectedPlan, setSelectedPlan] =
    useState<SubscriptionPlan | null>(null);
  const [draftMeals, setDraftMeals] = useState<MealSlot[]>(
    generateEmptyMealSlots()
  );
  const { user } = useAuth();

  /* Load subscription from backend only when user is authenticated */
  useEffect(() => {
    if (user) {
      api
        .get("/subscriptions")
        .then((res) => setSubscription(res.data))
        .catch(() => setSubscription(null));
    } else {
      setSubscription(null);
    }
  }, [user]);

  const addMealToSlot = (
    day: DeliveryDay,
    mealType: "breakfast" | "lunch" | "dinner",
    food: Food
  ) => {
    setDraftMeals((prev) =>
      prev.map((slot) =>
        slot.day === day && slot.mealType === mealType
          ? { ...slot, food }
          : slot
      )
    );
  };

  const removeMealFromSlot = (
    day: DeliveryDay,
    mealType: "breakfast" | "lunch" | "dinner"
  ) => {
    setDraftMeals((prev) =>
      prev.map((slot) =>
        slot.day === day && slot.mealType === mealType
          ? { ...slot, food: null }
          : slot
      )
    );
  };

  const clearDraftMeals = () => {
    setDraftMeals(generateEmptyMealSlots());
  };

  const createSubscription = async () => {
    if (!selectedPlan) {
      toast.error("Please select a plan");
      return;
    }

    const res = await api.post("/subscriptions", {
      plan: selectedPlan.id,
      meals: draftMeals.filter((m) => m.food !== null),
    });

    setSubscription(res.data);
    toast.success(`${selectedPlan.name} subscription created`);
  };

  const cancelSubscription = async () => {
    await api.post("/subscriptions/cancel");
    setSubscription(null);
    setSelectedPlan(null);
    clearDraftMeals();
    toast.info("Subscription cancelled");
  };

  const pauseSubscription = async () => {
    if (!subscription) return;
    await api.post(`/subscriptions/${subscription._id}/pause`);
    setSubscription({ ...subscription, active: false });
    toast.info("Subscription paused");
  };

  const resumeSubscription = async () => {
    if (!subscription) return;
    await api.post(`/subscriptions/${subscription._id}/resume`);
    setSubscription({ ...subscription, active: true });
    toast.info("Subscription resumed");
  };

  const getWeeklyTotal = () => {
    if (!selectedPlan) return { original: 0, discounted: 0, saved: 0 };
    const mealCount = getMealCount();
    const original = mealCount * 300; // Assuming 300 per meal as base price
    const discounted = original * (1 - (selectedPlan.discountPercent || 0) / 100);
    const saved = original - discounted;
    return { original, discounted, saved };
  };

  const getMealCount = (): number => {
    return draftMeals.filter((m) => m.food !== null).length;
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        selectedPlan,
        setSelectedPlan,
        draftMeals,
        addMealToSlot,
        removeMealFromSlot,
        clearDraftMeals,
        createSubscription,
        cancelSubscription,
        pauseSubscription,
        resumeSubscription,
        getWeeklyTotal,
        getMealCount,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

/* =========================
   HOOK
========================= */

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error(
      "useSubscription must be used within a SubscriptionProvider"
    );
  }
  return ctx;
};
