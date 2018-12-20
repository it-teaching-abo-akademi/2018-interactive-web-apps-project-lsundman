import React, { Component } from "react";
import AlphaVantage from "alphavantage-ts";
import { getApiConnection } from "../App";
import StorageBackedComponent from "./StorageBackedComponent";

export class Ticker extends StorageBackedComponent<
  { price: number | undefined; invalidSymbol: boolean },
  {
    symbol: string;
    amount: number;
    onRemove: () => void;
    onSelect: (selected: boolean) => void;
  }
> {
  api: AlphaVantage;
  constructor(props: any) {
    super(props, () => {
      return { price: undefined, invalidSymbol: false };
    });
    this.api = getApiConnection();
  }

  getId = () => {
    return `SPMS-ticker: ${btoa(this.props.symbol + this.props.amount)}`;
  };

  componentDidMount = () => {
    if (this.state.price === undefined) this.getQuote();
  };

  getQuote = () => {
    if (this.api !== undefined) {
      this.api.stocks
        .quote(this.props.symbol, { datatype: "json" })
        .then(data => {
          let price = data["Global Quote"]["05. price"];
          this.setState({
            price: price,
            invalidSymbol: price === undefined
          });
        });
    }
  };

  render() {
    let quoteLabel;
    let quoteLabelTotal;

    if (this.state.price === undefined) {
      quoteLabel = "...";
      quoteLabelTotal = "...";
    } else {
      quoteLabel = this.state.price;
      quoteLabelTotal = this.state.price * this.props.amount;
    }

    return (
      <tr className={this.state.invalidSymbol ? "invalid-symbol" : ""}>
        <td>
          <input
            type="checkbox"
            onChange={evt => this.props.onSelect(evt.target.checked)}
          />
        </td>
        <td> {this.props.symbol} </td>
        <td>$ {quoteLabel}</td>
        <td>$ {quoteLabelTotal}</td>
        <td>
          <button
            onClick={() => {
              this.removeStoredState();
              this.props.onRemove();
            }}
          >
            <i className="fas fa-trash" />
          </button>
        </td>
      </tr>
    );
  }
}
