interface SegmentedControlProps {
  options: { label: string; value: string; subtitle?: string }[];
  value: string;
  onChange: (value: string) => void;
}

const SegmentedControl = ({ options, value, onChange }: SegmentedControlProps) => {
  return (
    <div className="fever-segmented-control">
      {options.map((option) => (
        <button
          key={option.value}
          className={`fever-segment ${
            value === option.value ? "fever-segment-active" : "text-muted-foreground"
          }`}
          onClick={() => onChange(option.value)}
        >
          <div className="text-center">
            <div className="font-medium">{option.label}</div>
            {option.subtitle && (
              <div className="text-xs opacity-70 mt-0.5">{option.subtitle}</div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;