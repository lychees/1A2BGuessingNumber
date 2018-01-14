import React, { Component } from 'react';
import web3js from './web3';
import './App.css';

class App extends Component {
  state = {
    balance: 0,
  };

  componentDidMount() {
    this.syncLatestBalance();
    web3js.eth.filter('latest').watch(this.syncLatestBalance);
  }

  syncLatestBalance() {
    web3js.eth.getBalance(web3js.eth.coinbase, web3js.eth.defaultBlock, (e, balance) => {
      this.setState({
        balance,
      })
    })
  }

  render() {
    return (
      <div className="App">
        <p className="App-intro">
          Current Balance: {this.state.balance.toString()}
        </p>
      </div>
    );
  }
}

export default App;
