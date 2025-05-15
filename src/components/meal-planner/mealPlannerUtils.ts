
// Function to get the formatted date key
export const getDateKey = (date: Date) => {
  return date.toISOString().split('T')[0];
};

// Function to generate dates for the weekly view
export const getWeekDates = (currentDate: Date) => {
  const dates = [];
  const currentDay = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const firstDayOfWeek = new Date(currentDate);
  firstDayOfWeek.setDate(currentDate.getDate() - currentDay);

  for (let i = 0; i < 7; i++) {
    const date = new Date(firstDayOfWeek);
    date.setDate(firstDayOfWeek.getDate() + i);
    dates.push(date);
  }

  return dates;
};

// Interface for meal data
export interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Interface for daily meal plan
export interface DailyMealPlan {
  breakfast: Meal | null;
  lunch: Meal | null;
  dinner: Meal | null;
  snacks: Meal[];
}

// Mock data for initial meal plan
export const mockMealPlan: Record<string, DailyMealPlan> = {
  '2023-05-15': {
    breakfast: {
      name: 'Greek Yogurt Bowl',
      calories: 320,
      protein: 22,
      carbs: 40,
      fat: 8,
    },
    lunch: {
      name: 'Quinoa Salad with Grilled Chicken',
      calories: 450,
      protein: 35,
      carbs: 45,
      fat: 15,
    },
    dinner: {
      name: 'Salmon with Roasted Vegetables',
      calories: 580,
      protein: 42,
      carbs: 30,
      fat: 28,
    },
    snacks: [
      {
        name: 'Apple with Almond Butter',
        calories: 200,
        protein: 5,
        carbs: 25,
        fat: 10,
      },
    ],
  },
};

// Get empty meal plan structure
export const getEmptyMealPlan = (): DailyMealPlan => {
  return {
    breakfast: null,
    lunch: null,
    dinner: null,
    snacks: [],
  };
};
