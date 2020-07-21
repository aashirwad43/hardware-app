import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Login  from './pages/Login';
import { HardwareList } from './pages/HardwareList';
import { About } from './pages/About';
import { Profile } from './pages/Profile';
import { NoMatch } from './NoMatch';
import { Layout } from './components/Layout';
import { NavigationBar } from './components/NavigationBar';

const defaultState = {
  authentication:{
    access:'',
    refresh:''
  },
  authenticated:false,
  mode:"home"
}

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      authentication:{
        access:'',
        refresh:''
      },
      authenticated:false,
      mode:"home"
    }
  };

  // shouldComponentUpdate(nextProps, nextState){
  //   console.log("prevent re render", nextProps, nextState)
  //   return false
  // }

  setToken = (access, refresh) => {this.setState({authentication:{access:`Bearer ${access}`, refresh}, authenticated:true})};
  
  killSession = () => this.setState(defaultState);

  getComponents() {
    let { mode } = this.state
    let returnComponent;

    if (mode === "home") {
      returnComponent = (<Home creds={ this.state.authentication }/>)
    }

    return (
      <React.Fragment>
        <NavigationBar killSession={ this.killSession } />
        { returnComponent }
      </React.Fragment>
    )
  }

  render () {
    return (
      <React.Fragment>
        <Layout>
          { this.state.authenticated ? this.getComponents() : <Login setToken={this.setToken}/> }
        </Layout>
      </React.Fragment>
    );
  }
  
}

export default App;
