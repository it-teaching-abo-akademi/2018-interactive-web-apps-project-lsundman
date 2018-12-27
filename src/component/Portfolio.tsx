import React, { Component } from "react";
import { Ticker } from "./Ticker";
import StorageBackedComponent from "./StorageBackedComponent";
import AddForm from "./AddForm";

type PortfolioState = {
  shareList: {
    shareSymbol: string;
    shareAmount: number;
    selected: boolean;
  }[];
  viewMain: boolean;
};

type PortfolioProps = {
  name: string;
  onRemove: () => void;
  onGraphShow: (data: string[]) => void;
};

export class Portfolio extends StorageBackedComponent<
  PortfolioState,
  PortfolioProps
> {
  constructor(props: PortfolioProps) {
    super(props, () => {
      return { shareList: [], viewMain: true };
    });
  }

  addStock = (symbol: string, amount: number) => {
    if (!this.state.shareList.some(elem => elem.shareSymbol === symbol)) {
      this.setState({
        shareList: [
          ...this.state.shareList,
          { shareSymbol: symbol, shareAmount: amount, selected: false }
        ],
        viewMain: true
      });
    } else {
      window.alert("You've already added this stock!");
    }
  };

  removeStocks = (symbolList: string[]) => {
    this.setState({
      shareList: this.state.shareList.filter(
        elem => !symbolList.includes(elem.shareSymbol)
      ),
      viewMain: true
    });
  };

  setSelected = (itemName: string, selected: boolean) => {
    this.setState({
      shareList: this.state.shareList.map(share =>
        share.shareSymbol === itemName
          ? {
              shareSymbol: share.shareSymbol,
              shareAmount: share.shareAmount,
              selected: selected
            }
          : share
      ),
      viewMain: this.state.viewMain
    });
  };

  getId = (): string => {
    return `SPMS-portfolio-${this.props.name}`;
  };

  render() {
    const tickers = this.state.shareList.map(item => (
      <Ticker
        key={`${item.shareSymbol}-${item.shareAmount}`}
        symbol={item.shareSymbol}
        amount={item.shareAmount}
        onSelect={selected => this.setSelected(item.shareSymbol, selected)}
        selected={item.selected}
      />
    ));

    let table;

    if (tickers.length > 0) {
      table = (
        <table>
          <thead>
            <tr>
              <th />
              <th>Stock</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total value</th>
            </tr>
          </thead>
          <tbody>{tickers}</tbody>
        </table>
      );
    }

    let body;

    if (this.state.viewMain) {
      body = (
        <div>
          {table}
          <div className="button-row">
            <button
              onClick={() => {
                this.setState({
                  shareList: this.state.shareList,
                  viewMain: false
                });
              }}
            >
              Add stock
            </button>
            <button
              disabled={!this.state.shareList.some(e => e.selected)}
              onClick={() => {
                this.removeStocks(
                  this.state.shareList
                    .filter(elem => elem.selected)
                    .map(elem => elem.shareSymbol)
                );
              }}
            >
              Remove selected
            </button>
            <button
              disabled={!this.state.shareList.some(e => e.selected)}
              onClick={() =>
                this.props.onGraphShow(
                  this.state.shareList
                    .filter(item => item.selected)
                    .map(item => item.shareSymbol)
                )
              }
            >
              Show graph
            </button>
          </div>
        </div>
      );
    } else {
      body = (
        <AddForm
          addTicker={this.addStock}
          cancel={() => {
            this.setState({ shareList: this.state.shareList, viewMain: true });
          }}
        />
      );
    }
    return (
      <li className="spms-portfolio">
        <button
          className="close-button"
          onClick={() => {
            this.props.onRemove();
          }}
        >
          X
        </button>
        <div>
          <h2>{this.props.name}</h2>
          {body}
        </div>
      </li>
    );
  }
}
