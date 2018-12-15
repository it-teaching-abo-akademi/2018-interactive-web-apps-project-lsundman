import React, { Component, Props } from "react";
import "./App.css";
import { Portfolio, PortfolioProps } from "./component/Portfolio";
import AlphaVantage from "alphavantage-ts";

const API_CONN = new AlphaVantage("9LUUJN34EO841037");

class App extends Component {
  portfolioRef: React.RefObject<Portfolio>;

  constructor(props: any) {
    super(props);
    this.portfolioRef = React.createRef<Portfolio>();
  }

  componentDidMount = () => {
    let portfolio = this.portfolioRef.current;
    if (portfolio != null) {
      portfolio.addTicker("AAPL", 10);
      portfolio.addTicker("MSFT", 20);
      portfolio.addTicker("NOK", 30);
    }
  };

  render() {
    return <Portfolio ref={this.portfolioRef} apiConnection={API_CONN} />;
  }
}

export default App;
