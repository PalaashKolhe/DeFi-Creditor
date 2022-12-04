import { React, Component } from 'react';
import Web3 from 'web3';

import { Contract, ethers } from "ethers";
import './App.css';
import ExchangeContract from "./contracts/Exchange.json";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      exchange: null,
      account: null,
      creditArray: [],
    }
  }

  componentDidMount() {
    this.loadSmartContract();
  }

  async loadCredits() {
    const credit = await this.state.exchange.functions.getCreditArray();
    this.setState({ creditArray: credit }, () => { console.log(this.state) });
  }

  async loadSmartContract() {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const exchange = new ethers.Contract(
          ExchangeContract.networks[5777].address,
          ExchangeContract.abi,
          signer
        )
        const accounts = await provider.listAccounts();
        this.setState({ exchange: exchange, account: accounts[0] }, () => this.loadCredits());
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <div className="App">
        hello your account is: {this.state.account} and your contract address is:
      </div>
    )
  }
}

export default App;