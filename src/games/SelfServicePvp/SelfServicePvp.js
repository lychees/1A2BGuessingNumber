import React from 'react';
import { Card, InputNumber, Form, Button, Divider, Input } from 'antd';

// import { translateResult, isValidAnswer, etherFromWei } from '../../utils/game';

import contractJson from '../../contracts/GuessGame3.json';
import web3 from '../../web3'

import '../GuessNumber.css';

var contract = web3.eth.contract(contractJson.abi).at('0x32163d30ed87fafd3bcc45f77cef437bf7bfd9b4');

class SelfServicePvp extends React.Component {

	state = {
		joinedGame: true,
		evidence: 0,
		canGuess: false,
		canReply: false,
		historyText: "safsadfsadf"+"\n"+"afsfa"+"\n"+"afsfa"+"\n"+"afsfa"+"\n"+"afsfa",
		inputNum: 0,
		guessResult: ""
	};

  componentDidMount() {

    contract.NewRoom({ p: web3.eth.defaultAccount })
		.watch(function(error, result){
		    console.log("Event are as following:-------");
		    
		    for(let key in result){
		     console.log(key + " : " + result[key]);
		    }
		    
		    console.log("Event ending-------");
		});

    contract.JoinRoom({ p: web3.eth.defaultAccount })
		.watch(function(error, result){
		});

    contract.Guess()
		.watch((error, { args: { p1: player1, p2: player2, s: guessnum } }) => { 
			this.dealWithGuessProcess(player1.toString(), player2.toString(), Number(guessnum.toString()), 0);
		});

    contract.WrongAnswer()
		.watch((error, { args: { p1: player1, p2: player2, z: hint } }) => {
			this.dealWithGuessProcess(player1.toString(), player2.toString(), Number(hint.toString()), 1);
		});

    contract.Accepted()
		.watch((error, { args: { p1: player1, p2: player2 } }) => {
			this.dealWithGuessProcess(player1.toString(), player2.toString(), 0, 2);
		});

    contract.Draw()
		.watch((error, { args: { p1: player1, p2: player2 } }) => {
			this.setState({ guessResult: "loading" });
		});

    contract.Win()
		.watch((error, { args: { p1: player1, p2: player2, r: rw} }) => {
			if(web3.eth.defaultAccount == player1) {
				this.setState({ guessResult: "you" });
			}else{
				this.setState({ guessResult: "other" });
			}
		});

  }

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
	 * buttons handle
	 */	

	joinGame() {
		 contract.join(this.state.evidence, 
		 	{ value: web3.fromWei("1", 'wei'),gas: 220000 }, 
		 	function(error, result){
			     if(!error)
			         console.log("result:"+result);
			     else
			         console.error(error);
			});
	}

	handleReplyClicked() {
		this.setState({ canReply: false });
		contract.answer(this.state.inputNum, 
		 	{ value: web3.fromWei("1", 'wei'),gas: 220000 }, 
		 	function(error, result){
		 		this.setState({
			      canReply: false
			    });
			});
	}

	handleGuessClicked() {
		this.setState({ canGuess: false });
		contract.guess(this.state.inputNum, 
		 	{ value: web3.fromWei("1", 'wei'),gas: 220000 }, 
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
						<Button type="primary" onClick={this.joinGame.bind(this)}> 加入游戏 </Button>
					</Form.Item>
				</Form>
	}

	renderGameProcess() {
		return <Form>
					<Form.Item>
						<textarea readonly="true" style={{width:300+"px", height:100+"px"}} rows="3" cols="5">
							{this.state.historyText}
						</textarea>
					</Form.Item>
					<Form.Item>
						<InputNumber type="text" value={this.state.inputNum} onChange={this.handleGuessnumChanged} />
						<Button type="primary" disabled={this.state.canGuess} onClick={this.handleGuessClicked.bind(this)}> 猜数 </Button>
						<Divider type="vertical" />
						<Button type="primary" disabled={this.state.canReply} onClick={this.handleReplyClicked.bind(this)}> 回答 </Button>
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