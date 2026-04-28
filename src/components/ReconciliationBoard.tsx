import { useState } from 'react';
import type { PaymentAccount, SettlementRecord } from '../App';

type Props = {
  records: SettlementRecord[];
  accounts: PaymentAccount[];
  totalDue: number;
  totalSent: number;
  onVerify: (record: SettlementRecord) => void;
  onUpdateActualPaid: (recordId: string, amount: number) => Promise<boolean>;
  onExport: () => void;
  onClearAll: () => void;
  loading: boolean;
};

export const ReconciliationBoard = ({
  records,
  accounts,
  totalDue,
  totalSent,
  onVerify,
  onUpdateActualPaid,
  onExport,
  onClearAll,
  loading,
}: Props) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  
  const isPending = totalDue > totalSent;
  const accountById = new Map(accounts.map((account) => [account.id, account.name]));

  const handleEditStart = (record: SettlementRecord) => {
    setEditingId(record.id);
    setEditValue(record.actual_paid.toString());
  };

  const handleEditSave = async (recordId: string, record: SettlementRecord) => {
    const newAmount = Number(editValue);
    if (isNaN(newAmount)) {
      alert('请输入有效的数字');
      return;
    }

    const success = await onUpdateActualPaid(recordId, newAmount);
    if (success) {
      setEditingId(null);
      setEditValue('');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  return (
    <section className="space-y-6">
      <div className={`rounded-[2rem] p-6 shadow-sm ${isPending ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}>
        <p className="text-xs uppercase opacity-80">{isPending ? '待结算' : '已结清'}</p>
        <p className="mt-3 text-4xl font-bold">${Math.abs(totalDue - totalSent).toFixed(2)}</p>
        <p className="mt-2 text-sm opacity-90">{isPending ? '当前还有款项待转出' : '当前已清算全部应转金额'}</p>
      </div>
      <div className="rounded-[2rem] border border-gray-100 bg-white p-4 text-sm text-slate-500 shadow-sm">
        <p>提示：点击“实转”金额可手动编辑，或使用“全额核销”一键设置为应转金额。</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">记录总数</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{records.length}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onExport}
            disabled={loading || records.length === 0}
            className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            导出今日对账单
          </button>
          <button
            type="button"
            onClick={onClearAll}
            disabled={loading || records.length === 0}
            className="inline-flex items-center justify-center rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            🗑️ 清空所有数据
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm">
        <div className="grid grid-cols-[1.2fr_0.9fr_1fr_0.8fr_1.5fr] gap-4 border-b border-gray-100 px-5 py-4 text-xs uppercase tracking-[0.2em] text-slate-500">
          <span>户口</span>
          <span>应转</span>
          <span>实转</span>
          <span>欠款</span>
          <span></span>
        </div>
        <div className="divide-y divide-gray-100">
          {records.map((record) => {
            const diff = record.expected_transfer - record.actual_paid;
            const isEditing = editingId === record.id;

            return (
              <div key={record.id} className="grid grid-cols-[1.2fr_0.9fr_1fr_0.8fr_1.5fr] gap-4 px-5 py-4 items-center text-sm text-slate-700">
                <span>{accountById.get(record.account_id) ?? '未知户口'}</span>
                <span className="font-medium">${record.expected_transfer.toFixed(2)}</span>
                
                {isEditing ? (
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="border border-slate-300 rounded-lg px-2 py-1 text-sm font-medium"
                    autoFocus
                    step="0.01"
                    min="0"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => handleEditStart(record)}
                    className="font-medium cursor-pointer rounded px-2 py-1 text-left text-slate-700 transition hover:bg-slate-50"
                  >
                    ${record.actual_paid.toFixed(2)}
                  </button>
                )}
                
                <span className={diff > 0 ? 'text-rose-600 font-semibold' : diff === 0 ? 'text-emerald-600 font-semibold' : 'text-orange-600 font-semibold'}>
                  {diff > 0 ? `欠 $${diff.toFixed(2)}` : diff === 0 ? '✓ 清' : `LEMON欠我 $${Math.abs(diff).toFixed(2)}`}
                </span>
                
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleEditSave(record.id, record)}
                        className="flex-1 rounded-lg bg-emerald-600 px-2 py-1 text-xs font-semibold text-white transition hover:bg-emerald-700"
                      >
                        ✓ 保存
                      </button>
                      <button
                        type="button"
                        onClick={handleEditCancel}
                        className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-semibold transition hover:bg-slate-100"
                      >
                        ✕ 取消
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleEditStart(record)}
                        className="flex-1 rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold transition hover:bg-slate-200"
                      >
                        ✎ 编辑
                      </button>
                      <button
                        type="button"
                        onClick={() => onVerify(record)}
                        disabled={record.actual_paid >= record.expected_transfer}
                        className="flex-1 rounded-lg bg-blue-600 px-2 py-1 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        ✓ 全额核销
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
          {records.length === 0 && (
            <div className="px-5 py-8 text-center text-slate-500">暂无对账记录，先新增一条收款记录吧。</div>
          )}
        </div>
      </div>
    </section>
  );
};
