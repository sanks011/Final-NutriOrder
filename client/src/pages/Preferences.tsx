import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, AlertTriangle } from 'lucide-react';
import Layout from '@/components/common/Layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useHealth } from '@/context/HealthContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { HealthProfile } from '@/services/api';

const steps = ['Diet Type', 'Medical Conditions', 'Allergies', 'Nutrition Goals', 'Activity & Goals', 'Preferences'];

const dietTypes = [
  { value: 'veg', label: 'Vegetarian', icon: '🥬', desc: 'No meat or fish' },
  { value: 'non-veg', label: 'Non-Vegetarian', icon: '🍗', desc: 'Includes all foods' },
  { value: 'vegan', label: 'Vegan', icon: '🌱', desc: 'No animal products' },
  { value: 'pescatarian', label: 'Pescatarian', icon: '🐟', desc: 'Vegetarian + seafood' },
  { value: 'keto', label: 'Keto', icon: '🥑', desc: 'High fat, low carb' },
  { value: 'paleo', label: 'Paleo', icon: '🥩', desc: 'Whole foods, no grains' },
];

const medicalConditions = [
  { value: 'diabetes', label: 'Diabetes', icon: '🩸', desc: 'Type 1 or Type 2' },
  { value: 'blood-pressure', label: 'High Blood Pressure', icon: '❤️', desc: 'Hypertension' },
  { value: 'thyroid', label: 'Thyroid', icon: '🦋', desc: 'Hypo/Hyperthyroidism' },
  { value: 'heart', label: 'Heart Disease', icon: '💗', desc: 'Cardiovascular issues' },
  { value: 'cholesterol', label: 'High Cholesterol', icon: '🫀', desc: 'Lipid management' },
  { value: 'kidney', label: 'Kidney Disease', icon: '🫘', desc: 'Renal health' },
  { value: 'gout', label: 'Gout', icon: '🦶', desc: 'Uric acid issues' },
  { value: 'pcos', label: 'PCOS', icon: '♀️', desc: 'Hormonal balance' },
  { value: 'ibs', label: 'IBS', icon: '🫃', desc: 'Digestive sensitivity' },
  { value: 'none', label: 'None', icon: '✅', desc: 'No conditions' },
];

const commonAllergies = [
  'Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Wheat', 'Soy', 
  'Fish', 'Shellfish', 'Gluten', 'Sesame', 'Mustard', 'Corn',
  'Sulfites', 'Celery', 'Lupin'
];

const weightGoals = [
  { value: 'loss', label: 'Lose Weight', icon: '📉', desc: 'Caloric deficit' },
  { value: 'maintain', label: 'Maintain Weight', icon: '⚖️', desc: 'Stay balanced' },
  { value: 'gain', label: 'Gain Weight', icon: '📈', desc: 'Build mass' },
  { value: 'muscle', label: 'Build Muscle', icon: '💪', desc: 'High protein focus' },
];

const activityLevels = [
  { value: 'sedentary', label: 'Sedentary', icon: '🪑', desc: 'Little to no exercise' },
  { value: 'light', label: 'Lightly Active', icon: '🚶', desc: '1-3 days/week' },
  { value: 'moderate', label: 'Moderately Active', icon: '🏃', desc: '3-5 days/week' },
  { value: 'very', label: 'Very Active', icon: '🏋️', desc: '6-7 days/week' },
  { value: 'athlete', label: 'Athlete', icon: '🏆', desc: '2x per day training' },
];

const spiceLevels = [
  { value: 'mild', label: 'Mild', icon: '🌶️' },
  { value: 'medium', label: 'Medium', icon: '🌶️🌶️' },
  { value: 'hot', label: 'Hot', icon: '🌶️🌶️🌶️' },
  { value: 'extra-hot', label: 'Extra Hot', icon: '🔥' },
];

const cuisinePreferences = [
  { value: 'indian', label: 'Indian', icon: '🍛' },
  { value: 'chinese', label: 'Chinese', icon: '🥡' },
  { value: 'italian', label: 'Italian', icon: '🍝' },
  { value: 'mexican', label: 'Mexican', icon: '🌮' },
  { value: 'japanese', label: 'Japanese', icon: '🍣' },
  { value: 'thai', label: 'Thai', icon: '🍜' },
  { value: 'mediterranean', label: 'Mediterranean', icon: '🫒' },
  { value: 'american', label: 'American', icon: '🍔' },
];

