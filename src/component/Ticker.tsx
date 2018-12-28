import React from "react";
import StorageBackedComponent from "./StorageBackedComponent";
import { getQuote } from "../helpers";

export class Ticker extends React.Component<
  {
    symbol: string;
    amount: number;
    onSelect: (selected: boolean) => void;
    onPriceChange: (newPrice: number) => void;
    selected: boolean;
    currency: "USD" | "EUR";
    forexRate: number;
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
      if (data != undefined) {
        this.props.onPriceChange(data * this.props.amount);
      }
    });
  };

  render() {
    let quoteLabel;
    let quoteLabelTotal;

    if (this.state.price === undefined) {
      quoteLabel = "...";
      quoteLabelTotal = "...";
    } else {
      quoteLabel =
        this.props.currency === "USD"
          ? `$ ${this.state.price}`
          : `€ ${Math.round(this.state.price * this.props.forexRate * 100) /
              100}`;
      let total = Math.round(this.state.price * this.props.amount * 100) / 100;
      quoteLabelTotal =
        this.props.currency === "USD"
          ? `$ ${total}`
          : `€ ${Math.round(total * this.props.forexRate * 100) / 100}`;
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
        <td>{quoteLabel}</td>
        <td> {this.props.amount} </td>
        <td>{quoteLabelTotal}</td>
      </tr>
    );
  }
}
