import { CheckIcon } from './icons';

interface DoneScreenProps {
  onRestart: () => void;
}

export function DoneScreen({ onRestart }: DoneScreenProps) {
  return (
    <div className="screen done-screen">
      <div className="done-check">
        <CheckIcon size={72} />
      </div>
      <h2>Workout complete</h2>
      <p className="subtitle">Nice work — go hydrate.</p>
      <button type="button" className="btn btn-primary" onClick={onRestart}>
        New workout
      </button>
    </div>
  );
}
