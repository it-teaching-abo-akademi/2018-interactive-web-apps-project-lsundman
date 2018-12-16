import React, { Component } from "react";
import { Ticker, TickerProps } from "./Ticker";
import AlphaVantage from "alphavantage-ts";
import AddForm from "./AddForm";

export interface PortfolioProps {
  name: string;
  shareList: TickerProps[];
}

export class Portfolio extends Component<PortfolioProps> {
  render() {
    const tickers = this.props.shareList.map(item => <Ticker {...item} />);
    return (
      <div className="spms-portfolio">
        <div>
          <h2>{this.props.name}</h2>
          <table>
            <thead>
              <tr>
                <th>Stock</th>
                <th>Price</th>
                <th>Total value</th>
              </tr>
            </thead>
            <tbody>{tickers}</tbody>
          </table>
          <div className="button-row">
            <button>Add stock</button>
          </div>
        </div>
      </div>
    );
  }
}
