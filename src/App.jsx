/*Tools*/
import React from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import { Box, Container, ThemeProvider } from "@mui/material";
import TransferForm from "./components/TransferForm";
import theme from "./utils/theme";

/*Components*/
import Header from "./components/Header";

/*Style*/
import "./App.css";

const getLibrary = (provider) => new ethers.providers.Web3Provider(provider);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Header />
      <Container>
        <TransferForm />
      </Container>
    </Web3ReactProvider>
    </Box>
    </ThemeProvider>
  );
};

export default App;
