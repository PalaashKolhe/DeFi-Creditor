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
                    <img src="logo.png" width={"50px"} style={{"paddingLeft":"20px"}}/>
                </div>
                <div onClick={() => { console.log("hello") }} className="request frec">
                    Request to Borrow
                </div>
            </div>
        )
    }
}

export default Header;