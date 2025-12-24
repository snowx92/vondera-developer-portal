'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Transaction {
  id: string;
  date: string;
  description: string;
  app: string;
  amount: number;
  type: 'revenue' | 'payout' | 'refund';
  status: 'completed' | 'pending' | 'failed';
}

interface BankAccount {
  accountHolder: string;
  bankCode: string;
  bankName: string;
  accountNumber: string;
}

const egyptianBanks = [
  { code: 'AUB', name: 'Ahli United Bank' },
  { code: 'MIDB', name: 'MIDBANK' },
  { code: 'BDC', name: 'Banque Du Caire' },
  { code: 'HSBC', name: 'HSBC Bank Egypt S.A.E' },
  { code: 'CAE', name: 'Credit Agricole Egypt S.A.E' },
  { code: 'EGB', name: 'Egyptian Gulf Bank' },
  { code: 'UB', name: 'The United Bank' },
  { code: 'QNB', name: 'Qatar National Bank Alahli' },
  { code: 'ARAB', name: 'Arab Bank PLC' },
  { code: 'ENBD', name: 'Emirates NBD' },
  { code: 'ABK', name: 'Al Ahli Bank of Kuwait – Egypt' },
  { code: 'NBK', name: 'National Bank of Kuwait – Egypt' },
  { code: 'ABC', name: 'Arab Banking Corporation - Egypt S.A.E' },
  { code: 'FAB', name: 'First Abu Dhabi Bank' },
  { code: 'ADIB', name: 'Abu Dhabi Islamic Bank – Egypt' },
  { code: 'CIB', name: 'Commercial International Bank - Egypt S.A.E' },
  { code: 'HDB', name: 'Housing And Development Bank' },
  { code: 'MISR', name: 'Banque Misr' },
  { code: 'AAIB', name: 'Arab African International Bank' },
  { code: 'EALB', name: 'Egyptian Arab Land Bank' },
  { code: 'EDBE', name: 'Export Development Bank of Egypt' },
  { code: 'FAIB', name: 'Faisal Islamic Bank of Egypt' },
  { code: 'BLOM', name: 'Blom Bank' },
  { code: 'ADCB', name: 'Abu Dhabi Commercial Bank – Egypt' },
  { code: 'BOA', name: 'Alex Bank Egypt' },
  { code: 'SAIB', name: 'Societe Arabe Internationale De Banque' },
  { code: 'NBE', name: 'National Bank of Egypt' },
  { code: 'ABRK', name: 'Al Baraka Bank Egypt B.S.C.' },
  { code: 'POST', name: 'Egypt Post' },
  { code: 'NSB', name: 'Nasser Social Bank' },
  { code: 'IDB', name: 'Industrial Development Bank' },
  { code: 'SCB', name: 'Suez Canal Bank' },
  { code: 'MASH', name: 'Mashreq Bank' },
  { code: 'AIB', name: 'Arab Investment Bank' },
  { code: 'GASC', name: 'General Authority For Supply Commodities' },
  { code: 'ARIB', name: 'Arab International Bank' },
  { code: 'PDAC', name: 'Agricultural Bank of Egypt' },
  { code: 'NBG', name: 'National Bank of Greece' },
  { code: 'CBE', name: 'Central Bank Of Egypt' },
  { code: 'BBE', name: 'ATTIJARIWAFA BANK Egypt' },
];

