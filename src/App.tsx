import React, { Component } from "react";
import "./App.css";
import { Portfolio } from "./component/Portfolio";
import AlphaVantage from "alphavantage-ts";
import StorageBackedComponent from "./component/StorageBackedComponent";

let API_CONN: AlphaVantage;

if (process.env.REACT_APP_API_KEY !== undefined)
  API_CONN = new AlphaVantage(process.env.REACT_APP_API_KEY);

export function getApiConnection(): AlphaVantage {
  return API_CONN;
}

class App extends StorageBackedComponent<
  { portfolioList: string[]; addFieldValue: string },
  {}
> {
  constructor(props: any) {
    super(props, () => {
      return {
        portfolioList: [],
        addFieldValue: ""
      };
    });
  }

  addPortfolio = () => {
    if (this.state.addFieldValue != "") {
      if (
        !this.state.portfolioList.some(
          elem => elem === this.state.addFieldValue
        )
      ) {
        this.setState({
          portfolioList: [
            ...this.state.portfolioList,
            this.state.addFieldValue
          ],
          addFieldValue: ""
        });
      } else {
        window.alert("Portfolio names should be unique");
      }
    }
  };

  removePortfolio = (name: string) => {
    if (name != "") {
      this.setState({
        portfolioList: this.state.portfolioList.filter(elem => elem != name),
        addFieldValue: ""
      });
    }
  };

  getId = (): string => {
    return "SPMS-app";
  };

  render() {
    const portfolios = this.state.portfolioList.map(item => (
      <Portfolio
        key={item}
        name={item}
        onRemove={() => this.removePortfolio(item)}
      />
    ));

    return (
      <div>
        <div className="header">
          <button onClick={this.addPortfolio}> Add portfolio</button>
          <input
            onChange={evt => {
              this.setState({
                portfolioList: this.state.portfolioList,
                addFieldValue: evt.target.value
              });
            }}
            type="text"
            value={this.state.addFieldValue}
          />
        </div>
        <ul>{portfolios}</ul>
      </div>
    );
  }
}

export default App;
