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
      try {
        const { data: accountRows, error: accountError } = await supabase
          .from('payment_accounts')
          .select('id,name')
          .order('name');
        
        if (accountError) {
          console.error('❌ 加载户口失败:', accountError);
          alert(`加载户口失败: ${accountError.message}\n\n请确保在 Supabase 中创建了 payment_accounts 表`);
        } else {
          if (accountRows) {
            console.log('✅ 加载成功，户口数:', accountRows.length, accountRows);
            setAccounts(accountRows as PaymentAccount[]);
            if (!selectedAccountId && accountRows.length > 0) {
              setSelectedAccountId((accountRows[0] as PaymentAccount).id);
            }
          }
        }

        const { data: recordRows, error: recordError } = await supabase
          .from('settlement_records')
          .select('*')
          .order('created_at', { ascending: false });

        if (recordError) {
          console.error('❌ 加载对账记录失败:', recordError);
        } else {
          if (recordRows) {
            console.log('✅ 加载对账记录成功，记录数:', recordRows.length);
            setRecords(recordRows as SettlementRecord[]);
          }
        }
      } catch (err) {
        console.error('❌ 数据加载异常:', err);
        alert('数据加载失败，请检查浏览器控制台');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

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
      console.error('❌ 核销失败:', error);
      alert(`核销失败: ${error.message}`);
      return;
    }
    console.log('✅ 核销成功');
    setRecords(prev => prev.map(item => (item.id === record.id ? (data as SettlementRecord) : item)));
  };

  const handleUpdateActualPaid = async (recordId: string, newAmount: number) => {
    if (newAmount < 0) {
      alert('实转金额不能为负数');
      return;
    }

    const record = records.find(r => r.id === recordId);
    if (!record) return;

    if (newAmount > record.expected_transfer) {
      alert(`实转金额不能超过应转金额 $${record.expected_transfer.toFixed(2)}`);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('settlement_records')
        .update({ actual_paid: newAmount })
        .eq('id', recordId)
        .select()
        .single();

      if (error) {
        console.error('❌ 更新实转金额失败:', error);
        alert(`更新失败: ${error.message}`);
        return;
      }
      console.log('✅ 实转金额已更新:', newAmount);
      setRecords(prev => prev.map(item => (item.id === recordId ? (data as SettlementRecord) : item)));
    } catch (err) {
      console.error('❌ 异常:', err);
      alert(`更新出错: ${err}`);
    }
  };

  const handleAddAccount = async (name: string) => {
    try {
      const { data, error } = await supabase.from('payment_accounts').insert({ name }).select().single();
      if (error) {
        console.error('❌ 添加户口失败:', error);
        alert(`添加户口失败: ${error.message}`);
        return;
      }
      console.log('✅ 户口添加成功:', data);
      // 添加到本地状态
      setAccounts(prev => [...prev, data as PaymentAccount]);
      setSelectedAccountId((data as PaymentAccount).id);
      alert(`✅ 户口 "${name}" 添加成功！`);
    } catch (err) {
      console.error('❌ 异常:', err);
      alert(`添加户口出错: ${err}`);
    }
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
          onUpdateActualPaid={handleUpdateActualPaid}
          onExport={() => handleExport(records, accounts)}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default App;
