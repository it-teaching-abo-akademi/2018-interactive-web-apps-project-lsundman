import { Component } from "react";

abstract class StorageBackedComponent<TS, Props> extends Component<Props> {
  state: TS;
  storage = window.localStorage;
  defaultStateGet: () => TS;

  constructor(props: Props, defaultStateGet: () => TS) {
    super(props);
    this.defaultStateGet = defaultStateGet;
    this.state = this.defaultStateGet();
  }

  abstract getId(): string;

  componentWillMount = () => {
    this.setState(this.loadState());
  };

  componentWillUnmount = () => {
    this.saveState(this.state);
  };

  setState = (state: TS) => {
    super.setState(state);
    this.saveState(state);
  };

  loadState = () => {
    let stored = this.storage.getItem(this.getId());
    return stored != undefined ? JSON.parse(stored) : this.defaultStateGet();
  };

  saveState = (state: TS) => {
    this.storage.setItem(this.getId(), JSON.stringify(state));
  };
}

export default StorageBackedComponent;
