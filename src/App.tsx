import { useEffect, useMemo, useState } from 'react';
import { supabase } from './lib/supabase';
import { calc, CalcResult } from './lib/calc';
import { handleExport } from './utils/exportExcel';
import { RecordEntry } from './components/RecordEntry';
import { ReconciliationBoard } from './components/ReconciliationBoard';
import { AccountManager } from './components/AccountManager';

export type PaymentAccount = {
  id: string;
  name: string;
};

export type SettlementRecord = {
  id: string;
  account_id: string;
  total_income: number;
  ck_7: number;
  lh_2: number;
  expected_transfer: number;
  actual_paid: number;
  created_at: string;
};

function App() {
  const [accounts, setAccounts] = useState<PaymentAccount[]>([]);
  const [records, setRecords] = useState<SettlementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');

  const totalDue = useMemo(
    () => records.reduce((sum, item) => sum + item.expected_transfer, 0),
    [records]
  );
  const totalSent = useMemo(
    () => records.reduce((sum, item) => sum + item.actual_paid, 0),
    [records]
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: accountRows } = await supabase.from('payment_accounts').select('id,name').order('name');
      const { data: recordRows } = await supabase
        .from('settlement_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (accountRows) setAccounts(accountRows as PaymentAccount[]);
      if (recordRows) setRecords(recordRows as SettlementRecord[]);
      if (!selectedAccountId && accountRows?.length) {
        setSelectedAccountId((accountRows[0] as PaymentAccount).id);
      }
      setLoading(false);
    };

    load();
  }, [selectedAccountId]);

  const handleCreateRecord = async (amount: number, accountId: string) => {
    const result = calc(amount);
    const payload = {
      account_id: accountId,
      total_income: amount,
      ck_7: Number(result.ck),
      lh_2: Number(result.lh),
      expected_transfer: Number(result.due),
      actual_paid: 0,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from('settlement_records').insert(payload).select().single();
    if (error) {
      console.error(error);
      return;
    }
    setRecords(prev => [data as SettlementRecord, ...prev]);
  };

  const handleVerifyRecord = async (record: SettlementRecord) => {
    const { data, error } = await supabase
      .from('settlement_records')
      .update({ actual_paid: record.expected_transfer })
      .eq('id', record.id)
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }
    setRecords(prev => prev.map(item => (item.id === record.id ? (data as SettlementRecord) : item)));
  };

  const handleAddAccount = async (name: string) => {
    const { data, error } = await supabase.from('payment_accounts').insert({ name }).select().single();
    if (error) {
      console.error(error);
      return;
    }
    setAccounts(prev => [...prev, data as PaymentAccount]);
    setSelectedAccountId((data as PaymentAccount).id);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">极简金融对账</p>
          <h1 className="text-3xl font-bold text-slate-900">今日对账看板</h1>
          <p className="max-w-2xl text-slate-600">高对比、少元素，让你立刻看清当前待结算金额与核销状态。</p>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <RecordEntry
            accounts={accounts}
            selectedAccountId={selectedAccountId}
            onAccountChange={setSelectedAccountId}
            onSubmit={handleCreateRecord}
            loading={loading}
          />

          <div className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">实时结余</p>
              <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">待转总额</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">${totalDue.toFixed(2)}</p>
                </div>
                <div className="rounded-3xl bg-slate-900 px-4 py-3 text-right text-white">
                  <p className="text-xs text-slate-300">已实转</p>
                  <p className="mt-2 text-2xl font-bold">${totalSent.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <AccountManager onAddAccount={handleAddAccount} />
          </div>
        </div>

        <ReconciliationBoard
          records={records}
          accounts={accounts}
          totalDue={totalDue}
          totalSent={totalSent}
          onVerify={handleVerifyRecord}
          onExport={() => handleExport(records, accounts)}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default App;
