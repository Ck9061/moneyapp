import { useState } from 'react';

type Props = {
  onAddAccount: (name: string) => void;
};

export const AccountManager = ({ onAddAccount }: Props) => {
  const [name, setName] = useState('');

  return (
    <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">户口管理</p>
      <div className="mt-4 space-y-4">
        <div>
          <label className="text-xs text-gray-400 block mb-1">新增收款户口</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:border-black"
            placeholder="ANZ - 4567"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            if (!name.trim()) return;
            onAddAccount(name.trim());
            setName('');
          }}
          className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          添加户口
        </button>
      </div>
    </div>
  );
};
