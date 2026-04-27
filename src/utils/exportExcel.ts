import { utils, writeFile } from 'xlsx';
import type { PaymentAccount, SettlementRecord } from '../App';

export const handleExport = (records: SettlementRecord[], accounts: PaymentAccount[]) => {
  const accountMap = new Map(accounts.map((account) => [account.id, account.name]));

  const exportData = records.map((item) => ({
    日期: new Date(item.created_at).toLocaleDateString(),
    收款户口: accountMap.get(item.account_id) ?? '未知户口',
    '总进账': item.total_income,
    'CK (7%)': item.ck_7,
    'LH (2%)': item.lh_2,
    '应转': item.expected_transfer,
    '实转': item.actual_paid,
    '欠款状态': item.expected_transfer - item.actual_paid,
  }));

  const ws = utils.json_to_sheet(exportData);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Daily_Report');
  writeFile(wb, `LEMON_对账单_${new Date().toISOString().slice(0, 10)}.xlsx`);
};
