import { Component } from "react";
import { Line, ChartData } from "react-chartjs-2";

class Popup extends Component<{ data: any }> {
  render() {
    return (
      <div className="spms-popup">
        <Line data={...this.props.data} />
      </div>
    );
  }
}
