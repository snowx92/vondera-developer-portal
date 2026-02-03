'use client';

import { useState, useEffect } from 'react';
import { walletService } from '@/lib/services';
import type { WalletBalance, Transaction } from '@/lib/types/api.types';

export default function WalletPage() {
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showPayoutDialog, setShowPayoutDialog] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutError, setPayoutError] = useState<string | null>(null);
  const [processingPayout, setProcessingPayout] = useState(false);
  const pageSize = 20;

  useEffect(() => {
    loadBalance();
  }, []);

  useEffect(() => {
    loadTransactions(currentPage);
  }, [currentPage]);

  const loadBalance = async () => {
    try {
      setLoadingBalance(true);
      setError(null);
      const data = await walletService.getBalance();
      if (data) {
        setBalance(data);
      }
    } catch (err) {
      console.error('Failed to load balance:', err);
      setError(err instanceof Error ? err.message : 'Failed to load balance');
    } finally {
      setLoadingBalance(false);
    }
  };

  const loadTransactions = async (page: number) => {
    try {
      setLoadingTransactions(true);
      setError(null);
      const data = await walletService.getTransactions(page, pageSize);
      if (data) {
        setTransactions(data.items);
        setTotalPages(data.totalPages);
        setTotalItems(data.totalItems);
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    } finally {
      setLoadingTransactions(false);
    }
  };

  const loadTransactionDetails = async (transactionId: string) => {
    try {
      const data = await walletService.getTransactionById(transactionId);
      if (data) {
        setSelectedTransaction(data);
      }
    } catch (err) {
      console.error('Failed to load transaction details:', err);
    }
  };

  const handleRequestPayout = async () => {
    const amount = parseFloat(payoutAmount);
    if (isNaN(amount) || amount <= 0) {
      setPayoutError('Please enter a valid amount');
      return;
    }
    if (amount > (balance?.balance || 0)) {
      setPayoutError('Insufficient balance');
      return;
    }

    try {
      setProcessingPayout(true);
      // TODO: Call API to request payout when available
      // await walletService.requestPayout(amount);
      setShowPayoutDialog(false);
      setPayoutAmount('');
      setPayoutError(null);
      // Refresh balance
      await loadBalance();
    } catch (err) {
      setPayoutError(err instanceof Error ? err.message : 'Failed to request payout');
    } finally {
      setProcessingPayout(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'EGP') => {
    return new Intl.NumberFormat('en-EG', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (timestamp: { _seconds: number }) => {
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'PURCHASE':
        return 'text-green-600 bg-green-100';
      case 'REFUND':
        return 'text-red-600 bg-red-100';
      case 'WITHDRAWAL':
        return 'text-blue-600 bg-blue-100';
      case 'ADJUSTMENT':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-100';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'FAILED':
        return 'text-red-600 bg-red-100';
      case 'CANCELLED':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Wallet</h1>
        <p className="text-gray-600">Manage your earnings and transactions</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Balance Cards - Google Play Console Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Available Balance */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm font-medium">Available Balance</span>
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          {loadingBalance ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-vondera-purple"></div>
          ) : (
            <>
              <div className="text-3xl font-bold text-gray-900 mb-4">
                {balance ? formatCurrency(balance.balance, balance.currency) : 'EGP 0'}
              </div>
              <button
                onClick={() => setShowPayoutDialog(true)}
                className="w-full bg-vondera-purple hover:bg-vondera-purple-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Request Payout
              </button>
            </>
          )}
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
            {formatCurrency(0, balance?.currency || 'EGP')}
          </div>
          <p className="text-sm text-gray-500 mt-2">Processing</p>
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
            {balance ? formatCurrency(balance.balance, balance.currency) : 'EGP 0'}
          </div>
          <p className="text-sm text-gray-500 mt-2">All time</p>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
            <p className="text-sm text-gray-500">
              {totalItems} {totalItems === 1 ? 'transaction' : 'transactions'}
            </p>
          </div>
        </div>

        {loadingTransactions ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vondera-purple"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No transactions yet</h3>
            <p className="text-gray-500">Your transaction history will appear here</p>
          </div>
        ) : (
          <>
            {/* Transactions Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      App
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{transaction.appName}</div>
                        <div className="text-xs text-gray-500">{transaction.appId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTransactionTypeColor(transaction.type)}`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => loadTransactionDetails(transaction.id)}
                          className="text-vondera-purple hover:text-vondera-purple-dark font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSelectedTransaction(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                    <p className="text-sm text-gray-900 font-mono">{selectedTransaction.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="text-sm text-gray-900">{formatDate(selectedTransaction.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">App Name</p>
                    <p className="text-sm text-gray-900">{selectedTransaction.appName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">App ID</p>
                    <p className="text-sm text-gray-900 font-mono">{selectedTransaction.appId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Store ID</p>
                    <p className="text-sm text-gray-900 font-mono">{selectedTransaction.storeId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Type</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTransactionTypeColor(selectedTransaction.type)}`}>
                      {selectedTransaction.type}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Amount</p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedTransaction.status)}`}>
                      {selectedTransaction.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Purchase ID</p>
                    <p className="text-sm text-gray-900 font-mono">{selectedTransaction.purchaseId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Payment Transaction ID</p>
                    <p className="text-sm text-gray-900 font-mono">{selectedTransaction.paymentTransactionId}</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Payout Request Dialog */}
      {showPayoutDialog && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => {
              setShowPayoutDialog(false);
              setPayoutAmount('');
              setPayoutError(null);
            }}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Request Payout</h3>
              </div>

              <div className="px-6 py-4 space-y-4">
                <div>
                  <label htmlFor="payoutAmount" className="block text-sm font-medium text-gray-700 mb-2">
                    Amount to withdraw
                  </label>
                  <input
                    id="payoutAmount"
                    type="number"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vondera-purple focus:border-transparent"
                    max={balance?.balance || 0}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Available: {balance ? formatCurrency(balance.balance, balance.currency) : 'EGP 0'}
                  </p>
                </div>

                {payoutError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-700">{payoutError}</p>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Funds will be transferred to your bank account within 2-3 business days.
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPayoutDialog(false);
                    setPayoutAmount('');
                    setPayoutError(null);
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleRequestPayout}
                  disabled={processingPayout}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-vondera-purple rounded-lg hover:bg-vondera-purple-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processingPayout ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Request Payout'
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
