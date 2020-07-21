import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import Login  from './Login';
import { HardwareList } from './HardwareList';
import { About } from './About';
import { Profile } from './Profile';
import { NoMatch } from './NoMatch';
import { Layout } from './components/Layout';
import { NavigationBar } from './components/NavigationBar';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      access:'',
      refresh:''
    }
  };

  setToken = (access, refresh) => {this.setState({access,refresh})};

  render () {
    return (
      <React.Fragment>
        <NavigationBar />
        <Layout>
          <Router>
            <Switch>
              <Route exact path="/" render = {() => {
                return(
                  <Login setToken={this.setToken}/>
                )
              }} />
              <Route path="/home" component={Home} />
              <Route path="/hardware-list" component={HardwareList} />
              <Route path="/about" component={About} />
              <Route path="/profile" component={ Profile } />
              <Route component={NoMatch} />
            </Switch>
          </Router>
        </Layout>
      </React.Fragment>
    );
  }
  
}

export default App;
