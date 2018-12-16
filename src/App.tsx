import React, { Component } from "react";
import "./App.css";
import { Portfolio, PortfolioProps } from "./component/Portfolio";
import AlphaVantage from "alphavantage-ts";

let API_CONN: AlphaVantage;

if (process.env.REACT_APP_API_KEY !== undefined)
  API_CONN = new AlphaVantage(process.env.REACT_APP_API_KEY);

export interface SpmsProps {
  portfolioList: PortfolioProps[];
}

class App extends Component<SpmsProps> {
  render() {
    const portfolios = this.props.portfolioList.map(item => (
      <Portfolio {...item} />
    ));

    return <ul>{portfolios}</ul>;
  }
}

export default App;
