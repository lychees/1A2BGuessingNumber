import React, { Component } from 'react';
import _ from 'lodash';
import { Layout, Select } from 'antd';
import web3js from './web3';

import games from './games';
import { networks } from './constants/game';
import GameRule from './components/GameRule';

import './App.css';
import { etherFromWei } from "./utils/game";

const { Header, Content, Footer } = Layout;

class App extends Component {
  state = {
    balance: 0,
    gameMode: games.default.modeName,
    GameComponent: games.default,
    network: 0,
  };

  componentDidMount() {
    web3js.eth.defaultAccount = web3js.eth.accounts[0];
    this.syncEthInfo();
    // TODO: setTimeout to check if watch succeed
    // If not, prompt user to reopen browser
    web3js.eth.filter('latest').watch(this.syncEthInfo);
  }

  handleGameModeChange = (gameMode) => {
    this.setState({
      gameMode,
      GameComponent: _.find(games, ['modeName', gameMode]) || games.default,
    });
  };

  syncEthInfo = () => {
    web3js.eth.getBalance(web3js.eth.coinbase, (e, balance) => this.setState({ balance }));
    web3js.version.getNetwork((e, network) => this.setState({ network }));
  };

  render() {
    return (
      <Layout className="App">
        <Header className="Header">
          <span className="Balance">
            {etherFromWei(this.state.balance)} ETH
          </span>
          <span>
            {networks[this.state.network] || 'Unknown Network'}
          </span>
          <span className="Settings">
            <Select className="GameModeSelect" value={this.state.gameMode} onChange={this.handleGameModeChange}>
              {games.map(({ modeName }) => <Select.Option key={modeName} value={modeName}>{modeName}</Select.Option>)}
            </Select>
          </span>
        </Header>
        <Content className="Content">
          <this.state.GameComponent />
        </Content>
        <Footer>
          <GameRule desc={this.state.GameComponent.gameRule} />
        </Footer>
      </Layout>
    );
  }
}

export default App;
