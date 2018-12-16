import React, { Component } from "react";
import AlphaVantage from "alphavantage-ts";

export interface TickerProps {
  tickerSymbol: string;
  shareAmount: number;
  sharePrice: number;
}

export class Ticker extends Component<TickerProps> {
  componentDidMount = () => {
    // if (this.props.apiConnection !== undefined) {
    //   this.props.apiConnection.stocks
    //     .quote(this.props.tickerSymbol, { datatype: "json" })
    //     .then(data => {
    //       this.setState({
    //         sharePrice: data["Global Quote"]["05. price"]
    //       });
    //     });
    // }
  };

  render() {
    return (
      <tr>
        <td> {this.props.tickerSymbol} </td>
        <td>$ {this.props.sharePrice}</td>
        <td>$ {this.props.shareAmount * this.props.sharePrice}</td>
      </tr>
    );
  }
}
