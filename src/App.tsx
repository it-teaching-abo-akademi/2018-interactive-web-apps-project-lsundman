import React from "react";
import "./App.css";
import { Portfolio } from "./component/Portfolio";
import AlphaVantage from "alphavantage-ts";
import StorageBackedComponent from "./component/StorageBackedComponent";
import Popup from "./component/Popup";

let API_CONN = new AlphaVantage("9LUUJN34EO841037");

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

  addPortfolio = (evt: any) => {
    evt.preventDefault();
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

    popup =
      this.state.graphList.length > 0 ? (
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
      ) : null;

    return (
      <div>
        <form onSubmit={this.addPortfolio}>
          <input
            className="add-portfolio-field"
            onChange={evt => {
              this.setState({
                portfolioList: this.state.portfolioList,
                addFieldValue: evt.target.value,
                graphList: this.state.graphList
              });
            }}
            type="text"
            value={this.state.addFieldValue}
            placeholder="Enter portfolio name here and press enter"
          />
        </form>
        {popup}
        <ul>{portfolios}</ul>
      </div>
    );
  }
}

export default App;
