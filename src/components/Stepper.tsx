import { MinusIcon, PlusIcon } from './icons';

interface StepperProps {
  label: string;
  value: number;
  step: number;
  min: number;
  unit?: string;
  onChange: (next: number) => void;
}

export function Stepper({ label, value, step, min, unit, onChange }: StepperProps) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      <div className="stepper">
        <button
          type="button"
          className="stepper-btn"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(Math.max(min, value - step))}
        >
          <MinusIcon />
        </button>
        <div className="stepper-value">
          <span className="stepper-number">{value}</span>
          {unit && <span className="stepper-unit">{unit}</span>}
        </div>
        <button
          type="button"
          className="stepper-btn"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(value + step)}
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  );
}
