import React, { Component } from "react";

class AddForm extends Component<{
  addTicker: (tickerSymbol: string, shareAmount: number) => void;
  cancel: () => void;
}> {
  state: {
    tickerSymbol: string;
    shareAmount: number;
  };

  constructor(props: any) {
    super(props);
    this.state = { tickerSymbol: "", shareAmount: 1 };
  }

  render() {
    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          if (this.state.tickerSymbol !== "" && this.state.shareAmount !== 0)
            this.props.addTicker(
              this.state.tickerSymbol,
              this.state.shareAmount
            );
        }}
      >
        <label>
          Ticker symbol
          <input
            type="text"
            value={this.state.tickerSymbol}
            onChange={e => {
              this.setState({ tickerSymbol: e.target.value });
            }}
          />
        </label>
        <label>
          Quantity
          <input
            type="number"
            value={this.state.shareAmount}
            onChange={e => {
              this.setState({ shareAmount: e.target.value });
            }}
          />
        </label>
        <input type="submit" value="Submit" />
        <button onClick={() => this.props.cancel()}>Cancel</button>
      </form>
    );
  }
}

export default AddForm;