export default function WalletPage() {
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(8320);
  const [pendingBalance, setPendingBalance] = useState(1250);
  const [totalEarnings, setTotalEarnings] = useState(12450);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bankAccount, setBankAccount] = useState<BankAccount>({
    accountHolder: '',
    bankCode: '',
    bankName: '',
    accountNumber: '',
  });
  const [originalBankAccount, setOriginalBankAccount] = useState<BankAccount>({
    accountHolder: '',
    bankCode: '',
    bankName: '',
    accountNumber: '',
  });
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [bankSearch, setBankSearch] = useState('');
  const [autoPayoutEnabled, setAutoPayoutEnabled] = useState(true);
  const [minPayoutThreshold, setMinPayoutThreshold] = useState(1000);
  const [showPayoutDialog, setShowPayoutDialog] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [filter, setFilter] = useState<'all' | 'revenue' | 'payout' | 'refund'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // TODO: Load from API when available
      // For now, load mock data
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          date: '2024-12-20',
          description: 'Monthly revenue',
          app: 'Inventory Manager',
          amount: 1500,
          type: 'revenue',
          status: 'completed',
        },
        {
          id: '2',
          date: '2024-12-18',
          description: 'Monthly revenue',
          app: 'Shipping Calculator',
          amount: 850,
          type: 'revenue',
          status: 'completed',
        },
        {
          id: '3',
          date: '2024-12-15',
          description: 'Payout to bank account',
          app: 'All Apps',
          amount: -3500,
          type: 'payout',
          status: 'completed',
        },
        {
          id: '4',
          date: '2024-12-12',
          description: 'Refund issued',
          app: 'Inventory Manager',
          amount: -50,
          type: 'refund',
          status: 'completed',
        },
        {
          id: '5',
          date: '2024-12-10',
          description: 'Monthly revenue',
          app: 'Order Tracker',
          amount: 1200,
          type: 'revenue',
          status: 'completed',
        },
        {
          id: '6',
          date: '2024-12-08',
          description: 'Pending payout',
          app: 'All Apps',
          amount: -1250,
          type: 'payout',
          status: 'pending',
        },
      ];
      setTransactions(mockTransactions);

      // Load bank account from localStorage
      const savedBankAccount = localStorage.getItem('bank_account');
      if (savedBankAccount) {
        const parsedAccount = JSON.parse(savedBankAccount);
        setBankAccount(parsedAccount);
        setOriginalBankAccount(parsedAccount);
      }
    } catch (error) {
      console.error('Failed to load wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasChanges =
    bankAccount.accountHolder !== originalBankAccount.accountHolder ||
    bankAccount.bankCode !== originalBankAccount.bankCode ||
    bankAccount.bankName !== originalBankAccount.bankName ||
    bankAccount.accountNumber !== originalBankAccount.accountNumber;

  const filteredBanks = egyptianBanks.filter((bank) =>
    bank.name.toLowerCase().includes(bankSearch.toLowerCase()) ||
    bank.code.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const handleSaveBankAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    // Validation
    const newErrors: Record<string, string> = {};
    if (!bankAccount.accountHolder.trim()) newErrors.accountHolder = 'Account holder name is required';
    if (!bankAccount.bankCode.trim()) newErrors.bankCode = 'Bank selection is required';
    if (!bankAccount.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      // TODO: Save to API when available
      localStorage.setItem('bank_account', JSON.stringify(bankAccount));
      setOriginalBankAccount(bankAccount);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to save bank account',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async () => {
    const amount = parseFloat(payoutAmount);
    if (isNaN(amount) || amount <= 0) {
      setErrors({ payout: 'Please enter a valid amount' });
      return;
    }
    if (amount > balance) {
      setErrors({ payout: 'Insufficient balance' });
      return;
    }

    try {
      setLoading(true);
      // TODO: Call API to request payout
      // For now, just simulate
      setShowPayoutDialog(false);
      setPayoutAmount('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setErrors({
        payout: error instanceof Error ? error.message : 'Failed to request payout',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(
    (t) => filter === 'all' || t.type === filter
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Wallet & Payouts</h1>
        <p className="text-gray-600">Manage your earnings and payment settings</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Available Balance */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-100 text-sm font-medium">Available Balance</span>
            <svg className="w-8 h-8 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div className="text-4xl font-bold mb-2">
            {new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', minimumFractionDigits: 0 }).format(balance)}
          </div>
          <Button
            onClick={() => setShowPayoutDialog(true)}
            className="mt-4 bg-white text-green-600 hover:bg-green-50 hover:text-green-700 w-full border border-green-200"
          >
            Request Payout
          </Button>
        </div>

        {/* Pending Balance */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Pending Balance</span>
            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', minimumFractionDigits: 0 }).format(pendingBalance)}
          </div>
          <p className="text-sm text-gray-500 mt-2">Processing in 2-3 days</p>
        </div>

        {/* Total Earnings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Total Earnings</span>
            <svg className="w-8 h-8 text-vondera-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', minimumFractionDigits: 0 }).format(totalEarnings)}
          </div>
          <p className="text-sm text-gray-500 mt-2">All time</p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-green-700">Changes saved successfully!</p>
          </div>
        </div>
      )}

      {/* Payout Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Automatic Payout Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Enable Automatic Monthly Payouts</h3>
              <p className="text-sm text-gray-500">Automatically transfer earnings to your bank account each month</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoPayoutEnabled}
                onChange={(e) => setAutoPayoutEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-vondera-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vondera-purple"></div>
            </label>
          </div>

          {autoPayoutEnabled && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <Label htmlFor="threshold">Minimum Balance for Auto Payout</Label>
              <div className="mt-2 flex items-center gap-4">
                <Input
                  id="threshold"
                  type="number"
                  value={minPayoutThreshold}
                  onChange={(e) => setMinPayoutThreshold(parseInt(e.target.value))}
                  className="max-w-xs"
                />
                <span className="text-sm text-gray-600">EGP</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Payouts will be processed on the 1st of each month if your balance exceeds this amount
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bank Account Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bank Account Information</h2>
        <form onSubmit={handleSaveBankAccount} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="accountHolder">Account Holder Name *</Label>
              <Input
                id="accountHolder"
                type="text"
                value={bankAccount.accountHolder}
                onChange={(e) => setBankAccount({ ...bankAccount, accountHolder: e.target.value })}
                placeholder="John Doe"
              />
              {errors.accountHolder && (
                <p className="text-sm text-red-600 mt-1">{errors.accountHolder}</p>
              )}
            </div>

            <div className="relative">
              <Label htmlFor="bankCode">Bank Code *</Label>
              <button
                type="button"
                onClick={() => setShowBankDropdown(!showBankDropdown)}
                className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-vondera-purple focus:ring-offset-2 h-10 mt-2"
              >
                <span className="pointer-events-none">
                  {bankAccount.bankName || 'Select a bank'}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 opacity-50"
                >
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </button>

              {showBankDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                  <div className="p-2 border-b">
                    <Input
                      type="text"
                      placeholder="Search banks..."
                      value={bankSearch}
                      onChange={(e) => setBankSearch(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredBanks.map((bank) => (
                      <button
                        key={bank.code}
                        type="button"
                        onClick={() => {
                          setBankAccount({ ...bankAccount, bankCode: bank.code, bankName: bank.name });
                          setShowBankDropdown(false);
                          setBankSearch('');
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                      >
                        {bank.name}
                      </button>
                    ))}
                    {filteredBanks.length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-500">No banks found</div>
                    )}
                  </div>
                </div>
              )}

              {errors.bankCode && (
                <p className="text-sm text-red-600 mt-1">{errors.bankCode}</p>
              )}
            </div>

            <div>
              <Label htmlFor="accountNumber">Account Number *</Label>
              <Input
                id="accountNumber"
                type="text"
                value={bankAccount.accountNumber}
                onChange={(e) => setBankAccount({ ...bankAccount, accountNumber: e.target.value })}
                placeholder="1234567890"
              />
              {errors.accountNumber && (
                <p className="text-sm text-red-600 mt-1">{errors.accountNumber}</p>
              )}
            </div>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading || !hasChanges}
              className={hasChanges ? 'bg-vondera-purple hover:bg-vondera-purple-dark ring-2 ring-vondera-purple ring-offset-2' : ''}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Bank Account'
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-vondera-purple text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('revenue')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filter === 'revenue'
                  ? 'bg-vondera-purple text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Revenue
            </button>
            <button
              onClick={() => setFilter('payout')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filter === 'payout'
                  ? 'bg-vondera-purple text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Payouts
            </button>
            <button
              onClick={() => setFilter('refund')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filter === 'refund'
                  ? 'bg-vondera-purple text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Refunds
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Description</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">App</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {new Date(transaction.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {transaction.type === 'revenue' && (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                      )}
                      {transaction.type === 'payout' && (
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                      )}
                      {transaction.type === 'refund' && (
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3" />
                          </svg>
                        </div>
                      )}
                      <span className="text-sm text-gray-900">{transaction.description}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{transaction.app}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className={`py-4 px-4 text-right text-sm font-semibold ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}
                    {new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', minimumFractionDigits: 0 }).format(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Request Dialog */}
      {showPayoutDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Payout</h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="payoutAmount">Amount to withdraw</Label>
                <Input
                  id="payoutAmount"
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder="0.00"
                  className="mt-2"
                  max={balance}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Available: {new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', minimumFractionDigits: 0 }).format(balance)}
                </p>
              </div>

              {errors.payout && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">{errors.payout}</p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Funds will be transferred to your bank account ending in {bankAccount.accountNumber.slice(-4) || '****'} within 2-3 business days.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => {
                    setShowPayoutDialog(false);
                    setPayoutAmount('');
                    setErrors({});
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleRequestPayout}
                  disabled={loading}
                  className="flex-1 bg-vondera-purple hover:bg-vondera-purple-dark text-white"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Request Payout'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
