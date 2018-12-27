import React, { Component, Props } from "react";
import AlphaVantage from "alphavantage-ts";
import { Line } from "react-chartjs-2";
import { subDays, getDataPoints, dateToString, days } from "../helpers";

type PopupState = {
  graphStart: string;
  graphEnd: string;
  labels: string[];
  dataSetsList: { label: string; data: number[] }[];
};

type PopupProps = {
  shareList: string[];
  onCloseButtonClick: (() => void);
  apiConnection: AlphaVantage;
};

class Popup extends Component<PopupProps, PopupState> {
  constructor(props: PopupProps) {
    super(props);

    let dateA = dateToString(subDays(new Date(), 7));
    let dateB = dateToString(new Date());
    let labels = days(dateA, dateB);

    this.state = {
      graphStart: dateA,
      graphEnd: dateB,
      labels: labels,
      dataSetsList: []
    };
  }

  componentWillMount = () => {
    this.updateData();
  };

  componentDidUpdate = (prevProps: PopupProps) => {
    if (prevProps.shareList != this.props.shareList) {
      this.setState({
        graphStart: this.state.graphStart,
        graphEnd: this.state.graphEnd,
        labels: this.state.labels,
        dataSetsList: []
      });
      this.updateData();
    }
  };

  updateData = () => {
    this.props.shareList.forEach(share => {
      getDataPoints(share, this.state.labels).then(data => {
        this.setState({
          graphStart: this.state.graphStart,
          graphEnd: this.state.graphEnd,
          labels: this.state.labels,
          dataSetsList: [
            ...this.state.dataSetsList,
            { label: share, data: data }
          ]
        });
      });
    });
  };

  render() {
    return (
      <div className="graph">
        <button onClick={this.props.onCloseButtonClick}>X</button>
        <Line
          data={{
            labels: this.state.labels,
            datasets: this.state.dataSetsList
          }}
          options={{ spanGaps: true }}
          redraw={true}
        />
        <input
          type="date"
          value={this.state.graphStart}
          onChange={evt => {
            this.setState({
              graphStart: evt.target.value,
              graphEnd: this.state.graphEnd,
              labels: days(evt.target.value, this.state.graphStart),
              dataSetsList: this.state.dataSetsList
            });
            this.updateData();
          }}
        />
        <input
          type="date"
          value={this.state.graphEnd}
          onChange={evt => {
            this.setState({
              graphStart: this.state.graphStart,
              graphEnd: evt.target.value,
              labels: days(this.state.graphStart, evt.target.value),
              dataSetsList: this.state.dataSetsList
            });
            this.updateData();
          }}
        />
      </div>
    );
  }
}

export default Popup;
