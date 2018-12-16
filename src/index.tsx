import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App, { SpmsProps } from "./App";
import * as serviceWorker from "./serviceWorker";

let data: SpmsProps = {
  portfolioList: [
    {
      name: "Portfolio 1",
      shareList: [
        { tickerSymbol: "AAPL", shareAmount: 10, sharePrice: 23.2 },
        { tickerSymbol: "MSFT", shareAmount: 20, sharePrice: 23.2 },
        { tickerSymbol: "NOK", shareAmount: 30, sharePrice: 23.2 }
      ]
    }
  ]
};

ReactDOM.render(<App {...data} />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
