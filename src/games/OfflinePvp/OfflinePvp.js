import React from 'react';
import { Card, Button, InputNumber, Form, notification, Alert } from 'antd';

import { calcResult, translateResult, isValidAnswer } from '../../utils/game';

import web3 from '../../web3'
import contractJson from 'contracts/_1a2bPve.json';

import '../GuessNumber.css';

class OfflinePvp extends React.Component {
  state = {
    puzzle: 0,
    answer: 0,
    answers: [],
    resultsForOpponent: [],
    answersOfOpponent: [],
    roomAddress: null,
    result: null,
    won: null,
    currentPuzzle: null,
    currentAnswer: null,
  };

  componentDidMount() {
    notification.config({ placement: 'bottomRight' });

    // TODO: listen to guessNumber event and game over event
    this.interval = setInterval(() => {
      console.log(this.state.currentAnswer, this.state.answers);
      if (this.state.currentPuzzle != null && this.state.currentAnswer != null) {
        // use own answer as opponent's answer to give result to opponent
        const mockAnswerOfOpponent = this.state.currentAnswer;
        if (isValidAnswer(mockAnswerOfOpponent, this.state.answersOfOpponent)) {
          const resultForOpponent = this.giveResult(mockAnswerOfOpponent);

          // use result for opponent as own result
          this.getResult(resultForOpponent);
        }
      }

      if (this.state.won == null) {
        // end game after 5 guesses
        if (this.state.answers.length) {
          this.gameOver(Math.random() > 0.5);
        }
        // or after result is right
        if (this.state.result === 0) {
          this.gameOver(true);
        }
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  createRoom = (puzzle, callback) => {
    // TODO: call web3 method to create room;
    console.log('createRoom', puzzle);
    setTimeout(() => callback(Math.random() > 0.5, '0x111'), 1000);
  };

  joinGame = (puzzle, callback) => {
    // TODO: call web3 method to join game;
    console.log('joinGame', puzzle);
    var MyContract = web3.eth.contract(contractJson.abi);
    var contractInstance = MyContract.at('0x32163d30ed87fafd3bcc45f77cef437bf7bfd9b4');
    console.log(web3.version.defaultAccount);
    contractInstance.guess(1, { value: web3.toWei('1', 'mwei'), data: 12312, gas: 220000 }, console.log);

    setTimeout(() => callback(Math.random() > 0.5, '0x222'), 1000);
  };

  guessNumber = (answer, callback) => {
    // TODO: call web3 method to guess number;
    console.log('guessNumber', answer, this.state.answers);
    setTimeout(() => callback(Math.random() > 0.5), 1000);
  };

  giveResult = (answerOfOpponent) => {
    const { puzzle, resultsForOpponent, answersOfOpponent } = this.state;
    const resultForOpponent = calcResult(answerOfOpponent, puzzle);
    notification.open({
      message: `对手第${resultsForOpponent.length + 1}猜测`,
      description: `对手猜是: ${answerOfOpponent}, 结果是: ${translateResult(resultForOpponent)}`,
    });
    this.setState({
      resultsForOpponent: [...resultsForOpponent, resultForOpponent],
      answersOfOpponent: [...answersOfOpponent, answerOfOpponent],
    });

    // TODO: call web3 method to give back result;
    console.log('giveResult', answerOfOpponent, resultForOpponent);
    return resultForOpponent;
  };

  getResult = (result) => {
    console.log('getResult', result);
    this.setState({ result });
  };

  gameOver = (won) => {
    console.log('gameOver', won);
    this.setState({ roomAddress: null, won });
  };

  handlePuzzleChange = puzzle => this.setState({ puzzle });
  handleAnswerChange = answer => this.setState({ answer });

  handleCreateRoom = () => {
    const { roomAddress, puzzle } = this.state;
    if (roomAddress) return;

    this.setState({
      createRoomLoading: true,
      createRoomSucceeded: false,
      createRoomFailed: false,
    });
    this.createRoom(puzzle, (error, roomAddress) => {
      if (error) {
        notification.open({
          message: '创建房间失败',
          description: '请尝试重新加入游戏',
        });
        this.setState({
          createRoomLoading: false,
          createRoomFailed: true,
        });
      } else {
        this.setState({
          roomAddress,
          currentPuzzle: puzzle,
          createRoomLoading: false,
          createRoomSucceeded: true,
        });
      }
    });
  };

  handleJoinGame = () => {
    const { roomAddress, puzzle } = this.state;
    if (roomAddress) return;

    this.setState({
      won: null,
      joinGameLoading: true,
      joinGameSucceeded: false,
      joinGameFailed: false,
    });
    this.joinGame(puzzle, (error, roomAddress) => {
      if (error) {
        notification.open({
          message: '加入游戏失败',
          description: '尝试创建房间',
        });
        this.setState({
          joinGameLoading: false,
          joinGameFailed: true,
        }, this.handleCreateRoom);
      } else {
        this.setState({
          roomAddress,
          currentPuzzle: puzzle,
          joinGameLoading: false,
          joinGameSucceeded: true,
        });
      }
    });
  };

  handleGuessNumber = () => {
    const { answer, answers } = this.state;
    if (!isValidAnswer(answer, answers)) return;

    this.setState({
      result: null,
      guessNumberLoading: true,
      guessNumberSucceeded: false,
      guessNumberFailed: false,
    });
    this.guessNumber(answer, (error) => {
      if (error) {
        notification.open({
          message: '提交答案失败',
          description: '请尝试重新提交',
        });
        this.setState({
          guessNumberLoading: false,
          guessNumberFailed: true,
        });
      } else {
        this.setState({
          currentAnswer: answer,
          answers: [...answers, answer],
          guessNumberLoading: false,
          guessNumberSucceeded: true,
        });
      };
    });
  };

  renderJoinGame() {
    const { won, puzzle, joinGameLoading, createRoomLoading } = this.state;
    return (
      <Form>
        <Form.Item label="我的谜题">
          <InputNumber value={puzzle} onChange={this.handlePuzzleChange} />
        </Form.Item>
        <Form.Item>
          <Button loading={joinGameLoading || createRoomLoading} type="primary" onClick={this.handleJoinGame}>
            {won == null ? (createRoomLoading ? '创建房间' : '加入游戏') : '再来一局'}
          </Button>
        </Form.Item>
      </Form>
    )
  }

  renderGuessNumber() {
    const { answer, result, won, currentAnswer, answers, guessNumberLoading } = this.state;

    const disabled = guessNumberLoading
      || !isValidAnswer(answer, answers)
      || result === 0
      || won !== null
      || (currentAnswer != null && result == null);

    return (
      <Form>
        <Form.Item label="我的猜测">
          <InputNumber value={answer} onChange={this.handleAnswerChange} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            loading={guessNumberLoading}
            disabled={disabled}
            onClick={this.handleGuessNumber}
          >
            提交答案
          </Button>
        </Form.Item>
      </Form>
    )
  }

  render() {
    const {
      roomAddress,
      joinGameLoading,
      createRoomLoading,
      guessNumberLoading,
      result,
      won,
    } = this.state;
    
    return (
      <Card className="GuessNumber">
        {roomAddress ? this.renderGuessNumber() : this.renderJoinGame()}
        <div className="AlertMessages">
          {joinGameLoading ? <Alert message="正在加入房间..." /> : null}
          {createRoomLoading ? <Alert message="正在创建房间..." /> : null}
          {guessNumberLoading ? <Alert message="正在提交答案..." /> : null}
          {result != null ? (
            <Alert
              type={result === 0 ? 'success' : 'error'}
              message="猜测结果为:"
              description={translateResult(result)}
            />
          ) : null }
          {won != null ? (
            <Alert
              type={won ? 'success' : 'error'}
              message={won ? '你赢了!' : '你输了!'}
            />
          ) : null}
        </div>
      </Card>
    )
  }
}

export default OfflinePvp;
