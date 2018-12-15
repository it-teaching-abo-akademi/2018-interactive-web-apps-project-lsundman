import React, { Component } from "react";
import { Ticker, TickerProps } from "./Ticker";
import AlphaVantage from "alphavantage-ts";

type TickerDesc = { tickerSymbol: string; shareAmount: number };

export interface PortfolioProps {
  apiConnection: AlphaVantage;
}

export class Portfolio extends Component<PortfolioProps> {
  state: { tickerList: Array<TickerDesc> };

  constructor(props: PortfolioProps) {
    super(props);
    this.state = { tickerList: [] };
  }

  addTicker = (tickerSymbol: string, shareAmount: number) => {
    let newTicker = { tickerSymbol: tickerSymbol, shareAmount: shareAmount };
    this.setState((prevState: any) => ({
      tickerList: [...prevState.tickerList, newTicker]
    }));
  };

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>Stock</th>
            <th>Price</th>
            <th>Total value</th>
          </tr>
        </thead>
        <tbody>
          {this.state.tickerList.map((item: TickerDesc) => {
            return (
              <Ticker
                tickerSymbol={item.tickerSymbol}
                shareAmount={item.shareAmount}
                apiConnection={this.props.apiConnection}
              />
            );
          })}
        </tbody>
      </table>
    );
  }
}
