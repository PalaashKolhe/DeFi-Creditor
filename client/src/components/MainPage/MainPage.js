import { Component } from "react";
import Header from "../Header/Header";
import "./MainPage.css";
import "../../global.css";
import Credit from "./Credit/Credit";
import axios from 'axios';

export default class MainPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            lendRequestArray: [],
            activeCreditsArray: [],
            usdToEthMultiplier: 1,
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.creditArray !== this.props.creditArray || prevProps.lendRequestArray !== this.props.lendRequestArray) {
            this.getCreditInformation();
        }
    }

    componentDidMount() {
        this.getCreditInformation();
        this.convertEthToUsd();
    }

    async convertEthToUsd(eth) {
        await axios.get("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=ETH,USD").then((response) => {
            this.setState({ usdToEthMultiplier: response.data["USD"] })
        }).catch(() => {
            this.setState({ usdToEthMultiplier: 0 });
        })
    }

    async getCreditInformation() {
        var lendRequestArray = [];
        var activeCreditsArray = [];

        if (this.props.creditArray) {
            for (var element of this.props.creditArray) {
                var borrower = await element.getBorrower();
                var amount = await element.getAmount();
                var lender = await element.getLender();
                if (lender == "0x0000000000000000000000000000000000000000") {
                    lendRequestArray.push({
                        "borrower": borrower,
                        "amount": Number(amount),
                    });
                } else {
                    activeCreditsArray.push({
                        "borrower": borrower,
                        "amount": Number(amount),
                        "lender": lender,
                    });
                }
            };
            this.setState({ lendRequestArray: lendRequestArray, activeCreditsArray: activeCreditsArray });
        }
    }

    render() {
        var usdToEthMultiplier = this.state.usdToEthMultiplier;
        var exchange = this.props.exchange;
        var account = this.props.account;
        var provider = this.props.provider;
        var signer = this.props.signer;

        return (
            <div className="landing-page">
                <Header />
                <div className="credit">
                    <div className="currently-active-credits-paragraph"><b>Users that would like to borrow:</b></div>
                    <p align="left" style={{ marginTop: "5px" }}>
                        DeFi Creditor introduces collateral-free and trust-less lending on the blockchain, maximizing capital efficiency for borrowers and interest returns for lenders. These users below could use your help:
                    </p>
                    <div className="modal-container" style={{ marginTop: "5px" }}>
                        {this.state.lendRequestArray.map(function (credit, i) {
                            return (
                                <Credit key={i} usdToEthMultiplier={usdToEthMultiplier} borrower={credit["borrower"]} amount={credit["amount"]} exchange={exchange} account={account} provider={provider} signer={signer} />
                            )
                        })}
                    </div>
                    <div className="currently-active-credits-paragraph" style={{ padding: "1em 0 0 0" }}><b>Currently active credits:</b></div>
                    <p align="left" style={{ marginTop: "5px" }}>
                        The following are the currently active credits on our platform!
                    </p>
                    <div className="modal-container" style={{ marginTop: "5px" }}>
                        {this.state.activeCreditsArray.map(function (credit, i) {
                            return (
                                <Credit key={i} usdToEthMultiplier={usdToEthMultiplier} lender={credit["lender"]} borrower={credit["borrower"]} amount={credit["amount"]} exchange={exchange} account={account} provider={provider} signer={signer} />
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

