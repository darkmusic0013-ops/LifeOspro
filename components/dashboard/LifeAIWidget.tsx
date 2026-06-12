import { Brain, Mail, Sparkles, Youtube } from 'lucide-react';
import { Card } from '../ui/card';

const actions = [
  { label: 'Organiza mi día', icon: Brain },
  { label: 'Plan para YouTube', icon: Youtube },
  { label: 'Genera ideas virales', icon: Sparkles },
  { label: 'Redacta correo profesional', icon: Mail }
];

export function LifeAIWidget() {
  return (
    <Card>
      <span className="inline-flex rounded-full bg-[#EEEDFE] px-2.5 py-1 text-xs font-semibold text-[#534AB7]">Life AI</span>
      <h3 className="mt-3 text-sm font-semibold text-[#37352F]">¿Qué organizamos?</h3>
      <div className="mt-4 grid gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button key={action.label} className="flex h-9 items-center gap-2 rounded-lg border border-black/5 bg-white px-3 text-left text-[13px] font-semibold text-[#37352F] transition hover:bg-[#EEEDFE] hover:text-[#534AB7]">
              <Icon className="h-4 w-4" />
              {action.label}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
