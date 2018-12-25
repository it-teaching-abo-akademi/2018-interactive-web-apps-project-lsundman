import React, { Component } from "react";
import "./App.css";
import { Portfolio } from "./component/Portfolio";
import AlphaVantage from "alphavantage-ts";
import StorageBackedComponent from "./component/StorageBackedComponent";
import { Line } from "react-chartjs-2";

let API_CONN: AlphaVantage;

if (process.env.REACT_APP_API_KEY !== undefined)
  API_CONN = new AlphaVantage(process.env.REACT_APP_API_KEY);

export function getApiConnection(): AlphaVantage {
  return API_CONN;
}

type SpmsState = {
  portfolioList: string[];
  addFieldValue: string;
  graphData: any | undefined;
  graphRes: string;
};

class App extends StorageBackedComponent<SpmsState, {}> {
  constructor(props: any) {
    super(props, () => {
      return {
        portfolioList: [],
        addFieldValue: "",
        graphData: undefined,
        graphRes: "weekly"
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
            graphData: this.state.graphData,
            graphRes: this.state.graphRes
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
        graphData: this.state.graphData,
        graphRes: this.state.graphRes
      });
    }
  };

  showGraph = (data: string[]) => {
    let api = getApiConnection();
    data.forEach(sym => {
      if (this.state.graphRes === "weekly") {
        api.stocks.weekly(sym, { datatype: "json" }).then(data => {
          console.log(data);
        });
      } else {
        api.stocks.monthly(sym, { datatype: "json" }).then(data => {
          console.log(data);
        });
      }
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
    if (this.state.graphData != undefined)
      graphPopup = (
        <div className="graph">
          <button
            onClick={() => {
              this.setState({
                portfolioList: this.state.portfolioList,
                addFieldValue: this.state.addFieldValue,
                graphData: undefined,
                graphRes: this.state.graphRes
              });
            }}
          >
            X
          </button>
          <Line data={this.state.graphData} />
          <select
            value={this.state.graphRes}
            onChange={evt => {
              this.setState({
                portfolioList: this.state.portfolioList,
                addFieldValue: this.state.addFieldValue,
                graphData: this.state.graphData,
                graphRes: evt.target.value
              });
            }}
          >
            <option selected value="weekly">
              Weekly
            </option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      );

    return (
      <div>
        <div className="header">
          <button onClick={this.addPortfolio}> Add portfolio</button>
          <input
            onChange={evt => {
              this.setState({
                portfolioList: this.state.portfolioList,
                addFieldValue: evt.target.value,
                graphData: this.state.graphData,
                graphRes: this.state.graphRes
              });
            }}
            type="text"
            value={this.state.addFieldValue}
          />
        </div>
        <ul>{portfolios}</ul>
        {graphPopup}
      </div>
    );
  }
}

export default App;
