import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useMemo, useState } from "react"
import { Progress } from "./ui/progress"
import { ArrowLeft, ArrowRight, Heart, MapPin } from "lucide-react"
import { CATEGORIES } from "@/lib/data"
import { Badge } from "./ui/badge"
import useFetch from "@/hooks/use-fetch"
import { completeOnboarding } from "@/actions/user"
import { toast } from "sonner"
import { City, State } from "country-state-city"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useRouter } from "next/navigation"

export function OnboardingModal({ isOpen, onClose, onComplete }: {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}) {
  const [step, setStep] = useState<number>(1)
  const router = useRouter();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [location, setLocation] = useState<{ city: string; state: string; country: string }>({
    city: "",
    state: "",
    country: "India",
  });

  const indianStates = State.getStatesOfCountry("IN");

  const cities = useMemo(() => {
    if(!location.state) return [];
    const selectedState = indianStates.find((s) => s.name === location.state);
    if(!selectedState) return [];
    return City.getCitiesOfState("IN", selectedState.isoCode);
  }, [location.state, indianStates]);

  const progress = (step / 2) * 100;

  const toggleInterest = (categoryId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  }

  const { fn: completeOnboardingFn, loading } = useFetch(completeOnboarding, {
    autoFetch: false,
  })

  const handleComplete = async () => {
    try {
      await completeOnboardingFn(
        {
          city: location.city,
          state: location.state,
          country: location.country,
        },
        selectedInterests,
      )

      toast.success("Welcome to Evix!");
      onComplete();
      router.refresh();
    } catch{
      toast.error("Failed to complete onboarding");
    }
  };

  const handleNext = () => {
    if(step === 1 && selectedInterests.length < 3) {
      toast.error("Please select at least 3 interests to continue.");
      return;
    }

    if(step === 2 && (!location.city || !location.state)) {
      toast.error("Please select both state and city to continue.");
      return;
    } 

    if (step < 2) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        if (loading) return;
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="mb-4">
            <Progress value={progress} className="h-1 max-w-[95%]" />
          </div>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            {step === 1 ? (
              <>
                <Heart className="h-6 w-6 text-purple-500" />
                What interests you?
              </>
            ) : (
              <>
                <MapPin className="h-6 w-6 text-purple-500" />
                Where are you located?
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Select at least 3 categories to personalize your experience"
              : "We'll show you events happening near you"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-100 p-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => toggleInterest(category.id)}
                    className={`p-4 rounded-lg cursor-pointer border-2 transition-all hover:scale-105 ${selectedInterests.includes(category.id)
                        ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                        : "border-border hover:border-purple-300"
                      }`}
                  >
                    <div className="text-2xl mb-2">{<category.icon />}</div>
                    <div className="text-sm font-medium">{category.label}</div>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    selectedInterests.length >= 3 ? "default" : "secondary"
                  }
                >
                  {selectedInterests.length} selected
                </Badge>
                {selectedInterests.length >= 3 && (
                  <span className="text-sm text-green-500">
                    ✓ Ready to continue
                  </span>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select
                    value={location.state}
                    onValueChange={(value) => {
                      setLocation({ ...location, state: value, city: "" });
                    }}
                  >
                    <SelectTrigger id="state" className="h-11 w-full cursor-pointer">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianStates.map((state) => (
                        <SelectItem key={state.isoCode} value={state.name} className="cursor-pointer">
                          {state.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Select
                    value={location.city}
                    onValueChange={(value) =>
                      setLocation({ ...location, city: value })
                    }
                    disabled={!location.state}
                  >
                    <SelectTrigger id="city" className="h-11 w-full cursor-pointer disabled:cursor-not-allowed" disabled={!location.state}>
                      <SelectValue
                        placeholder={
                          location.state ? "Select city" : "State first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.length > 0 ? (
                        cities.map((city) => (
                          <SelectItem key={city.name} value={city.name} className="cursor-pointer">
                            {city.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-cities" disabled>
                          No cities available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {location.city && location.state && (
                <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Your location</p>
                      <p className="text-sm text-muted-foreground">
                        {location.city}, {location.state}, {location.country}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <DialogFooter className="flex gap-3 pt-4">
          {step > 1 && (
            <Button 
              variant={"outline"}
              onClick={() => setStep(step-1)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}
          <Button className="flex-1 gap-2 disabled:cursor-not-allowed disabled:opacity-50" disabled={loading} onClick={handleNext}>
            {loading 
              ? "Completing..."
              : step === 2
                ? <>Complete Setup <ArrowRight className="h-4 w-4" /></>
                : <>Continue <ArrowRight className="h-4 w-4" /></>
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}