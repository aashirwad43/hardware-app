import React, { Component } from "react";
import { Provider } from "react-redux";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

import NavigationBar from "./components/NavigationBar";

import store from "./store";
import SearchPage from "./pages/SearchPage";
import Qrcode from "./pages/Qrcode";

const defaultState = {
  authenticated: false,
  mode: "home",
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = defaultState;
  }

  componentDidMount() {
    let localState = JSON.parse(localStorage.getItem("state"));

    if (localState) {
      let expiry = localState.credentials.tokens.expiry;
      let now = Date.now();

      if (now < expiry) {
        this.setAuth();
      }
    }
  }

  setMode = (mode) => {
    this.setState({ ...this.state, mode });
  };

  setAuth = () => this.setState({ ...this.state, authenticated: true });

  getComponents() {
    let { mode } = this.state;
    let returnComponent;

    if (mode === "home") {
      returnComponent = <Home />;
    } else if (mode === "search") {
      returnComponent = <SearchPage />;
    } else if (mode === "profile") {
      returnComponent = <Profile />;
    } else if (mode === "qrcode") {
      returnComponent = <Qrcode />;
    }

    return (
      <React.Fragment>
        <NavigationBar setMode={this.setMode} />
        {returnComponent}
      </React.Fragment>
    );
  }

  render() {
    return (
      <Provider store={store}>
        <React.Fragment>
          {this.state.authenticated ? (
            this.getComponents()
          ) : (
            <Login setAuth={this.setAuth} />
          )}
        </React.Fragment>
      </Provider>
    );
  }
}

export default App;
