import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42], // Adjust as needed
});

export const walletconnect = new WalletConnectConnector({
  infuraId: 'YOUR_INFURA_PROJECT_ID', // Required
  qrcode: true,
});