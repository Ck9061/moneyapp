import { useMemo, useState } from 'react';
import type { PaymentAccount } from '../App';
import { calc } from '../lib/calc';

type RecordEntryProps = {
  accounts: PaymentAccount[];
  selectedAccountId: string;
  onAccountChange: (id: string) => void;
  onSubmit: (amount: number, accountId: string) => void;
  loading: boolean;
};

export const RecordEntry = ({
  accounts,
  selectedAccountId,
  onAccountChange,
  onSubmit,
  loading,
}: RecordEntryProps) => {
  const [amount, setAmount] = useState(0);
  const preview = useMemo(() => calc(amount), [amount]);

  return (
    <div className="max-w-md mx-auto rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm sm:max-w-full">
      <h2 className="text-gray-400 text-sm font-medium mb-6">新增收款记录</h2>
      <div className="space-y-6">
        <div>
          <label className="text-xs text-gray-400 block mb-1">收款户口</label>
          <select
            value={selectedAccountId}
            onChange={(e) => onAccountChange(e.target.value)}
            className="w-full border-b border-gray-200 bg-transparent py-2 text-base focus:outline-none focus:border-black transition-colors"
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-400 block mb-1">LEMON 总进账 (AUD)</label>
          <input
            type="number"
            value={amount || ''}
            onChange={(e) => setAmount(Number(e.target.value) || 0)}
            placeholder="0.00"
            className="w-full text-3xl font-semibold border-b border-gray-200 bg-transparent py-2 focus:outline-none focus:border-black"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-[10px] text-gray-400 uppercase">CK (7%)</p>
            <p className="text-lg font-medium text-blue-600">${preview.ck}</p>
          </div>
          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-[10px] text-gray-400 uppercase">LH (2%)</p>
            <p className="text-lg font-medium text-green-600">${preview.lh}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-black p-4 text-white">
          <p className="text-[10px] uppercase opacity-60">应转出金额 (91%)</p>
          <p className="text-2xl font-bold">${preview.due}</p>
        </div>

        <button
          type="button"
          disabled={loading || !selectedAccountId || amount <= 0}
          onClick={() => onSubmit(amount, selectedAccountId)}
          className="w-full rounded-2xl bg-gray-100 py-4 text-base font-semibold transition-all hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          确认入账
        </button>
      </div>
    </div>
  );
};
