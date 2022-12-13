import { Component } from "react";
import "./Credit.css";

export default class Credit extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className="modal frcc">
                <div>
                    Address: {this.props.borrower}
                </div>
                {/* <div className="fccc">
                    <div>Description:</div>
                    <div>{this.props.descriptions}</div>                
                </div> */}
                <div>
                    Amount: {this.props.amount} ETH
                </div>
            </div>
        )
    }
}