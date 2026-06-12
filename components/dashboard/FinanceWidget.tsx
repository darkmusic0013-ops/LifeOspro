import type { FinanceState } from '../../types/lifeos';
import { Card } from '../ui/card';

interface FinanceWidgetProps {
  finance: FinanceState;
}

const formatMoney = (value: number) => `RD$${value.toLocaleString()}`;

export function FinanceWidget({ finance }: FinanceWidgetProps) {
  const totalExpenses = finance.expenses.filter((expense) => expense.type === 'Gasto').reduce((sum, expense) => sum + expense.amount, 0);
  const available = finance.salary - totalExpenses;
  const savingPercent = finance.salary > 0 ? Math.max(0, Math.min(100, Math.round((available / finance.salary) * 100))) : 0;

  return (
    <Card>
      <h3 className="mb-4 text-sm font-semibold text-[#37352F]">Finanzas mensuales</h3>
      <div className="divide-y divide-black/5">
        <div className="flex items-center justify-between py-3 text-sm">
          <span className="text-[#4D8870]">Salario</span>
          <strong className="font-semibold text-[#37352F]">{formatMoney(finance.salary)}</strong>
        </div>
        <div className="flex items-center justify-between py-3 text-sm">
          <span className="text-[#C4554D]">Gastos</span>
          <strong className="font-semibold text-[#C4554D]">{formatMoney(totalExpenses)}</strong>
        </div>
        <div className="flex items-center justify-between py-3 text-sm">
          <span className="font-semibold text-[#4D8870]">Disponible</span>
          <strong className="font-bold text-[#4D8870]">{formatMoney(available)}</strong>
        </div>
      </div>
      <div className="mt-4 border-t border-black/5 pt-4">
        <div className="mb-2 flex items-center justify-between text-sm font-semibold text-[#534AB7]">
          <span>Ahorro</span>
          <span>{savingPercent}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[#F1F1EF]">
          <div className="h-full rounded-full bg-[#7F77DD] transition-all duration-300" style={{ width: `${savingPercent}%` }} />
        </div>
      </div>
    </Card>
  );
}
