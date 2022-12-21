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
            creditArray: [],
            usdToEthMultiplier: 1,
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.creditArray !== this.props.creditArray) {
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
        var creditArray = [];

        if (this.props.creditArray) {
            for (var element of this.props.creditArray) {
                var borrower = await element.getBorrower();
                var amount = await element.getAmount();
                creditArray.push({
                    "borrower": borrower,
                    "amount": Number(amount),
                });
            };
            this.setState({ creditArray: creditArray });
        }
    }

    render() {
        var usdToEthMultiplier = this.state.usdToEthMultiplier;
        
        return (
            <div className="landing-page">
                <Header />
                <div className="credit">
                    <p align="left">
                        DeFi Creditor introduces collateral-free and trust-less lending on the blockchain, maximizing capital efficiency for borrowers and interest returns for lenders. These users below could use your help:
                    </p>
                    <div className="modal-container">
                        {this.state.creditArray.map(function (credit, i) {
                            return (
                                <Credit key={i} usdToEthMultiplier={usdToEthMultiplier} borrower={credit["borrower"]} amount={credit["amount"]} />
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

