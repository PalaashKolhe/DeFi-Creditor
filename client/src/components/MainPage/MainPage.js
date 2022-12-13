import { Component } from "react";
import Header from "../Header/Header";
import "./MainPage.css";
import "../../global.css";
import Credit from "./Credit/Credit";

export default class MainPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            creditArray: []
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.creditArray !== this.props.creditArray) {
            this.getCreditInformation();
        }
    }

    componentDidMount() {
        this.getCreditInformation();
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
        return (
            <div className="landingPage">
                <Header />
                <div className="credit">
                    <p align="left">
                        DeFi Creditor introduces collateral-free and trust-less lending on the blockchain, maximizing capital efficiency for borrowers and interest returns for lenders. These users below could use your help:
                    </p>
                    {this.state.creditArray.map(function (credit, i) {
                        return (
                            <Credit key={i} borrower={credit["borrower"]} amount={credit["amount"]} />
                        )
                    })}
                </div>
            </div>
        )
    }
}

