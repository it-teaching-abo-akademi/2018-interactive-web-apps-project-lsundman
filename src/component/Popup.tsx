import React from "react";
import StorageBackedComponent from "./StorageBackedComponent";
import AlphaVantage from "alphavantage-ts";
import { Line } from "react-chartjs-2";
import { subDays, getDataPoints, dateToString, stringToDate } from "../helpers";

type PopupState = {
  graphStart: string;
  graphEnd: string;
  dataSeriesList: { [symbol: string]: { x: Date; y: number }[] };
};

type PopupProps = {
  shareList: string[];
  onCloseButtonClick: (() => void);
  apiConnection: AlphaVantage;
};

class Popup extends StorageBackedComponent<PopupState, PopupProps> {
  constructor(props: PopupProps) {
    super(props, () => {
      return {
        graphStart: dateToString(subDays(new Date(), 7)),
        graphEnd: dateToString(new Date()),
        dataSeriesList: {}
      };
    });
  }

  componentDidMount = () => {
    if (this.state.dataSeriesList === undefined) {
      this.updateDataSeries();
    }
  };

  updateDataSeries = () => {
    this.props.shareList.forEach(share => {
      getDataPoints(
        share,
        stringToDate(this.state.graphStart),
        stringToDate(this.state.graphEnd),
        this.props.apiConnection
      ).then(data => {
        this.setState({
          graphStart: this.state.graphStart,
          graphEnd: this.state.graphEnd,
          dataSeriesList: { ...this.state.dataSeriesList, [share]: data }
        });
      });
    });
  };

  getId = () => {
    return `SPMS-Popup-${btoa(this.props.shareList.toString())}`;
  };

  render() {
    let graphPopup = (
      <div>
        <button onClick={this.props.onCloseButtonClick}>X</button>
        <Line data={this.state.dataSeriesList} />
        <input
          type="date"
          value={this.state.graphStart}
          onChange={evt => {
            this.setState({
              graphStart: evt.target.value,
              graphEnd: this.state.graphEnd,
              dataSeriesList: this.state.dataSeriesList
            });
            this.updateDataSeries();
          }}
        />
        <input
          type="date"
          value={this.state.graphEnd}
          onChange={evt => {
            this.setState({
              graphStart: this.state.graphStart,
              graphEnd: evt.target.value,
              dataSeriesList: this.state.dataSeriesList
            });
            this.updateDataSeries();
          }}
        />
      </div>
    );

    return <div>{graphPopup}</div>;
  }
}

export default Popup;
