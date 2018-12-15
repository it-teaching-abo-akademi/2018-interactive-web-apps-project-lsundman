import React, { Component } from "react";
import "./App.css";
import { Portfolio } from "./component/Portfolio";
import AlphaVantage from "alphavantage-ts";

let API_CONN: AlphaVantage;

if (process.env.REACT_APP_API_KEY !== undefined)
  API_CONN = new AlphaVantage(process.env.REACT_APP_API_KEY);

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
    return (
      <Portfolio
        ref={this.portfolioRef}
        name="Portfolio 1"
        apiConnection={API_CONN}
      />
    );
  }
}

export default App;
