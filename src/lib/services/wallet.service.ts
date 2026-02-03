import { ApiService } from '../api/services/ApiService';
import type {
  WalletBalance,
  Transaction,
  TransactionsResponse,
} from '../types/api.types';

/**
 * Wallet API Service
 * Handles all wallet-related API requests
 */
export class WalletService extends ApiService {
  /**
   * Get wallet balance
   * @returns Promise<WalletBalance>
   */
  async getBalance(): Promise<WalletBalance | null> {
    return await this.get<WalletBalance>('/wallet');
  }

  /**
   * Get wallet transactions with pagination
   * @param page - Page number (default: 1)
   * @param pageSize - Number of items per page (default: 20)
   * @returns Promise<TransactionsResponse>
   */
  async getTransactions(page: number = 1, pageSize: number = 20): Promise<TransactionsResponse | null> {
    const queryParams: Record<string, string> = {
      page: String(page),
      pageSize: String(pageSize),
    };
    return await this.get<TransactionsResponse>('/wallet/transactions', queryParams);
  }

  /**
   * Get a single transaction by ID
   * @param transactionId - The transaction ID
   * @returns Promise<Transaction>
   */
  async getTransactionById(transactionId: string): Promise<Transaction | null> {
    return await this.get<Transaction>(`/wallet/transactions/${transactionId}`);
  }
}
