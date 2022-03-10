import { Client, ClientOptions, defaultOptions } from './client';
import {
  Account,
  CreateAccountOptions,
  MasterHD,
  Success,
  Wallet,
  WalletTX,
  WalletTXUnconfirmed,
} from './types';

const defaultWalletOptions = {
  ...defaultOptions,
  port: 14039,
};

export class WalletClient extends Client {
  constructor(options: ClientOptions = defaultWalletOptions) {
    super(options);
  }

  rescan(height: number) {
    return this.post<Success>('/rescan', { height });
  }

  resend() {
    return this.post<Success>('/resend');
  }

  backup(path: string) {
    return this.post<Success>(`/backup?path=${path}`);
  }

  getWallets() {
    return this.get<string[]>('/wallets');
  }

  getWallet(wallet: string) {
    return this.get<Wallet>(`/wallets/${wallet}`);
  }

  getMasterHD(wallet: string) {
    return this.get<MasterHD>(`/wallets/${wallet}/master`);
  }

  getAccounts(wallet: string) {
    return this.get<string[]>(`/wallets/${wallet}/accounts`);
  }

  getAccount(wallet: string, account: string) {
    return this.get<Account>(`/wallets/${wallet}/accounts/${account}`);
  }

  createAccount({ wallet, name, ...options }: CreateAccountOptions) {
    return this.put<Account>(`/wallets/${wallet}/accounts/${name}`, options);
  }

  getTx(wallet: string, hash: string) {
    return this.get<WalletTX>(`/wallets/${wallet}/tx/${hash}`);
  }

  deleteTx(wallet: string, hash: string) {
    return this.delete<Success>(`/wallets/${wallet}/tx/${hash}`);
  }

  getHistory(wallet: string) {
    return this.get<WalletTX[]>(`/wallets/${wallet}/tx/history`);
  }

  getPending(wallet: string) {
    return this.get<WalletTXUnconfirmed[]>(`/wallets/${wallet}/tx/unconfirmed`);
  }

  getRange(wallet: string, start: number, end: number) {
    return this.get<WalletTX[]>(
      `/wallets/${wallet}/tx/range?start=${start}&end=${end}`
    );
  }
}
