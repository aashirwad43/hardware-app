import React, { Component } from 'react';
import { Provider } from 'react-redux';

import Home from './pages/Home';
import Login  from './pages/Login';
import About from './pages/About';
import Profile from './pages/Profile';

import NavigationBar from './components/NavigationBar';

import store from './store';

const defaultState = {
  authenticated:false,
  mode:"home"
}

class App extends Component {
  constructor(props){
    super(props)
    this.state = defaultState;
  };

  setMode = (mode) => {
    this.setState({...this.state, mode});
  }

  setAuth = () => this.setState({ ...this.state, authenticated:true });

  getComponents() {
    let { mode } = this.state
    let returnComponent;

    if (mode === "home") {
      returnComponent = (<Home />)
    }
    else if (mode === "profile") {
      returnComponent = (<Profile />)
    }
    else if (mode === "about") {
      returnComponent = (<About />)
    }

    return (
      <React.Fragment>
        <NavigationBar setMode={ this.setMode }/>
        { returnComponent }
      </React.Fragment>
    )
  }

  render () {
    return (
      <Provider store={store}>
        <React.Fragment>
            { this.state.authenticated ? this.getComponents() : <Login setAuth={this.setAuth}/> }
        </React.Fragment>
      </Provider>
    );
  }
  
}

export default App;

