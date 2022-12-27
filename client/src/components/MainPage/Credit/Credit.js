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

    render() {
        return (
            <div className="frcc" style={{
                "width": "100%", "margin-bottom": "20px",
            }}>
                <div className="modal frbc">
                    <div className="fccs">
                        <div className="modal-title">
                            Address
                        </div>
                        <div>
                            {this.props.borrower}
                        </div>
                    </div>
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
                <div className="fccs lend-button">
                    Lend
                </div>
            </div>
        )
    }
}