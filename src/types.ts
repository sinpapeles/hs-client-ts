type DateStr = string; // "2018-06-08T03:05:54Z"

type NetworkType = 'main' | 'testnet' | 'regtest';

type WalletMaster = Pick<MasterHDPlain, 'encrypted'> | MasterHDEncrypted;

export type Wallet = {
  network: NetworkType;
  wid: number;
  id: string;
  watchOnly: boolean;
  accountDepth: number;
  token: string;
  tokenDepth: number;
  master: WalletMaster;
  balance: Omit<Balance, 'account'> & {
    account: -1;
  };
};

export type MasterHD = MasterHDPlain | MasterHDEncrypted;

type MasterHDPlain = {
  encrypted: false;
  key: {
    xprivkey: string;
  };
  mnemonic: {
    bits: number;
    language: string;
    entropy: string;
    phrase: string;
  };
};

type MasterHDEncrypted = {
  encrypted: true;
  until: number;
  iv: string;
  ciphertext: string;
  algorithm: 'pbkdf2';
  n: number;
  r: number;
  p: number;
};

type Balance = {
  account: number;
  tx: number;
  coin: number;
  unconfirmed: number;
  confirmed: number;
  lockedUnconfirmed: number;
  lockedConfirmed: number;
};

export type Account = {
  name: string;
  initialized: boolean;
  watchOnly: boolean;
  type: 'pubkeyhash' | 'multisig';
  m: number;
  n: number;
  accountIndex: number;
  receiveDepth: number;
  changeDepth: number;
  lookahead: number;
  receiveAddress: string;
  changeAddress: string;
  accountKey: string;
  keys: [];
  balance: Balance;
};

export type Success = { success: boolean };

type CreateAccountMultisig = {
  type: 'multisig';
  m: number;
  n: number;
};

type CreateAccountPubkeyhash = {
  type?: 'pubkeyhash';
};

export type CreateAccountOptions = {
  wallet: string;
  name: string;
  passphrase?: string;
} & (CreateAccountMultisig | CreateAccountPubkeyhash);

type WalletTxOutput = {
  value: number;
  address: string;
  covenant: {
    type: number;
    items: [];
  };
  path: {
    name: string;
    account: number;
    change: boolean;
    derivation: string;
  };
};

type WalletTxInput = {
  value: number;
  address: string;
  path: {
    name: string;
    account: number;
    change: boolean;
    derivation: string;
  };
};

export type WalletTX = {
  hash: string;
  height: number;
  block: string;
  time: number;
  mtime: number;
  date: DateStr;
  mdate: DateStr;
  size: number;
  virtualSize: number;
  fee: number;
  rate: number;
  confirmations: number;
  inputs: WalletTxInput[];
  outputs: WalletTxOutput[];
  tx: string;
};

export type WalletTXUnconfirmed = Omit<
  WalletTX,
  'height' | 'block' | 'confirmations'
> & {
  height: -1;
  block: null;
  confirmations: 0;
};
