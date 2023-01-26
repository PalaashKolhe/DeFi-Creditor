import { React, Component } from 'react';
import { ethers } from "ethers";
import './App.css';
import ExchangeContract from "./contracts/Exchange.json";
import CreditContract from "./contracts/Credit.json";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from './components/MainPage/MainPage';
import RequestCrypto from './components/RequestMoney/Request';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      signer: null,
      provider: null,
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
    this.setState({ creditArray: creditArray });
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
        this.setState({ provider: provider, exchange: exchange, account: accounts[0], signer: signer }, () => {
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
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route exact path="/" element={<MainPage creditArray={this.state.creditArray} exchange={this.state.exchange} account={this.state.account} provider={this.state.provider} />} />
            <Route exact path="/request" element={<RequestCrypto exchange={this.state.exchange} account={this.state.account} account={this.state.account} provider={this.state.provider} />} />
            {/* <Route path="/auth" component={AuthPage} exact/>
            <Route path="/view_profile" component={ProfilePage} exact/>
            <Route path="/confirmed" component={ConfirmOrder} exact />
            <Route path="/view_post/:id" component={ViewPost} exact /> */}
          </Routes>
        </div>
      </BrowserRouter>
    )
  }
}

export default App;