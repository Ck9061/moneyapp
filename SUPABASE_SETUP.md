# Supabase 数据库设置指南

## 🔧 数据库初始化

如果你看到「还没有户口」或者添加户口后没有显示，**最可能的原因是 Supabase 中的表格还没有创建**。

### 方案 A：使用 Supabase UI 创建表格

1. **打开 Supabase 控制台**：https://app.supabase.com
2. **登录你的项目**：选择项目 `mewivpocoytdjemcwjus`
3. **点击左侧 SQL Editor**
4. **新建 Query**，复制下面的 SQL 执行

### 方案 B：执行 SQL 脚本

在 Supabase SQL Editor 中执行以下 SQL 语句：

```sql
-- 创建 payment_accounts 表 (收款户口)
CREATE TABLE IF NOT EXISTS payment_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建 settlement_records 表 (对账记录)
CREATE TABLE IF NOT EXISTS settlement_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES payment_accounts(id) ON DELETE CASCADE,
  total_income NUMERIC NOT NULL,
  ck_7 NUMERIC NOT NULL,
  lh_2 NUMERIC NOT NULL,
  expected_transfer NUMERIC NOT NULL,
  actual_paid NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX idx_settlement_records_account_id ON settlement_records(account_id);
CREATE INDEX idx_settlement_records_created_at ON settlement_records(created_at DESC);
```

### 方案 C：启用行级安全 (RLS) - 可选但推荐

如果你想安全性更高，可以启用 RLS：

```sql
-- 启用 RLS
ALTER TABLE payment_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlement_records ENABLE ROW LEVEL SECURITY;

-- 允许匿名用户读写
CREATE POLICY "Allow anonymous users to read and write payment_accounts" ON payment_accounts
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous users to read and write settlement_records" ON settlement_records
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

## ✅ 验证表格创建成功

1. 在 Supabase 左侧导航栏，选择 **Table Editor**
2. 你应该看到两个新表：
   - `payment_accounts` ✅
   - `settlement_records` ✅

## 🧪 测试数据库连接

1. **打开应用**：http://localhost:5173
2. **打开浏览器开发者工具**：F12 → Console
3. **添加一个户口**：在右侧「户口管理」中输入 `ANZ - 4567` 并点击添加
4. **检查控制台输出**：
   - ✅ 如果看到 `✅ 户口添加成功`，说明连接正常
   - ❌ 如果看到 `❌ 添加户口失败`，检查错误信息

## 🔍 常见问题排查

### 问题：添加户口后仍然不显示

**解决方案**：
1. **刷新页面**：按 Ctrl+R 或 Cmd+R
2. **检查 Supabase 网站**：https://app.supabase.com → Table Editor，确认数据是否已保存
3. **检查浏览器控制台**：F12 → Console，查看是否有错误信息

### 问题：看到 CORS 或网络错误

**解决方案**：
1. 检查 `.env` 文件中的 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY` 是否正确
2. 确保 Supabase 项目的 API 密钥有效（没有过期）
3. 在 Supabase 控制台检查 **Authentication** → **Policies** 是否允许公开访问

### 问题：看到「权限被拒绝」错误

**解决方案**：
1. 在 Supabase 中启用 RLS（见上面的 SQL 脚本）
2. 或者在 Table Editor 中，点击表格 → **Auth** → 关闭 RLS（仅限开发环境）

## 📋 完整流程

```
1. 执行上面的 SQL 脚本创建表格
     ↓
2. 刷新应用 (http://localhost:5173)
     ↓
3. 在「户口管理」中添加一个户口
     ↓
4. 户口应该立即显示在「收款户口」下拉框中
     ↓
5. 输入金额，点击「确认入账」
     ↓
6. 记录应该出现在下方的对账看板
```

## 🚀 后续步骤

一旦表格创建成功，你就可以：
- 🏦 添加多个收款户口
- 💰 记录每笔收款金额
- 📊 自动计算分配比例
- ✅ 核销已转出的款项
- 📥 导出 Excel 对账单

## 📞 需要帮助？

如果问题仍未解决：
1. 检查 `.env` 文件中的 Supabase 凭证
2. 打开浏览器开发者工具 (F12)，查看 Network 标签中是否有 API 请求
3. 在 Supabase 网站检查 API Logs 是否有错误
