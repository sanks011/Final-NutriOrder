import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft, Check, AlertTriangle, 
  User, Heart, Scale, Utensils, Activity, Sparkles,
  ChevronRight
} from 'lucide-react';
import Layout from '@/components/common/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useHealth } from '@/context/HealthContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { HealthProfile } from '@/services/api';

const steps = [
  { id: 'welcome', title: 'Welcome', icon: Sparkles },
  { id: 'basics', title: 'Basic Info', icon: User },
  { id: 'diet', title: 'Diet Type', icon: Utensils },
  { id: 'conditions', title: 'Health Conditions', icon: Heart },
  { id: 'allergies', title: 'Allergies', icon: AlertTriangle },
  { id: 'goals', title: 'Goals', icon: Activity },
  { id: 'complete', title: 'Complete', icon: Check },
];

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
  { value: 'none', label: 'None', icon: '✅', desc: 'No conditions' },
];

const commonAllergies = [
  'Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Wheat', 'Soy', 
  'Fish', 'Shellfish', 'Gluten', 'Sesame'
];

const weightGoals = [
  { value: 'loss', label: 'Lose Weight', icon: '📉', desc: 'Caloric deficit' },
  { value: 'maintain', label: 'Maintain Weight', icon: '⚖️', desc: 'Stay balanced' },
  { value: 'gain', label: 'Gain Weight', icon: '📈', desc: 'Build mass' },
  { value: 'muscle', label: 'Build Muscle', icon: '💪', desc: 'High protein focus' },
];

const activityLevels = [
  { value: 'sedentary', label: 'Sedentary', icon: '🪑', multiplier: 1.2 },
  { value: 'light', label: 'Light Active', icon: '🚶', multiplier: 1.375 },
  { value: 'moderate', label: 'Moderate', icon: '🏃', multiplier: 1.55 },
  { value: 'very', label: 'Very Active', icon: '🏋️', multiplier: 1.725 },
];

