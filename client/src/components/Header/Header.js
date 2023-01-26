import { Component } from "react";
import { NavLink } from "react-router-dom";
import "../../global.css";
import "./Header.css";

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showModal: false
        }
    }

    render() {
        return (
            <div className="frbc header">
                <NavLink to="/" style={{ textDecoration: 'none', color: "black", cursor: "pointer" }} className="title frsc">
                    DeFi Creditor
                    <img src="logo.png" width={"50px"} style={{ "paddingLeft": "20px" }} />
                </NavLink>
                <NavLink style={{ textDecoration: 'none', color: "black" }} to="/request" onClick={() => this.setState({ showModal: true })} className="request frec">
                    Request to Borrow
                </NavLink>
            </div >
        )
    }
}

export default Header;