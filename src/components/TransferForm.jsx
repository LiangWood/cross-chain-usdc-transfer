import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import {
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Switch,
  Grid,
  IconButton,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { injected, walletconnect } from '../hooks/useEVM';
import { USDC_CONTRACT_ADDRESS } from '../utils/constants';
import { initiateTransfer } from '../utils/cctp';

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)"
];

function TransferForm() {
  const { activate, account, library } = useWeb3React();
  const [amount, setAmount] = useState('');
  const [sourceChain, setSourceChain] = useState('ethereum');
  const [destinationChain, setDestinationChain] = useState('polygon');
  const [status, setStatus] = useState('');
  const [sourceBalance, setSourceBalance] = useState('');
  const [destinationBalance, setDestinationBalance] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [enableRefuel, setEnableRefuel] = useState(false);

  const connectWallet = async (connector) => {
    try {
      await activate(connector);
    } catch (ex) {
      console.log(ex);
    }
  };

  const handleTransfer = async (event) => {
    event.preventDefault();
    if (!account) {
      alert('Please connect your wallet first.');
      return;
    }

    setStatus('Pending...');

    try {
      const transferResponse = await initiateTransfer(sourceChain, destinationChain, amount);
      console.log('Transfer initiated:', transferResponse);
      setStatus('Transfer Successful');
    } catch (error) {
      console.error(error);
      setStatus('Error: Transfer Failed');
    }
  };

  const fetchBalance = async (chain) => {
    const contractAddress = USDC_CONTRACT_ADDRESS[chain];
    const contract = new ethers.Contract(contractAddress, ERC20_ABI, library.getSigner());
    const balance = await contract.balanceOf(account);
    return ethers.utils.formatUnits(balance, 6);
  };

  useEffect(() => {
    if (account && library) {
      fetchBalance(sourceChain).then(setSourceBalance);
      fetchBalance(destinationChain).then(setDestinationBalance);
    }
  }, [account, library, sourceChain, destinationChain]);

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, maxWidth:600, margin: '0 auto' }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Transfer</Typography>
        <Box>
          <IconButton><RefreshIcon /></IconButton>
          <IconButton><SettingsIcon /></IconButton>
        </Box>
      </Grid>
      <Button
        variant="contained"
        color="primary"
        onClick={() => connectWallet(injected)}
        sx={{ mr: 1, mb: 2 }}
      >
        MetaMask
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => connectWallet(walletconnect)}
        sx={{ mr: 1, mb: 2 }}
      >
        WalletConnect
      </Button>
      {account && <Typography variant="body1" sx={{ mb: 2 }}>Connected Account: {account}</Typography>}

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>From</InputLabel>
        <Select value={sourceChain} onChange={e => setSourceChain(e.target.value)}>
          <MenuItem value="ethereum">Ethereum</MenuItem>
          <MenuItem value="polygon">Polygon</MenuItem>
        </Select>
        <Typography variant="body2" sx={{ mt: 1 }}>Bal: {sourceBalance} USDC</Typography>
      </FormControl>

      <TextField
        fullWidth
        label="Amount"
        type="number"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          endAdornment: <Typography variant="body2" sx={{ color: 'primary.main' }}>USDC</Typography>,
        }}
      />

      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <ArrowDownwardIcon />
      </Box>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>To</InputLabel>
        <Select value={destinationChain} onChange={e => setDestinationChain(e.target.value)}>
          <MenuItem value="polygon">Polygon</MenuItem>
          <MenuItem value="ethereum">Ethereum</MenuItem>
        </Select>
        <Typography variant="body2" sx={{ mt: 1 }}>Bal: {destinationBalance} USDC</Typography>
      </FormControl>

      <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
        <Typography>Enable Refuel</Typography>
        <Switch checked={enableRefuel} onChange={() => setEnableRefuel(!enableRefuel)} />
        <Typography variant="body2" sx={{ ml: 1 }}>Get MATIC for transactions on Polygon</Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setRecipientAddress(prompt('Enter recipient address:'))}
        >
          Add Recipient Address
        </Button>
        {recipientAddress && <Typography variant="body2" sx={{ mt: 1 }}>Recipient: {recipientAddress}</Typography>}
      </Box>

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleTransfer}
        disabled={!account}
      >
        Transfer
      </Button>

      {status && <Typography variant="body1" sx={{ mt: 2 }}>Status: {status}</Typography>}
    </Box>
  );
}

export default TransferForm;