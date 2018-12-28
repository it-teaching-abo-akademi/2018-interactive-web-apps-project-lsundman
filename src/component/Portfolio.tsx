import React, { Component } from "react";
import { Ticker } from "./Ticker";
import StorageBackedComponent from "./StorageBackedComponent";
import AddForm from "./AddForm";

type PortfolioState = {
  shareList: {
    shareSymbol: string;
    shareAmount: number;
    selected: boolean;
    price: number;
  }[];
  viewMain: boolean;
};

type PortfolioProps = {
  name: string;
  onRemove: () => void;
  onGraphShow: (data: string[]) => void;
  forexRate: number;
  currency: "USD" | "EUR";
};

export class Portfolio extends StorageBackedComponent<
  PortfolioState,
  PortfolioProps
> {
  constructor(props: PortfolioProps) {
    super(props, () => {
      return { shareList: [], viewMain: true, currency: "USD" };
    });
  }

  addStock = (symbol: string, amount: number) => {
    if (!this.state.shareList.some(elem => elem.shareSymbol === symbol)) {
      this.setState({
        shareList: [
          ...this.state.shareList,
          {
            shareSymbol: symbol,
            shareAmount: amount,
            selected: false,
            price: -1
          }
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
              selected: selected,
              price: share.price
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
        onPriceChange={newPrice => {
          this.setState({
            shareList: this.state.shareList.map(share =>
              share.shareSymbol === item.shareSymbol
                ? {
                    shareSymbol: share.shareSymbol,
                    shareAmount: share.shareAmount,
                    selected: share.selected,
                    price: newPrice
                  }
                : share
            ),
            viewMain: this.state.viewMain
          });
        }}
        selected={item.selected}
        currency={this.props.currency}
        forexRate={this.props.forexRate}
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
          <tfoot>
            <tr>
              <td />
              <td />
              <td />
              <td />
              <td>
                {this.props.currency === "USD" ? "$ " : "€ "}
                {Math.round(
                  this.state.shareList
                    .map(share => share.price)
                    .reduce((a, b) => a + b) *
                    (this.props.currency === "USD" ? 1 : this.props.forexRate) *
                    100
                ) / 100}
              </td>
            </tr>
          </tfoot>
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
            this.setState({
              shareList: this.state.shareList,
              viewMain: true
            });
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
