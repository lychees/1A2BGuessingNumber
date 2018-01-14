import React, { Component } from 'react';
import { Layout, Select } from 'antd';
import web3js from './web3';

import { networks, gameModes } from './constants/game';
import GameRule from './components/GameRule';
import GuessNumber from "./components/GuessNumber";

import './App.css';

const { Header, Content, Footer } = Layout;

class App extends Component {
  state = {
    balance: 0,
    gameMode: gameModes.default,
    network: networks.default,
  };

  componentDidMount() {
    this.syncLatestBalance();
    web3js.eth.filter('latest').watch(this.syncLatestBalance);
  }

  handleGameModeChange = (gameMode) => this.setState({ gameMode });
  handleNetworkChange = (network) => {
    // do sth and call setState in callback
    setTimeout(() => this.setState({ network }));
  };

  syncLatestBalance = () => {
    web3js.eth.getBalance(web3js.eth.coinbase, web3js.eth.defaultBlock, (e, balance) => {
      this.setState({
        balance,
      })
    })
  };

  render() {
    return (
      <Layout className="App">
        <Header className="Header">
          <span className="Balance">
            {this.state.balance.toString()}
          </span>
          <span className="Settings">
            <Select className="GameModeSelect" value={this.state.gameMode} onChange={this.handleGameModeChange}>
              {gameModes.map(gameMode => <Select.Option key={gameMode} value={gameMode}>{gameMode}</Select.Option>)}
            </Select>
            <Select className="NetworkSelect" value={this.state.network} onChange={this.handleNetworkChange}>
              {networks.map(network => <Select.Option key={network} value={network}>{network}</Select.Option>)}
            </Select>
          </span>
        </Header>
        <Content className="Content">
          <GuessNumber />
        </Content>
        <Footer>
          <GameRule />
        </Footer>
      </Layout>
    );
  }
}

export default App;
