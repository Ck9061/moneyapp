# 极简金融对账应用

一个专为 LEMON 业务设计的极简金融对账工具，采用 React + TypeScript + Tailwind CSS 构建。

## ✨ 功能特性

- **极简录入面板**：大面积留白，粗体数字，高对比度状态颜色
- **自动分配计算**：CK 7%、LH 2%、应转 91% 自动计算
- **实时对账看板**：一目了然显示待结算金额和核销状态
- **Excel 导出**：一键导出今日对账单
- **移动端优先**：响应式设计，随时随地对账
- **Supabase 集成**：云端数据存储和同步

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制 `.env.example` 为 `.env` 并填入你的 Supabase 配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动。

## 📊 数据库设计

### payment_accounts 表
```sql
CREATE TABLE payment_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL
);
```

### settlement_records 表
```sql
CREATE TABLE settlement_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES payment_accounts(id),
  total_income NUMERIC NOT NULL,
  ck_7 NUMERIC NOT NULL,
  lh_2 NUMERIC NOT NULL,
  expected_transfer NUMERIC NOT NULL,
  actual_paid NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🏗️ 项目结构

```
src/
├── components/
│   ├── RecordEntry.tsx       # 录入面板
│   ├── ReconciliationBoard.tsx # 对账看板
│   └── AccountManager.tsx    # 户口管理
├── lib/
│   ├── supabase.ts           # Supabase 客户端
│   └── calc.ts               # 计算逻辑
├── utils/
│   └── exportExcel.ts        # Excel 导出
├── App.tsx                   # 主应用
└── main.tsx                  # 入口文件
```

## 🎨 设计理念

- **极简主义**：去除冗余元素，专注核心数据
- **高对比度**：红色表示支出/欠款，绿色表示收入/已结算
- **大留白**：减少视觉干扰，提升专注度
- **移动优先**：适配手机端随时录入和查看

## 📝 使用说明

1. **添加收款户口**：在设置中添加你的收款账户
2. **录入收款记录**：输入 LEMON 总进账金额，系统自动计算分配
3. **查看对账状态**：实时显示待结算金额和已核销记录
4. **核销记录**：点击核销按钮确认已转出款项
5. **导出对账单**：一键导出 Excel 格式的对账单

## 🔧 技术栈

- **前端框架**：React 18 + TypeScript
- **样式**：Tailwind CSS
- **构建工具**：Vite
- **后端**：Supabase
- **数据导出**：xlsx

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

*"在忙碌的对账时，一眼看清核心数据。"*