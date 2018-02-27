import React from 'react';
import { Card, InputNumber, Form, Button, Divider, Input, notification } from 'antd';

// import { translateResult, isValidAnswer, etherFromWei } from '../../utils/game';

import contractJson from '../../contracts/GuessGame3.json';
import web3 from '../../web3'

import '../GuessNumber.css';

var contract = web3.eth.contract(contractJson.abi).at('0xf25186b5081ff5ce73482ad761db0eb0d25abfbf');

class SelfServicePvp extends React.Component {

	state = {
		joinedGame: false,
		evidence: 0,
		canGuess: false,
		canReply: false,
		historyText: "",
		inputNum: 0,
		guessResult: "",
		isLoading: false
	};

  componentDidMount() {
  	var that = this;

    contract.NewRoom({ p: web3.eth.defaultAccount })
		.watch(function(error, result){
		    // console.log("Event are as following:-------");
		    // for(let key in result){
		    //  console.log(key + " : " + result[key]);
		    // }
		    // console.log("Event ending-------");
		    that.setState({ joinedGame: true });
		    that.setState({ historyText: "你创建了房间，正在等待其他玩家…" });
		});

    contract.JoinRoom({ p: web3.eth.defaultAccount })
		.watch(function(error, result){
		    // console.log("Event ending-----JoinRoom--");
		    that.setState({ joinedGame: true, canGuess: true });
		    that.setState({ historyText: "你进入了房间，游戏开始。" });
		});

    contract.Guess()
		.watch((error, { args: { p1: player1, p2: player2, s: guessnum } }) => { 
			that.dealWithGuessProcess(player1.toString(), player2.toString(), Number(guessnum.toString()), 0);
		});

    contract.WrongAnswer()
		.watch((error, { args: { p1: player1, p2: player2, z: hint } }) => {
			that.dealWithGuessProcess(player1.toString(), player2.toString(), Number(hint.toString()), 1);
		});

    contract.Accepted()
		.watch((error, { args: { p1: player1, p2: player2 } }) => {
			that.dealWithGuessProcess(player1.toString(), player2.toString(), 0, 2);
		});

    contract.Draw()
		.watch((error, { args: { p1: player1, p2: player2 } }) => {
			that.setState({ guessResult: "loading" });
		});

    contract.Win()
		.watch((error, { args: { p1: player1, p2: player2, r: rw} }) => {
			if(web3.eth.defaultAccount == player1) {
				that.setState({ guessResult: "you" });
			}else{
				that.setState({ guessResult: "other" });
			}
		});

  }

	/**
	 * 文本框展示互相猜数字过程
	 */
	dealWithGuessProcess(player1, player2, num, type) {
		var text = this.state.historyText;
		switch(type) 
		{
			case 0:
				if(web3.eth.defaultAccount == player1) {
					text += "你猜了："+num+"\n";
				}else{
					text += "对方猜了："+num+"\n";
					this.setState({ canReply: true });
				}
				break;
			case 1:
				text += "对方提示："+num+"\n";
				this.setState({ canGuess: true });
				break;
			case 2:
				if(web3.eth.defaultAccount == player1) {
					text += "你接受了对方的猜测"+"\n";
				}else{
					text += "对方接受了你的猜测"+"\n";
				}
				break;
			default:
				return;
		}
		this.setState({ historyText: text });
	}

	/**
	 * 处理合约返回的错误
	 */
	dealWithError(error) {
		console.log(error);
        notification.open({
          message: '提交失败',
          description: '请尝试重新提交',
        });
	}

  /**
	 * buttons handle
	 */	

	joinGame() {
		this.setState({ isLoading: true });
		var that = this;
		console.log(this.state.evidence)
		var s = web3.sha3(this.state.evidence.toString());
		console.log(s)
		 contract.join(s, 
		 	{ gas: 220000, value:web3.fromWei(111, 'wei') }, 
		 	function(error, result){
				that.setState({ isLoading: false });
			    if (error) {
			    	that.dealWithError(error);
			    } else {
			    };
			});
	}

	


	handleReplyClicked() {
		this.setState({ canReply: false });
		contract.answer(web3.toHex(this.state.inputNum), 
		 	{ gas: 220000 }, 
		 	function(error, result){
		 		this.setState({
			      canReply: false
			    });
			});
	}

	handleGuessClicked() {
		this.setState({ canGuess: false });
		contract.guess(this.state.inputNum, 
		 	{ gas: 220000 }, 
		 	function(error, result){
		 		this.setState({
			      canGuess: false
			    });
			});
	}

	/**
	 * inputs change handle
	 */	

	handleEvidenceChanged = evidence => this.setState({ evidence });
	
	handleGuessnumChanged = inputNum => this.setState({ inputNum });

	/**
	 * render
	 */	

	renderRoom() {
		return  <Form>
					<Form.Item label="输入一个数字">
						<InputNumber type="text" value={this.state.evidence} onChange={this.handleEvidenceChanged} />
					</Form.Item>
					<Form.Item>
						<Button type="primary" onClick={this.joinGame.bind(this)} disabled={this.state.isLoading}> 加入游戏 </Button>
					</Form.Item>
				</Form>
	}

	renderGameProcess() {
		return <Form>
					<Form.Item>
						<textarea readOnly="true" style={{width:300+"px", height:100+"px"}} rows="3" cols="5" value={this.state.historyText}>
						</textarea>
					</Form.Item>
					<Form.Item>
						<InputNumber type="text" value={this.state.inputNum} onChange={this.handleGuessnumChanged} />
						<Button type="primary" disabled={!this.state.canGuess} onClick={this.handleGuessClicked.bind(this)}> 猜数 </Button>
						<Divider type="vertical" />
						<Button type="primary" disabled={!this.state.canReply} onClick={this.handleReplyClicked.bind(this)}> 回答 </Button>
					</Form.Item>
				</Form>
	}

	renderMain() {
		if (this.state.guessResult == "loading") {
			return <a>正在结算结果……</a>
		}else if (this.state.guessResult == "you") {
			return <a>你赢了</a>
		}else if (this.state.guessResult == "other") {
			return <a>对方赢了</a>
		}
		if (this.state.joinedGame) {
			return this.renderGameProcess()
		}
		return this.renderRoom()
	}

	render() {
	    return (
	      <Card className="GuessNumber">

			{this.renderMain()}

	      </Card>
	    )
	  }

}

export default SelfServicePvp;