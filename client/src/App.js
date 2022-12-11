import { React, Component } from 'react';
import { ethers } from "ethers";
import './App.css';
import ExchangeContract from "./contracts/Exchange.json";
import CreditContract from "./contracts/Credit.json";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      exchange: null,
      account: null,
      creditArray: [],
      userArray: [],
    }
  }

  componentDidMount() {
    this.loadSmartContract();

  }

  async loadCredits(signer) {
    const addressArray = await this.state.exchange.functions.getCreditArray();
    var creditArray = [];
    addressArray[0].forEach(address => {
      var credit = new ethers.Contract(
        address,
        CreditContract.abi,
        signer
      );
      creditArray.push(credit);
    });
    this.setState({creditArray: creditArray});
  }

  async loadUsers() {
    const users = await this.state.exchange.functions.getUsers();
    this.setState({ userArray: users[0] });
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
        this.setState({ exchange: exchange, account: accounts[0] }, () => {
          this.loadCredits(signer);
          this.loadUsers();
        });
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