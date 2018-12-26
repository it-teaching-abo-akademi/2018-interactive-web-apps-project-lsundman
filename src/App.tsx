import React from "react";
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
  graphList: string[];
};

class App extends StorageBackedComponent<SpmsState, {}> {
  constructor(props: any) {
    super(props, () => {
      return {
        portfolioList: [],
        addFieldValue: "",
        graphList: []
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
            graphList: this.state.graphList
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
        graphList: this.state.graphList
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
        onGraphShow={data => {
          this.setState({
            portfolioList: this.state.portfolioList,
            addFieldValue: this.state.addFieldValue,
            graphList: data
          });
        }}
      />
    ));

    let popup;

    if (this.state.graphList.length > 0) {
      popup = (
        <div className="graph">
          <Popup
            shareList={this.state.graphList}
            apiConnection={getApiConnection()}
            onCloseButtonClick={() => {
              this.setState({
                portfolioList: this.state.portfolioList,
                addFieldValue: this.state.addFieldValue,
                graphList: []
              });
            }}
          />
        </div>
      );
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
                graphList: this.state.graphList
              });
            }}
            type="text"
            value={this.state.addFieldValue}
          />
        </div>
        <ul>{portfolios}</ul>
        {popup}
      </div>
    );
  }
}

export default App;
