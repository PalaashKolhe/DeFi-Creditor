import { Component } from "react";
import Header from "../Header/Header";
import "./LandingPage.css";
import "../../global.css";

class LandingPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <div className="landingPage">
                <Header />
            </div>
        )
    }
}

export default LandingPage;