import { useState, useEffect } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useMixpanelAnalytics } from "@/hooks/use-mixpanel-analytics";
import feverLogo from "@/assets/fever-logo.png";

const prototypes = [
  {
    id: "baseline",
    name: "Bowling London",
    subtitle: "Fever Baseline"
  },
  {
    id: "barcelona",
    name: "Bowling Barcelona",
    subtitle: "All options in the main plan (Continuist Approach)"
  },
  {
    id: "madrid",
    name: "Bowling Madrid",
    subtitle: "Stepper embed in the main plan"
  },
  {
    id: "segovia",
    name: "Bowling Segovia",
    subtitle: "Stepper with a modal"
  },
  {
    id: "jaen",
    name: "Bowling Jaén",
    subtitle: "Sections can be expanded or collapsed with toggles"
  },
  {
    id: "cadiz",
    name: "Bowling Cádiz",
    subtitle: "First 2 questions embed in the main plan, the rest in another page"
  }
];

const Home = () => {
  const navigate = useNavigate();
  const { trackPrototypeSelected } = useMixpanelAnalytics();
  const [calendarType, setCalendarType] = useState<'big' | 'small'>('big');

  const handlePrototypeSelect = (prototypeId: string) => {
    trackPrototypeSelected(prototypeId);
    const calendarParam = calendarType === 'big' ? 'big-calendar' : 'small-calendar';
    navigate(`/prototype/${prototypeId}/${calendarParam}`);
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img
                src={feverLogo}
                alt="Fever"
                className="h-8 w-auto"
              />
              <h1 className="text-2xl font-bold text-gray-900">
                Game Centers
              </h1>
            </div>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Purchase flow prototypes for different booking experiences
            </p>
          </div>
        </div>
      </div>

      {/* Calendar Type Toggle */}
      <div className="max-w-2xl mx-auto px-6 py-4">
        <div className="flex justify-center">
          <div className="inline-flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setCalendarType('big')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                calendarType === 'big'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Big Calendar
            </button>
            <button
              onClick={() => setCalendarType('small')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                calendarType === 'small'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Small Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Prototypes Grid */}
      <div className="max-w-2xl mx-auto px-6 py-2">
        <div className="space-y-3">
          {prototypes.map((prototype) => (
            <Card 
              key={prototype.id}
              className="group hover:shadow-md transition-all duration-200 cursor-pointer border hover:border-primary/30"
              onClick={() => handlePrototypeSelect(prototype.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {prototype.name}
                    </h3>
                    <p className="text-sm text-gray-500 leading-tight">
                      {prototype.subtitle}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all ml-3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Analytics Link */}
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() => navigate('/analytics')}
            className="flex items-center gap-2 mx-auto"
          >
            Ver Analíticas
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home; 