import React, { Component } from "react";
import { Ticker } from "./Ticker";
import StorageBackedComponent from "./StorageBackedComponent";
import AddForm from "./AddForm";

class shareEntry {}
export class Portfolio extends StorageBackedComponent<
  {
    shareList: {
      shareSymbol: string;
      shareAmount: number;
      selected: boolean;
    }[];
    viewMain: boolean;
  },
  { name: string; onRemove: () => void }
> {
  storage = window.localStorage;

  constructor(props: { name: string; onRemove: () => void }) {
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

  removeStock = (symbol: string) => {
    this.setState({
      shareList: this.state.shareList.filter(
        elem => elem.shareSymbol != symbol
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
        onRemove={() => this.removeStock(item.shareSymbol)}
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
            <button />
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
