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
        <div class="collapse navbar-collapse" id="navbarsExampleDefault">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="http://example.com" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Game Mode</a>
              <div class="dropdown-menu" aria-labelledby="dropdown01">
                <a class="dropdown-item" href="#">Binary Search - PvE</a>
                <a class="dropdown-item" href="#">Binary Search - PvP</a>
                <a class="dropdown-item" href="#">1A2B - PvE</a>
                <a class="dropdown-item" href="#">1A2B - PvP</a>
              </div>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="http://example.com" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Network</a>
              <div class="dropdown-menu" aria-labelledby="dropdown01">
                <a class="dropdown-item" href="#">Ethereum Mainnet</a>
                <a class="dropdown-item" href="#">Ethereum Kovan testnet</a>
                <a class="dropdown-item" href="#">Qtum Testnet</a>
              </div>
            </li>
          </ul>
        </div>

        <div class="container">
          <h3>
            <p>
              游戏玩法: 玩家投币并上传 keccak256(seed, answer)，加入游戏。
              其中 seed 为玩家任意指定的随机数字，answer 为玩家所设计的 0-9 之间的答案。
              每有两名玩家加入游戏时，系统将自动为她们匹配房间。
              同一名玩家不可加入多个房间。
              加入房间后，玩家可以猜测别人的预设的数，或者返回对方猜数的结果，其中：
              <ul>
                <li>-1：小了。</li>
                <li>0：正确。</li>
                <li>1：大了。</li>
              </ul>
              猜测次数较小的玩家获胜。
              游戏结束时，双方玩家还需要上传最初 seed 和 answer 交给合约进行公正。
              当玩家作弊时直接判负。
            </p>

            <p>当前的状态: ---- </p>

            <p><input type="text" id="input-envidence" size="6" maxlength="6" value="0" /></p>
            <button class="btn btn-default btn-join" type="button" data-id="0">加入游戏</button>
            <p><input type="text" id="input-guess" size="6" maxlength="6" value="0" /></p>
            <button class="btn btn-default btn-guess" type="button" data-id="0">猜数字</button>
            <p><input type="text" id="input-answer" size="6" maxlength="6" value="0" /></p>
            <button class="btn btn-default btn-answer" type="button" data-id="0">回答</button>
            <p><input type="text" id="input-envidence-seed" size="6" maxlength="6" value="0" /></p>
            <p><input type="text" id="input-envidence-answer" size="6" maxlength="6" value="0" /></p>
            <button class="btn btn-default btn-reveal" type="button" data-id="0">上传答案</button>
          </h3>
        </div>
      </div>
    );
  }
}

export default App;