const mealTimings = [
  { value: 'early-bird', label: 'Early Bird', icon: '🌅', desc: 'Breakfast before 7 AM' },
  { value: 'regular', label: 'Regular', icon: '☀️', desc: 'Standard meal times' },
  { value: 'late-eater', label: 'Late Eater', icon: '🌙', desc: 'Dinner after 8 PM' },
  { value: 'intermittent', label: 'Intermittent Fasting', icon: '⏰', desc: '16:8 or similar' },
];

const Preferences: React.FC = () => {
  const navigate = useNavigate();
  const { updateProfile } = useHealth();
  const { updateUser } = useAuth();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<HealthProfile & {
    activityLevel?: string;
    cuisinePreferences?: string[];
    mealTiming?: string;
    proteinGoal?: number;
    fiberGoal?: number;
  }>({
    dietType: 'non-veg',
    medicalConditions: [],
    allergies: [],
    calorieLimit: 2000,
    sugarLimit: 50,
    sodiumLimit: 2300,
    cholesterolLimit: 300,
    weightGoal: 'maintain',
    spiceTolerance: 'medium',
    activityLevel: 'moderate',
    cuisinePreferences: [],
    mealTiming: 'regular',
    proteinGoal: 50,
    fiberGoal: 25,
  });

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    updateProfile(formData);
    updateUser({ hasCompletedHealthProfile: true });
    toast({
      title: 'Profile saved!',
      description: 'Your health preferences have been saved successfully.',
    });
    navigate('/');
  };

  const toggleArrayItem = (array: string[], item: string) => {
    if (item === 'none') return ['none'];
    const filtered = array.filter((i) => i !== 'none');
    return filtered.includes(item) ? filtered.filter((i) => i !== item) : [...filtered, item];
  };

  return (
    <Layout hideFooter>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{steps[currentStep]}</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="glass-card p-8 min-h-[450px]">
            {/* Step 0: Diet Type */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-foreground">What's your diet type?</h2>
                <div className="grid grid-cols-2 gap-3">
                  {dietTypes.map((diet) => (
                    <button
                      key={diet.value}
                      onClick={() => setFormData({ ...formData, dietType: diet.value as HealthProfile['dietType'] })}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        formData.dietType === diet.value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="text-2xl">{diet.icon}</span>
                      <div className="text-left">
                        <p className="font-medium text-foreground text-sm">{diet.label}</p>
                        <p className="text-xs text-muted-foreground">{diet.desc}</p>
                      </div>
                      {formData.dietType === diet.value && <Check className="ml-auto w-4 h-4 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Medical Conditions */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-foreground">Any medical conditions?</h2>
                <p className="text-muted-foreground">Select all that apply for personalized recommendations</p>
                <div className="grid grid-cols-2 gap-3">
                  {medicalConditions.map((condition) => (
                    <button
                      key={condition.value}
                      onClick={() => setFormData({ ...formData, medicalConditions: toggleArrayItem(formData.medicalConditions, condition.value) })}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                        formData.medicalConditions.includes(condition.value)
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="text-xl">{condition.icon}</span>
                      <div className="text-left">
                        <span className="font-medium text-foreground text-sm block">{condition.label}</span>
                        <span className="text-xs text-muted-foreground">{condition.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Allergies */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-foreground">Any food allergies?</h2>
                <p className="text-muted-foreground">We'll filter out foods containing these allergens</p>
                <div className="flex flex-wrap gap-2">
                  {commonAllergies.map((allergy) => (
                    <button
                      key={allergy}
                      onClick={() => setFormData({ ...formData, allergies: toggleArrayItem(formData.allergies, allergy) })}
                      className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                        formData.allergies.includes(allergy)
                          ? 'border-destructive bg-destructive/10 text-destructive'
                          : 'border-border hover:border-primary/50 text-foreground'
                      }`}
                    >
                      {formData.allergies.includes(allergy) && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                      {allergy}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Nutrition Goals */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-foreground">Set your nutrition limits</h2>
                <div className="space-y-5">
                  <div className="space-y-3">
                    <Label>Daily Calorie Limit: {formData.calorieLimit} kcal</Label>
                    <Slider value={[formData.calorieLimit]} onValueChange={(v) => setFormData({ ...formData, calorieLimit: v[0] })} min={1200} max={4000} step={100} />
                  </div>
                  <div className="space-y-3">
                    <Label>Daily Sugar Limit: {formData.sugarLimit}g</Label>
                    <Slider value={[formData.sugarLimit]} onValueChange={(v) => setFormData({ ...formData, sugarLimit: v[0] })} min={0} max={100} step={5} />
                  </div>
                  <div className="space-y-3">
                    <Label>Daily Sodium Limit: {formData.sodiumLimit}mg</Label>
                    <Slider value={[formData.sodiumLimit]} onValueChange={(v) => setFormData({ ...formData, sodiumLimit: v[0] })} min={500} max={4000} step={100} />
                  </div>
                  <div className="space-y-3">
                    <Label>Daily Protein Goal: {formData.proteinGoal}g</Label>
                    <Slider value={[formData.proteinGoal || 50]} onValueChange={(v) => setFormData({ ...formData, proteinGoal: v[0] })} min={20} max={200} step={5} />
                  </div>
                  <div className="space-y-3">
                    <Label>Daily Fiber Goal: {formData.fiberGoal}g</Label>
                    <Slider value={[formData.fiberGoal || 25]} onValueChange={(v) => setFormData({ ...formData, fiberGoal: v[0] })} min={10} max={50} step={5} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Activity & Goals */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-foreground">Activity Level & Goals</h2>
                <div className="space-y-6">
                  <div>
                    <Label className="mb-3 block">Activity Level</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {activityLevels.map((level) => (
                        <button
                          key={level.value}
                          onClick={() => setFormData({ ...formData, activityLevel: level.value })}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${
                            formData.activityLevel === level.value ? 'border-primary bg-primary/10' : 'border-border'
                          }`}
                        >
                          <span className="text-xl">{level.icon}</span>
                          <p className="text-sm font-medium mt-1">{level.label}</p>
                          <p className="text-xs text-muted-foreground">{level.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="mb-3 block">Weight Goal</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {weightGoals.map((goal) => (
                        <button
                          key={goal.value}
                          onClick={() => setFormData({ ...formData, weightGoal: goal.value as HealthProfile['weightGoal'] })}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            formData.weightGoal === goal.value ? 'border-primary bg-primary/10' : 'border-border'
                          }`}
                        >
                          <span className="text-xl">{goal.icon}</span>
                          <p className="text-sm font-medium mt-1">{goal.label}</p>
                          <p className="text-xs text-muted-foreground">{goal.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Preferences */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-display font-bold text-foreground">Final preferences</h2>
                <div className="space-y-6">
                  <div>
                    <Label className="mb-3 block">Spice Tolerance</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {spiceLevels.map((level) => (
                        <button
                          key={level.value}
                          onClick={() => setFormData({ ...formData, spiceTolerance: level.value as HealthProfile['spiceTolerance'] })}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            formData.spiceTolerance === level.value ? 'border-primary bg-primary/10' : 'border-border'
                          }`}
                        >
                          <span className="text-lg">{level.icon}</span>
                          <p className="text-xs mt-1">{level.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="mb-3 block">Preferred Cuisines</Label>
                    <div className="flex flex-wrap gap-2">
                      {cuisinePreferences.map((cuisine) => (
                        <button
                          key={cuisine.value}
                          onClick={() => setFormData({ 
                            ...formData, 
                            cuisinePreferences: toggleArrayItem(formData.cuisinePreferences || [], cuisine.value) 
                          })}
                          className={`px-3 py-2 rounded-full border-2 text-sm transition-all flex items-center gap-1 ${
                            formData.cuisinePreferences?.includes(cuisine.value) 
                              ? 'border-primary bg-primary/10' 
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <span>{cuisine.icon}</span>
                          <span>{cuisine.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="mb-3 block">Meal Timing</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {mealTimings.map((timing) => (
                        <button
                          key={timing.value}
                          onClick={() => setFormData({ ...formData, mealTiming: timing.value })}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${
                            formData.mealTiming === timing.value ? 'border-primary bg-primary/10' : 'border-border'
                          }`}
                        >
                          <span className="text-xl">{timing.icon}</span>
                          <p className="text-sm font-medium mt-1">{timing.label}</p>
                          <p className="text-xs text-muted-foreground">{timing.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <Button onClick={handleNext}>
              {currentStep === steps.length - 1 ? 'Save Profile' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Preferences;
