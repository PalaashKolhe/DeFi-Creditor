import { Component } from "react";
import "../../global.css";
import "./Header.css";

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <div className="frbc header">
                <div className="title frsc">
                    DeFi Creditor
                </div>
                <div onClick={() => { console.log("hello") }} className="request frec">
                    Request to Borrow
                </div>
            </div>
        )
    }
}

export default Header;