const ProfileWizard: React.FC = () => {
  const navigate = useNavigate();
  const { updateProfile } = useHealth();
  const { updateUser } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    age: 25,
    gender: 'male',
    height: 170,
    weight: 70,
    dietType: 'non-veg' as HealthProfile['dietType'],
    medicalConditions: [] as string[],
    allergies: [] as string[],
    weightGoal: 'maintain' as HealthProfile['weightGoal'],
    activityLevel: 'moderate',
    calorieLimit: 2000,
    sugarLimit: 50,
    sodiumLimit: 2300,
    cholesterolLimit: 300,
    spiceTolerance: 'medium' as HealthProfile['spiceTolerance'],
  });

  const progress = ((currentStep) / (steps.length - 1)) * 100;

  const calculateCalories = () => {
    const { weight, height, age, gender, activityLevel, weightGoal } = formData;
    let bmr = gender === 'male' 
      ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
      : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    
    const activity = activityLevels.find(a => a.value === activityLevel);
    let tdee = bmr * (activity?.multiplier || 1.55);
    
    if (weightGoal === 'loss') tdee -= 500;
    if (weightGoal === 'gain') tdee += 300;
    
    return Math.round(tdee);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      if (currentStep === 5) {
        setFormData(prev => ({ ...prev, calorieLimit: calculateCalories() }));
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const profile: HealthProfile = {
      dietType: formData.dietType,
      medicalConditions: formData.medicalConditions,
      allergies: formData.allergies,
      calorieLimit: formData.calorieLimit,
      sugarLimit: formData.sugarLimit,
      sodiumLimit: formData.sodiumLimit,
      cholesterolLimit: formData.cholesterolLimit,
      weightGoal: formData.weightGoal,
      spiceTolerance: formData.spiceTolerance,
    };
    
    updateProfile(profile);
    updateUser({ hasCompletedHealthProfile: true });
    toast.success('Profile created successfully!', {
      description: 'Your personalized recommendations are ready.',
    });
    navigate('/');
  };

  const toggleArrayItem = (array: string[], item: string) => {
    if (item === 'none') return ['none'];
    const filtered = array.filter((i) => i !== 'none');
    return filtered.includes(item) ? filtered.filter((i) => i !== item) : [...filtered, item];
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.name.length >= 2;
      default: return true;
    }
  };

  return (
    <Layout hideFooter>
      <div className="min-h-[calc(100vh-80px)] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isComplete = index < currentStep;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <motion.div
                      initial={false}
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        backgroundColor: isComplete ? 'hsl(var(--primary))' : isActive ? 'hsl(var(--primary) / 0.2)' : 'hsl(var(--muted))',
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isComplete ? 'text-primary-foreground' : isActive ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {isComplete ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </motion.div>
                    {index < steps.length - 1 && (
                      <div className={`hidden sm:block w-8 h-0.5 mx-1 ${isComplete ? 'bg-primary' : 'bg-muted'}`} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-6 md:p-8 rounded-3xl min-h-[450px]"
            >
              {/* Step 0: Welcome */}
              {currentStep === 0 && (
                <div className="text-center py-8 space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 mx-auto rounded-full bg-gradient-primary flex items-center justify-center"
                  >
                    <Sparkles className="w-12 h-12 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-display font-bold text-foreground">
                    Welcome to <span className="text-gradient-warm">NutriOrder</span>
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto">
                    Let's set up your health profile to get personalized meal recommendations based on your unique needs.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 pt-4">
                    {['AI Recommendations', 'Calorie Tracking', 'Allergy Alerts'].map((feature) => (
                      <span key={feature} className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        ✨ {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-display font-bold text-foreground">Tell us about yourself</h2>
                    <p className="text-muted-foreground mt-1">Basic information helps us calculate your needs</p>
                  </div>
                  
                  <div className="space-y-5">
                    <div>
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-2 h-12 rounded-xl"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Age: {formData.age} years</Label>
                        <Slider
                          value={[formData.age]}
                          onValueChange={(v) => setFormData({ ...formData, age: v[0] })}
                          min={16}
                          max={80}
                          className="mt-3"
                        />
                      </div>
                      <div>
                        <Label>Gender</Label>
                        <div className="flex gap-2 mt-2">
                          {['male', 'female'].map((g) => (
                            <button
                              key={g}
                              onClick={() => setFormData({ ...formData, gender: g })}
                              className={`flex-1 py-3 rounded-xl border-2 capitalize font-medium transition-all ${
                                formData.gender === g ? 'border-primary bg-primary/10 text-primary' : 'border-border'
                              }`}
                            >
                              {g === 'male' ? '👨' : '👩'} {g}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Height: {formData.height} cm</Label>
                        <Slider
                          value={[formData.height]}
                          onValueChange={(v) => setFormData({ ...formData, height: v[0] })}
                          min={120}
                          max={220}
                          className="mt-3"
                        />
                      </div>
                      <div>
                        <Label>Weight: {formData.weight} kg</Label>
                        <Slider
                          value={[formData.weight]}
                          onValueChange={(v) => setFormData({ ...formData, weight: v[0] })}
                          min={30}
                          max={200}
                          className="mt-3"
                        />
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                      <p className="text-sm text-muted-foreground">
                        BMI: <span className="font-bold text-foreground">
                          {(formData.weight / Math.pow(formData.height / 100, 2)).toFixed(1)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Diet Type */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-display font-bold text-foreground">What's your diet type?</h2>
                    <p className="text-muted-foreground mt-1">We'll customize your menu accordingly</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {dietTypes.map((diet) => (
                      <motion.button
                        key={diet.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, dietType: diet.value as HealthProfile['dietType'] })}
                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                          formData.dietType === diet.value
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <span className="text-3xl">{diet.icon}</span>
                        <div>
                          <p className="font-semibold text-foreground">{diet.label}</p>
                          <p className="text-xs text-muted-foreground">{diet.desc}</p>
                        </div>
                        {formData.dietType === diet.value && (
                          <Check className="ml-auto w-5 h-5 text-primary" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Medical Conditions */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-display font-bold text-foreground">Any health conditions?</h2>
                    <p className="text-muted-foreground mt-1">Select all that apply for safer recommendations</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {medicalConditions.map((condition) => (
                      <motion.button
                        key={condition.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ 
                          ...formData, 
                          medicalConditions: toggleArrayItem(formData.medicalConditions, condition.value) 
                        })}
                        className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                          formData.medicalConditions.includes(condition.value)
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <span className="text-2xl">{condition.icon}</span>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{condition.label}</p>
                          <p className="text-xs text-muted-foreground">{condition.desc}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Allergies */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-display font-bold text-foreground">Any food allergies?</h2>
                    <p className="text-muted-foreground mt-1">We'll warn you about foods containing these</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {commonAllergies.map((allergy) => (
                      <motion.button
                        key={allergy}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFormData({ 
                          ...formData, 
                          allergies: toggleArrayItem(formData.allergies, allergy) 
                        })}
                        className={`px-4 py-2.5 rounded-full border-2 text-sm font-medium transition-all ${
                          formData.allergies.includes(allergy)
                            ? 'border-destructive bg-destructive/10 text-destructive'
                            : 'border-border hover:border-primary/50 text-foreground'
                        }`}
                      >
                        {formData.allergies.includes(allergy) && (
                          <AlertTriangle className="w-3.5 h-3.5 inline mr-1.5" />
                        )}
                        {allergy}
                      </motion.button>
                    ))}
                  </div>
                  {formData.allergies.length > 0 && (
                    <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                      <p className="text-sm text-destructive flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        We'll alert you about foods containing: {formData.allergies.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Goals */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-display font-bold text-foreground">What's your goal?</h2>
                    <p className="text-muted-foreground mt-1">We'll optimize your calorie targets</p>
                  </div>
                  
                  <div>
                    <Label className="mb-3 block">Weight Goal</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {weightGoals.map((goal) => (
                        <motion.button
                          key={goal.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData({ ...formData, weightGoal: goal.value as HealthProfile['weightGoal'] })}
                          className={`p-4 rounded-2xl border-2 text-center transition-all ${
                            formData.weightGoal === goal.value ? 'border-primary bg-primary/10' : 'border-border'
                          }`}
                        >
                          <span className="text-2xl">{goal.icon}</span>
                          <p className="font-semibold mt-1">{goal.label}</p>
                          <p className="text-xs text-muted-foreground">{goal.desc}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="mb-3 block">Activity Level</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {activityLevels.map((level) => (
                        <motion.button
                          key={level.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setFormData({ ...formData, activityLevel: level.value })}
                          className={`p-4 rounded-2xl border-2 text-center transition-all ${
                            formData.activityLevel === level.value ? 'border-primary bg-primary/10' : 'border-border'
                          }`}
                        >
                          <span className="text-2xl">{level.icon}</span>
                          <p className="font-semibold mt-1">{level.label}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Complete */}
              {currentStep === 6 && (
                <div className="text-center py-6 space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 mx-auto rounded-full bg-success flex items-center justify-center"
                  >
                    <Check className="w-12 h-12 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-display font-bold text-foreground">
                    You're all set, <span className="text-gradient-warm">{formData.name}!</span>
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Your personalized profile has been created.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-left">
                    <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                      <p className="text-sm text-muted-foreground">Daily Calories</p>
                      <p className="text-2xl font-bold text-primary">{calculateCalories()} kcal</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-success/10 border border-success/20">
                      <p className="text-sm text-muted-foreground">Diet Type</p>
                      <p className="text-2xl font-bold text-success capitalize">{formData.dietType}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    {formData.medicalConditions.length > 0 && formData.medicalConditions[0] !== 'none' && (
                      <span className="px-3 py-1 rounded-full bg-warning/10 text-warning text-sm">
                        {formData.medicalConditions.length} condition{formData.medicalConditions.length > 1 ? 's' : ''} tracked
                      </span>
                    )}
                    {formData.allergies.length > 0 && (
                      <span className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm">
                        {formData.allergies.length} allerg{formData.allergies.length > 1 ? 'ies' : 'y'} tracked
                      </span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {currentStep > 0 && currentStep < steps.length - 1 ? (
              <Button variant="outline" onClick={handleBack} className="rounded-full px-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : (
              <div />
            )}
            
            {currentStep < steps.length - 1 ? (
              <Button 
                onClick={handleNext} 
                disabled={!canProceed()}
                className="rounded-full px-6 btn-soft"
              >
                {currentStep === 0 ? "Let's Start" : 'Continue'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete} className="rounded-full px-8 btn-soft">
                Start Exploring
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfileWizard;
