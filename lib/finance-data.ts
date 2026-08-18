import type {
  Account,
  Card,
  FinanceState,
  Institution,
  Subscription,
  Transaction,
} from './types'

function daysAgo(days: number, hour = 12, minute = 0): string {
  const d = new Date()
  d.setHours(hour, minute, 0, 0)
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

function daysFromNow(days: number): string {
  const d = new Date()
  d.setHours(9, 0, 0, 0)
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

export const institutions: Institution[] = [
  { id: 'hbl', name: 'HBL', short: 'HBL', kind: 'bank', color: 'oklch(0.5 0.13 150)' },
  {
    id: 'alfalah',
    name: 'Bank Alfalah',
    short: 'BAF',
    kind: 'bank',
    color: 'oklch(0.55 0.15 25)',
  },
  {
    id: 'meezan',
    name: 'Meezan Bank',
    short: 'MZN',
    kind: 'bank',
    color: 'oklch(0.5 0.09 200)',
  },
  {
    id: 'nayapay',
    name: 'NayaPay',
    short: 'NP',
    kind: 'wallet',
    color: 'oklch(0.55 0.16 300)',
  },
  {
    id: 'sadapay',
    name: 'SadaPay',
    short: 'SP',
    kind: 'wallet',
    color: 'oklch(0.62 0.14 165)',
  },
  {
    id: 'jazzcash',
    name: 'JazzCash',
    short: 'JC',
    kind: 'wallet',
    color: 'oklch(0.58 0.19 20)',
  },
]

const accounts: Account[] = [
  {
    id: 'acc_hbl',
    institutionId: 'hbl',
    nickname: 'Salary Account',
    type: 'current',
    last4: '4821',
    balance: 842300,
    available: 842300,
    currency: 'PKR',
    updatedAt: daysAgo(0, 8, 15),
  },
  {
    id: 'acc_meezan',
    institutionId: 'meezan',
    nickname: 'Savings',
    type: 'savings',
    last4: '9034',
    balance: 1250000,
    available: 1250000,
    currency: 'PKR',
    updatedAt: daysAgo(0, 8, 15),
  },
  {
    id: 'acc_alfalah',
    institutionId: 'alfalah',
    nickname: 'Household',
    type: 'current',
    last4: '5567',
    balance: 128400,
    available: 121900,
    currency: 'PKR',
    updatedAt: daysAgo(0, 7, 40),
  },
  {
    id: 'acc_nayapay',
    institutionId: 'nayapay',
    nickname: 'NayaPay Wallet',
    type: 'wallet',
    last4: '1180',
    balance: 18650,
    available: 18650,
    currency: 'PKR',
    updatedAt: daysAgo(0, 9, 5),
  },
  {
    id: 'acc_sadapay',
    institutionId: 'sadapay',
    nickname: 'SadaPay',
    type: 'wallet',
    last4: '7742',
    balance: 32100,
    available: 32100,
    currency: 'PKR',
    updatedAt: daysAgo(0, 9, 5),
  },
  {
    id: 'acc_jazzcash',
    institutionId: 'jazzcash',
    nickname: 'JazzCash',
    type: 'wallet',
    last4: '2093',
    balance: 6420,
    available: 6420,
    currency: 'PKR',
    updatedAt: daysAgo(1, 20, 10),
  },
]

const cards: Card[] = [
  {
    id: 'card_hbl',
    accountId: 'acc_hbl',
    network: 'Visa',
    last4: '4821',
    type: 'debit',
    frozen: false,
  },
  {
    id: 'card_alfalah',
    accountId: 'acc_alfalah',
    network: 'Mastercard',
    last4: '5567',
    type: 'debit',
    frozen: false,
  },
  {
    id: 'card_sadapay',
    accountId: 'acc_sadapay',
    network: 'Mastercard',
    last4: '7742',
    type: 'debit',
    frozen: false,
  },
  {
    id: 'card_meezan',
    accountId: 'acc_meezan',
    network: 'UnionPay',
    last4: '9034',
    type: 'debit',
    frozen: true,
  },
]

const transactions: Transaction[] = [
  // Income
  { id: 't1', accountId: 'acc_hbl', merchant: 'Systems Limited', description: 'Monthly salary', amount: 485000, direction: 'in', category: 'income', date: daysAgo(2, 9, 2) },
  { id: 't2', accountId: 'acc_meezan', merchant: 'Profit payout', description: 'Savings profit', amount: 8420, direction: 'in', category: 'income', date: daysAgo(3, 10, 0) },
  { id: 't3', accountId: 'acc_nayapay', merchant: 'Ali Raza', description: 'Freelance — logo design', amount: 45000, direction: 'in', category: 'income', date: daysAgo(6, 15, 20) },

  // Subscriptions
  { id: 't4', accountId: 'acc_sadapay', merchant: 'Netflix', amount: 1100, direction: 'out', category: 'subscriptions', date: daysAgo(1, 3, 0) },
  { id: 't5', accountId: 'acc_sadapay', merchant: 'Spotify', amount: 299, direction: 'out', category: 'subscriptions', date: daysAgo(4, 3, 0) },
  { id: 't6', accountId: 'acc_hbl', merchant: 'YouTube Premium', amount: 439, direction: 'out', category: 'subscriptions', date: daysAgo(8, 3, 0) },
  { id: 't7', accountId: 'acc_sadapay', merchant: 'ChatGPT Plus', description: 'OpenAI', amount: 5680, direction: 'out', category: 'subscriptions', date: daysAgo(11, 3, 0) },
  { id: 't8', accountId: 'acc_hbl', merchant: 'iCloud+', amount: 250, direction: 'out', category: 'subscriptions', date: daysAgo(12, 3, 0) },

  // Food
  { id: 't9', accountId: 'acc_nayapay', merchant: 'Foodpanda', description: 'Kolachi dinner', amount: 3450, direction: 'out', category: 'food', date: daysAgo(0, 21, 5) },
  { id: 't10', accountId: 'acc_sadapay', merchant: 'KFC', amount: 1890, direction: 'out', category: 'food', date: daysAgo(1, 14, 30) },
  { id: 't11', accountId: 'acc_nayapay', merchant: 'Broadway Pizza', amount: 2650, direction: 'out', category: 'food', date: daysAgo(3, 20, 15) },
  { id: 't12', accountId: 'acc_alfalah', merchant: 'Al-Baik', amount: 1420, direction: 'out', category: 'food', date: daysAgo(5, 13, 40) },
  { id: 't13', accountId: 'acc_sadapay', merchant: 'Chai Wala', amount: 320, direction: 'out', category: 'food', date: daysAgo(0, 17, 10) },
  { id: 't14', accountId: 'acc_nayapay', merchant: 'Cheetay Grocery', amount: 6740, direction: 'out', category: 'food', date: daysAgo(7, 11, 0) },

  // Shopping
  { id: 't15', accountId: 'acc_hbl', merchant: 'Daraz', description: 'Anker power bank', amount: 8990, direction: 'out', category: 'shopping', date: daysAgo(2, 16, 45) },
  { id: 't16', accountId: 'acc_alfalah', merchant: 'Khaadi', amount: 12400, direction: 'out', category: 'shopping', date: daysAgo(9, 18, 20) },
  { id: 't17', accountId: 'acc_sadapay', merchant: 'Sapphire', amount: 7850, direction: 'out', category: 'shopping', date: daysAgo(14, 15, 0) },

  // Bills
  { id: 't18', accountId: 'acc_hbl', merchant: 'K-Electric', description: 'Electricity bill', amount: 18650, direction: 'out', category: 'bills', date: daysAgo(4, 10, 30) },
  { id: 't19', accountId: 'acc_hbl', merchant: 'SSGC', description: 'Gas bill', amount: 4230, direction: 'out', category: 'bills', date: daysAgo(4, 10, 32) },
  { id: 't20', accountId: 'acc_alfalah', merchant: 'PTCL Fibre', description: 'Internet', amount: 5499, direction: 'out', category: 'bills', date: daysAgo(6, 9, 15) },
  { id: 't21', accountId: 'acc_sadapay', merchant: 'Jazz Load', description: 'Mobile top-up', amount: 1000, direction: 'out', category: 'bills', date: daysAgo(10, 12, 0) },

  // Transport
  { id: 't22', accountId: 'acc_nayapay', merchant: 'Careem', amount: 780, direction: 'out', category: 'transport', date: daysAgo(0, 9, 25) },
  { id: 't23', accountId: 'acc_sadapay', merchant: 'InDrive', amount: 620, direction: 'out', category: 'transport', date: daysAgo(1, 19, 0) },
  { id: 't24', accountId: 'acc_hbl', merchant: 'PSO', description: 'Fuel', amount: 9000, direction: 'out', category: 'transport', date: daysAgo(5, 8, 50) },
  { id: 't25', accountId: 'acc_nayapay', merchant: 'Careem', amount: 540, direction: 'out', category: 'transport', date: daysAgo(8, 22, 10) },

  // Health
  { id: 't26', accountId: 'acc_alfalah', merchant: 'Servaid Pharmacy', amount: 2340, direction: 'out', category: 'health', date: daysAgo(7, 17, 30) },
  { id: 't27', accountId: 'acc_hbl', merchant: 'Aga Khan Lab', description: 'Blood tests', amount: 6800, direction: 'out', category: 'health', date: daysAgo(13, 11, 20) },

  // Transfers
  { id: 't28', accountId: 'acc_hbl', merchant: 'Meezan Savings', description: 'Moved to savings', amount: 150000, direction: 'out', category: 'transfer', date: daysAgo(2, 9, 30), counterpartAccountId: 'acc_meezan' },
  { id: 't29', accountId: 'acc_meezan', merchant: 'HBL Salary Account', description: 'Received from HBL', amount: 150000, direction: 'in', category: 'transfer', date: daysAgo(2, 9, 30), counterpartAccountId: 'acc_hbl' },
  { id: 't30', accountId: 'acc_hbl', merchant: 'SadaPay', description: 'Wallet top-up', amount: 25000, direction: 'out', category: 'transfer', date: daysAgo(3, 11, 0), counterpartAccountId: 'acc_sadapay' },
  { id: 't31', accountId: 'acc_sadapay', merchant: 'HBL Salary Account', description: 'Received from HBL', amount: 25000, direction: 'in', category: 'transfer', date: daysAgo(3, 11, 0), counterpartAccountId: 'acc_hbl' },
  { id: 't32', accountId: 'acc_nayapay', merchant: 'Ahmed (brother)', description: 'Split dinner', amount: 1725, direction: 'out', category: 'transfer', date: daysAgo(0, 21, 30) },

  // Other
  { id: 't33', accountId: 'acc_jazzcash', merchant: 'Edhi Foundation', description: 'Donation', amount: 5000, direction: 'out', category: 'other', date: daysAgo(9, 13, 0) },
]

const subscriptions: Subscription[] = [
  { id: 'sub1', name: 'Netflix', accountId: 'acc_sadapay', amount: 1100, cycle: 'monthly', nextBilling: daysFromNow(6), category: 'subscriptions' },
  { id: 'sub2', name: 'Spotify', accountId: 'acc_sadapay', amount: 299, cycle: 'monthly', nextBilling: daysFromNow(3), category: 'subscriptions' },
  { id: 'sub3', name: 'YouTube Premium', accountId: 'acc_hbl', amount: 439, cycle: 'monthly', nextBilling: daysFromNow(12), category: 'subscriptions' },
  { id: 'sub4', name: 'ChatGPT Plus', accountId: 'acc_sadapay', amount: 5680, cycle: 'monthly', nextBilling: daysFromNow(9), category: 'subscriptions' },
  { id: 'sub5', name: 'iCloud+ 200GB', accountId: 'acc_hbl', amount: 250, cycle: 'monthly', nextBilling: daysFromNow(15), category: 'subscriptions' },
  { id: 'sub6', name: 'Shapes Gym', accountId: 'acc_alfalah', amount: 9000, cycle: 'monthly', nextBilling: daysFromNow(2), category: 'health' },
]

export function getSeedState(): FinanceState {
  return {
    accounts: accounts.map((a) => ({ ...a })),
    cards: cards.map((c) => ({ ...c })),
    transactions: transactions.map((t) => ({ ...t })),
    subscriptions: subscriptions.map((s) => ({ ...s })),
  }
}

export function getInstitution(id: string): Institution {
  return institutions.find((i) => i.id === id) ?? institutions[0]
}
