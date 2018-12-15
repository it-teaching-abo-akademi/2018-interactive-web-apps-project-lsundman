import React, { Component } from "react";
import { Ticker, TickerProps } from "./Ticker";
import AlphaVantage from "alphavantage-ts";

type TickerDesc = { tickerSymbol: string; shareAmount: number };

export interface PortfolioProps {
  name: string;
  apiConnection: AlphaVantage;
}

enum ViewEnum {
  Main,
  AddStock
}

class AddForm extends Component<{
  addTicker: (tickerSymbol: string, shareAmount: number) => void;
  cancel: () => void;
}> {
  state: {
    tickerSymbol: string;
    shareAmount: number;
  };

  constructor(props: any) {
    super(props);
    this.state = { tickerSymbol: "", shareAmount: 0 };
  }

  render() {
    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          if (this.state.tickerSymbol !== "" && this.state.shareAmount !== 0)
            this.props.addTicker(
              this.state.tickerSymbol,
              this.state.shareAmount
            );
        }}
      >
        <label>
          Ticker symbol
          <input
            type="text"
            value={this.state.tickerSymbol}
            onChange={e => {
              this.setState({ tickerSymbol: e.target.value });
            }}
          />
        </label>
        <label>
          Quantity
          <input
            type="number"
            value={this.state.shareAmount}
            onChange={e => {
              this.setState({ shareAmount: e.target.value });
            }}
          />
        </label>
        <input type="submit" value="Submit" />
        <button onClick={() => this.props.cancel()}>Cancel</button>
      </form>
    );
  }
}

export class Portfolio extends Component<PortfolioProps> {
  state: {
    tickerList: Array<TickerDesc>;
    view: ViewEnum;
  };

  constructor(props: PortfolioProps) {
    super(props);
    this.state = { tickerList: [], view: ViewEnum.Main };
  }

  addTicker = (tickerSymbol: string, shareAmount: number) => {
    let newTicker = { tickerSymbol: tickerSymbol, shareAmount: shareAmount };
    this.setState((prevState: any) => ({
      tickerList: [...prevState.tickerList, newTicker]
    }));
  };

  render() {
    let body;

    switch (this.state.view) {
      case ViewEnum.Main:
        body = (
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
              <tbody>
                {this.state.tickerList.map((item: TickerDesc) => {
                  return (
                    <Ticker
                      key={item.tickerSymbol}
                      tickerSymbol={item.tickerSymbol}
                      shareAmount={item.shareAmount}
                      apiConnection={this.props.apiConnection}
                    />
                  );
                })}
              </tbody>
            </table>
            <div className="button-row">
              <button
                onClick={() => {
                  this.setState({ view: ViewEnum.AddStock });
                }}
              >
                Add stock
              </button>
            </div>
          </div>
        );
        break;
      case ViewEnum.AddStock:
        body = (
          <AddForm
            addTicker={(symbol: string, amount: number) => {
              this.addTicker(symbol, amount);
              this.setState({ view: ViewEnum.Main });
            }}
            cancel={() => this.setState({ view: ViewEnum.Main })}
          />
        );
    }

    return <div className="spms-portfolio">{body}</div>;
  }
}
