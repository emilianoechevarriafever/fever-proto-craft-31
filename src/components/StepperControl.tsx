import { Minus, Plus } from "lucide-react";

interface StepperControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const StepperControl = ({ label, value, onChange, min = 0, max = 10 }: StepperControlProps) => {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="flex items-center justify-between py-4">
      <div>
        <div className="fever-body1 font-medium">{label}</div>
      </div>
      
      <div className="fever-stepper">
        <button
          className="fever-stepper-btn bg-white"
          onClick={handleDecrement}
          disabled={value <= min}
        >
          <Minus className="w-4 h-4 text-primary" />
        </button>
        
        <span className="text-base font-semibold px-4 min-w-8 text-center">
          {value}
        </span>
        
        <button
          className="fever-stepper-btn bg-primary text-white"
          onClick={handleIncrement}
          disabled={value >= max}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default StepperControl;