import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { userAPI, Food } from "@/services/api";
import { useAuth } from "./AuthContext";

export const HealthContext = createContext<any>(null);

export const HealthProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      userAPI.getPreferences()
        .then(res => setProfile(res.data))
        .catch(() => setProfile(null));
    }
  }, [user]);

  const updateProfile = async (data: any) => {
    const res = await userAPI.savePreferences(data);
    setProfile(res.data.preferences);
  };

  const checkFoodSafety = (food?: Food) => {
    // 🔒 HARD SAFETY GUARD
    if (!food || !food.nutrition) {
      return {
        isSafe: true,
        warnings: [],
      };
    }

    const warnings: string[] = [];

    if (
      profile?.medicalConditions?.includes("diabetes") &&
      food.nutrition.sugar > (profile.sugarLimit ?? Infinity)
    ) {
      warnings.push("High sugar content");
    }

    if (
      profile?.medicalConditions?.includes("blood-pressure") &&
      food.nutrition.sodium > (profile.sodiumLimit ?? Infinity)
    ) {
      warnings.push("High sodium content");
    }

    if (
      profile?.medicalConditions?.includes("heart") &&
      !food.isHeartHealthy
    ) {
      warnings.push("Not heart friendly");
    }

    return {
      isSafe: warnings.length === 0,
      warnings,
    };
  };

  const isProfileComplete = !!profile && profile.dietType && profile.medicalConditions;

  return (
    <HealthContext.Provider value={{ profile, updateProfile, checkFoodSafety, isProfileComplete, healthProfile: profile }}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => useContext(HealthContext);
