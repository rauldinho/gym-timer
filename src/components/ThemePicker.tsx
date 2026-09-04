import { THEMES } from '../themes';
import { CloseIcon } from './icons';

interface ThemePickerProps {
  open: boolean;
  currentId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export function ThemePicker({ open, currentId, onSelect, onClose }: ThemePickerProps) {
  if (!open) return null;

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-header">
          <h3>Theme</h3>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <CloseIcon size={18} />
          </button>
        </div>
        <div className="theme-grid">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              type="button"
              className={`theme-tile ${theme.id === currentId ? 'is-active' : ''}`}
              style={{ background: theme.colors.surface, borderColor: theme.colors.border }}
              onClick={() => {
                onSelect(theme.id);
                onClose();
              }}
            >
              <span className="theme-tile-swatches">
                <span className="swatch" style={{ background: theme.colors.work }} />
                <span className="swatch" style={{ background: theme.colors.rest }} />
                <span className="swatch swatch-bg" style={{ background: theme.colors.bg }} />
              </span>
              <strong style={{ color: theme.colors.text }}>{theme.name}</strong>
              <span className="theme-tile-vibe" style={{ color: theme.colors.muted }}>
                {theme.vibe}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
