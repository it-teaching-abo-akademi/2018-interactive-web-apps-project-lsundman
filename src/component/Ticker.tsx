import React from "react";
import StorageBackedComponent from "./StorageBackedComponent";
import { getQuote } from "../helpers";

export class Ticker extends React.Component<
  {
    symbol: string;
    amount: number;
    onSelect: (selected: boolean) => void;
    selected: boolean;
  },
  { price: number | undefined; invalidSymbol: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      price: undefined,
      invalidSymbol: false
    };
  }

  getId = () => {
    return `SPMS-ticker: ${btoa(this.props.symbol + this.props.amount)}`;
  };

  componentDidMount = () => {
    getQuote(this.props.symbol).then(data => {
      this.setState({
        price: data,
        invalidSymbol: data === undefined
      });
    });
  };

  render() {
    let quoteLabel;
    let quoteLabelTotal;

    if (this.state.price === undefined) {
      quoteLabel = "...";
      quoteLabelTotal = "...";
    } else {
      quoteLabel = this.state.price;
      quoteLabelTotal =
        Math.round(this.state.price * this.props.amount * 100) / 100;
    }

    return (
      <tr className={this.state.invalidSymbol ? "invalid-symbol" : ""}>
        <td>
          <input
            type="checkbox"
            onChange={evt => this.props.onSelect(evt.target.checked)}
            checked={this.props.selected}
          />
        </td>
        <td> {this.props.symbol} </td>
        <td>$ {quoteLabel}</td>
        <td> {this.props.amount} </td>
        <td>$ {quoteLabelTotal}</td>
      </tr>
    );
  }
}
