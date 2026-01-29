import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { cartAPI, CartItem, Food } from "@/services/api";
import { useAuth } from "./AuthContext";

/* =========================
   TYPES
========================= */

interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (food: Food, quantity?: number) => Promise<void>;
  updateQuantity: (foodId: string, quantity: number) => Promise<void>;
  removeItem: (foodId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getTotalNutrition: () => Nutrition;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

/* =========================
   HELPERS
========================= */

const isValidMongoId = (id?: string) =>
  typeof id === "string" && /^[a-f\d]{24}$/i.test(id);

/* =========================
   PROVIDER
========================= */

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  /* =========================
     LOAD CART
  ========================= */

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    cartAPI
      .get()
      .then((res) => {
        setItems(res.data.items || []);
      })
      .catch(() => setItems([]));
  }, [user]);

  /* =========================
     SYNC CART
  ========================= */

  const syncCart = async (newItems: CartItem[]) => {
    if (!user) return;

    setItems(newItems);

    try {
      const payload = newItems
        .map((item) => {
          const mongoId =
            item.food._id ??
            (isValidMongoId(item.food.id) ? item.food.id : undefined);

          if (!mongoId) {
            console.error("❌ Invalid food ID:", item.food);
            return null;
          }

          return {
            food: mongoId,
            quantity: item.quantity,
          };
        })
        .filter(Boolean) as { food: string; quantity: number }[];

      if (payload.length === 0) {
        console.error("❌ No valid items to sync");
        return;
      }

      const response = await cartAPI.update(payload);

      if (response.data?.items) {
        setItems(response.data.items);
      }
    } catch (err: any) {
      console.error("❌ Failed to sync cart:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
    }
  };

  /* =========================
     ACTIONS
  ========================= */

  const addItem = async (food: Food, quantity = 1) => {
    if (!user) return;

    // 🔑 NORMALIZE FOOD ID
    const mongoId =
      food._id ?? (isValidMongoId(food.id) ? food.id : undefined);

    if (!mongoId) {
      console.error("❌ Food has no valid Mongo ID:", food);
      return;
    }

    // Ensure food object always contains _id
    const normalizedFood: Food = {
      ...food,
      _id: mongoId,
    };

    const existing = items.find((i) => i.food._id === mongoId);

    const updated = existing
      ? items.map((i) =>
          i.food._id === mongoId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      : [...items, { food: normalizedFood, quantity }];

    await syncCart(updated);
  };

  const updateQuantity = async (foodId: string, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      await removeItem(foodId);
      return;
    }

    await syncCart(
      items.map((i) =>
        i.food._id === foodId ? { ...i, quantity } : i
      )
    );
  };

  const removeItem = async (foodId: string) => {
    if (!user) return;

    await syncCart(items.filter((i) => i.food._id !== foodId));
  };

  const clearCart = async () => {
    if (!user) return;

    setItems([]);
    await cartAPI.clear();
  };

  /* =========================
     TOTALS
  ========================= */

  const getTotalItems = () =>
    items.reduce((sum, i) => sum + i.quantity, 0);

  const getTotalPrice = () =>
    items.reduce((sum, i) => {
      if (!i.food?.price) return sum;
      return sum + i.food.price * i.quantity;
    }, 0);

  const getTotalNutrition = (): Nutrition =>
    items.reduce(
      (total, item) => {
        if (!item.food?.nutrition) return total;

        return {
          calories:
            total.calories +
            item.food.nutrition.calories * item.quantity,
          protein:
            total.protein +
            item.food.nutrition.protein * item.quantity,
          carbs:
            total.carbs +
            item.food.nutrition.carbs * item.quantity,
          fat:
            total.fat +
            item.food.nutrition.fat * item.quantity,
          fiber:
            total.fiber +
            (item.food.nutrition.fiber || 0) * item.quantity,
          sugar:
            total.sugar +
            (item.food.nutrition.sugar || 0) * item.quantity,
          sodium:
            total.sodium +
            (item.food.nutrition.sodium || 0) * item.quantity,
        };
      },
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0,
      }
    );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getTotalNutrition,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/* =========================
   HOOK
========================= */

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
};
