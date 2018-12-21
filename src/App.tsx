import React, { Component } from "react";
import "./App.css";
import { Portfolio } from "./component/Portfolio";
import AlphaVantage from "alphavantage-ts";
import StorageBackedComponent from "./component/StorageBackedComponent";
import Popup from "./component/Popup";

let API_CONN: AlphaVantage;

if (process.env.REACT_APP_API_KEY !== undefined)
  API_CONN = new AlphaVantage(process.env.REACT_APP_API_KEY);

export function getApiConnection(): AlphaVantage {
  return API_CONN;
}

class App extends StorageBackedComponent<
  { portfolioList: string[]; addFieldValue: string; showingGraph: boolean },
  {}
> {
  constructor(props: any) {
    super(props, () => {
      return {
        portfolioList: [],
        addFieldValue: "",
        showingGraph: this.state.showingGraph
      };
    });
  }

  addPortfolio = () => {
    if (this.state.portfolioList.length < 10) {
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
            addFieldValue: "",
            showingGraph: this.state.showingGraph
          });
        } else {
          window.alert("Portfolio names should be unique");
        }
      }
    } else {
      window.alert(
        "You can only have 10 portfolios configured at the same time"
      );
    }
  };

  removePortfolio = (name: string) => {
    if (name != "") {
      this.setState({
        portfolioList: this.state.portfolioList.filter(elem => elem != name),
        addFieldValue: "",
        showingGraph: this.state.showingGraph
      });
    }
  };

  showGraph = (data: any) => {
    this.setState({
      showingGraph: true,
      portfolioList: this.state.portfolioList,
      addFieldValue: this.state.addFieldValue
    });
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
        onGraphShow={this.showGraph}
      />
    ));

    let graphPopup;

    if (this.state.showingGraph) {
      graphPopup = <Popup />;
    }

    return (
      <div>
        <div className="header">
          <button onClick={this.addPortfolio}> Add portfolio</button>
          <input
            onChange={evt => {
              this.setState({
                portfolioList: this.state.portfolioList,
                addFieldValue: evt.target.value,
                showingGraph: this.state.showingGraph
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
