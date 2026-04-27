import type { PaymentAccount, SettlementRecord } from '../App';

type Props = {
  records: SettlementRecord[];
  accounts: PaymentAccount[];
  totalDue: number;
  totalSent: number;
  onVerify: (record: SettlementRecord) => void;
  onExport: () => void;
  loading: boolean;
};

export const ReconciliationBoard = ({
  records,
  accounts,
  totalDue,
  totalSent,
  onVerify,
  onExport,
  loading,
}: Props) => {
  const isPending = totalDue > totalSent;
  const accountById = new Map(accounts.map((account) => [account.id, account.name]));

  return (
    <section className="space-y-6">
      <div className={`rounded-[2rem] p-6 shadow-sm ${isPending ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}>
        <p className="text-xs uppercase opacity-80">{isPending ? '待结算' : '已结清'}</p>
        <p className="mt-3 text-4xl font-bold">${Math.abs(totalDue - totalSent).toFixed(2)}</p>
        <p className="mt-2 text-sm opacity-90">{isPending ? '当前还有款项待转出' : '当前已清算全部应转金额'}</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">记录总数</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{records.length}</p>
        </div>
        <button
          type="button"
          onClick={onExport}
          disabled={loading || records.length === 0}
          className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          导出今日对账单
        </button>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm">
        <div className="grid grid-cols-[1.2fr_0.9fr_0.8fr_0.8fr_0.8fr] gap-4 border-b border-gray-100 px-5 py-4 text-xs uppercase tracking-[0.2em] text-slate-500">
          <span>户口</span>
          <span>应转</span>
          <span>实转</span>
          <span>欠款</span>
          <span></span>
        </div>
        <div className="divide-y divide-gray-100">
          {records.map((record) => {
            const diff = record.expected_transfer - record.actual_paid;
            return (
              <div key={record.id} className="grid grid-cols-[1.2fr_0.9fr_0.8fr_0.8fr_0.8fr] gap-4 px-5 py-4 items-center text-sm text-slate-700">
                <span>{accountById.get(record.account_id) ?? '未知户口'}</span>
                <span>${record.expected_transfer.toFixed(2)}</span>
                <span>${record.actual_paid.toFixed(2)}</span>
                <span className={diff > 0 ? 'text-rose-600' : 'text-emerald-600'}>${diff.toFixed(2)}</span>
                <button
                  type="button"
                  onClick={() => onVerify(record)}
                  disabled={record.actual_paid >= record.expected_transfer}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  核销
                </button>
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
