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
      />
    ));

    let body;

    if (this.state.viewMain) {
      body = (
        <div>
          <button
            onClick={() => {
              this.removeStoredState();
              this.props.onRemove();
            }}
          >
            Remove portfolio
          </button>
          <table>
            <thead>
              <tr>
                <th />
                <th>Stock</th>
                <th>Price</th>
                <th>Total value</th>
                <th />
              </tr>
            </thead>
            <tbody>{tickers}</tbody>
          </table>
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
      <div className="spms-portfolio">
        <div>
          <h2>{this.props.name}</h2>
          {body}
        </div>
      </div>
    );
  }
}
