import { Component } from 'react';
import Header from '../Header/Header';
import './Request.css';
import "../../global.css";

import { Button, TextField } from '@mui/material';


export default class RequestCrypto extends Component {
  constructor(props) {
    super(props)
    this.state = {
      amount: 0,

    }
  }

  componentDidMount() {

  }

  componentDidUpdate() {
    console.log(this.state);
  }

  async requestToBorrow() {
    await this.props.exchange.createRequestCredit(this.props.account, this.state.amount, 10, 0);
    this.props.history.push("/");
  }

  render() {
    return (
      <div className="landing-page">
        <Header />
        <div className='container fcss' style={{ fontSize: "15px" }}>
          <div className='request-title'>
            Request to Borrow Funds
          </div>
          <div style={{ marginTop: "20px" }}>
            <b>Your address:</b> {this.props.account}
          </div>
          <div className='frcc' style={{marginTop: "10px"}}>
            <b>Request Amount:</b> <TextField
              size='small'
              style={{ marginLeft: "10px" }}
              onChange={(event) => this.setState({ amount: event.target.value })}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            ></TextField> <p style={{marginLeft: "10px"}}>ETH</p>
          </div>
          <Button onClick={async () => await this.requestToBorrow()} style={{ marginTop: "20px" }} variant="contained">
            Request
          </Button>
        </div >
      </div>

    );
  }
};
