import { ethers } from "ethers";
import { Component } from "react";
import "./Credit.css";

export default class Credit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usdPrice: 0,
        }
    }

    componentDidMount() {
        if (this.props.usdToEthMultiplier) {
            var usdPrice = parseFloat(this.props.amount) * this.props.usdToEthMultiplier;
            this.setState({ usdPrice: usdPrice.toFixed(2) })
        }
    }

    async lendMoney() {
        // testing private key
        const borrowerAddress = this.props.borrower;
        const signer = this.props.provider.getSigner();
        console.log(`Transaction initiatied from ${signer} to ${borrowerAddress}`);

        const tx = {
            to: borrowerAddress,
            value: ethers.utils.parseEther(this.props.amount.toString()),
        };

        const transactionReceipt = await signer.sendTransaction(tx);
        await transactionReceipt.wait();
        console.log(`Transaction successful with hash: ${transactionReceipt.hash}`);

        this.props.exchange.setLenderForCredit(this.props.account, this.props.borrower)
            .catch((e) => { console.log("Error while creating credit: ", e) });

    }

    render() {
        return (
            <div className="frcc" style={{
                "width": "100%", "marginBottom": "10px",
            }}>
                <div className="modal frbc" style={{ width: this.props.lender ? "100%" : "" }}>
                    <div className="fccs">
                        <div className="modal-title">
                            Borrower Address
                        </div>
                        <div>
                            {this.props.borrower}
                        </div>
                    </div>
                    {this.props.lender &&
                        <div className="fccs">
                            <div className="modal-title">
                                Lender Address
                            </div>
                            <div>
                                {this.props.borrower}
                            </div>
                        </div>
                    }

                    {/* <div className="fccc">
                    <div>Description:</div>
                    <div>{this.props.descriptions}</div>                
                </div> */}
                    <div className="fcce">
                        <div className="modal-title">
                            Amount
                        </div>
                        <div>
                            {this.props.amount} ETH (${this.state.usdPrice})
                        </div>
                    </div>
                </div>
                {
                    !this.props.lender &&
                    <div className="fccs lend-button" onClick={() => { this.lendMoney() }}>
                        Lend
                    </div>
                }

            </div>
        )
    }
}