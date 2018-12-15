import React, { Component } from "react";
import AlphaVantage from "alphavantage-ts";

export interface TickerProps {
  tickerSymbol: string;
  shareAmount: number;
  apiConnection: AlphaVantage;
}

export class Ticker extends Component<TickerProps> {
  state: { sharePrice: number | undefined };
  timerID: any;

  constructor(props: TickerProps) {
    super(props);
    this.state = {
      sharePrice: undefined
    };
  }

  componentDidMount = () => {
    this.setState({ sharePrice: 23.2 });
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
    let priceLabel;
    let totalPriceLabel;

    if (this.state.sharePrice === undefined) {
      priceLabel = <td>...</td>;
      totalPriceLabel = priceLabel;
    } else {
      priceLabel = <td>$ {this.state.sharePrice}</td>;
      totalPriceLabel = (
        <td>$ {this.props.shareAmount * this.state.sharePrice}</td>
      );
    }

    return (
      <tr>
        <td> {this.props.tickerSymbol} </td>
        {priceLabel}
        {totalPriceLabel}
      </tr>
    );
  }
}
