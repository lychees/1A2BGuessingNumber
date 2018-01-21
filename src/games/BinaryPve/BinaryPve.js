import React from 'react';
import { Card, Button, InputNumber, Form, notification, Alert, Modal } from 'antd';

import { translateResult, isValidAnswer, etherFromWei } from 'utils/game';

import contractJson from 'contracts/BinaryPve.json';
import web3 from '../../web3'

import '../GuessNumber.css';

const contractAddress = '0x32163d30ed87fafd3bcc45f77cef437bf7bfd9b4';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const submitLayout={
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 16, offset: 8 },
  }
}

class BinaryPve extends React.Component {
  state = {
    bit: 0,
    answer: 0,
    answers: [],
    result: null,
    won: null,
    currentAnswer: null,
    prizePool: 0,
    award: 0,
  };

  componentDidMount() {
    notification.config({ placement: 'bottomRight' });

    this.contract = web3.eth.contract(contractJson.abi).at(contractAddress);

    this.syncEthInfo();
    web3.eth.filter('latest').watch(this.syncEthInfo);

    this.watchEvents();
  }

  syncEthInfo = () => {
    web3.eth.getBalance(contractAddress, (e, prizePool) => this.setState({ prizePool }));
  };

  watchEvents = () => {
    this.contract.Guess({})
      .watch((error, { args: { p: player, t: answer } }) => {
        console.log('guess', player, answer);
      });

    this.contract.WrongAnswer({ p: web3.eth.defaultAccount })
      .watch((error, { args: { p: player, z: result } }) => {
        console.log('WrongAnswer', player, result);
        this.getResult(Number(result.toString()));
      });

    this.contract.Accepted({ p: web3.eth.defaultAccount })
      .watch((error, { args: { p: player, z: award } }) => {
        console.log('Accepted', player, award, web3.eth.defaultAccount);
        this.gameOver(player === web3.eth.defaultAccount, award);
      });
  };

  guessNumber = ({ answer, bit }, callback) => {
    this.contract.guess(answer, {
      value: web3.fromWei(bit, 'wei'),
      gas: 220000,
    }, callback);
  };

  getResult = (result) => {
    console.log('getResult', result);
    this.setState({ result });
  };

  gameOver = (won, award) => {
    console.log('gameOver', won);

    this.setState({ won, award });
  };

  handleAnswerChange = answer => this.setState({ answer });
  handleBitChange = bit => this.setState({ bit });
  handleRestart = () => this.setState({ won: null });

  handleGuessNumber = () => {
    const { bit, answer, answers } = this.state;
    if (!isValidAnswer(answer, answers)) return;

    this.setState({
      result: null,
      guessNumberLoading: true,
      guessNumberSucceeded: false,
      guessNumberFailed: false,
    });
    this.guessNumber({ bit, answer }, (error, result) => {
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
        // TODO: Research how to decode result
        console.log('result', result);

        this.setState({
          currentAnswer: answer,
          answers: [...answers, answer],
          guessNumberLoading: false,
          guessNumberSucceeded: true,
        });
      };
    });
  };

  renderGuessNumber() {
    const { bit, answer, result, won, currentAnswer, answers, guessNumberLoading } = this.state;

    const disabled = guessNumberLoading
      || !isValidAnswer(answer, answers)
      || result === 0
      || won !== null
      || (currentAnswer != null && result == null);

    return (
      <Form>
        <Form.Item {...formItemLayout} label="奖池">
          <span>{etherFromWei(this.state.prizePool)} ETH</span>
        </Form.Item>
        <Form.Item {...formItemLayout} label="下注">
          <InputNumber type="text" value={bit} onChange={this.handleBitChange} />
        </Form.Item>
        <Form.Item {...formItemLayout} label="猜数">
          <InputNumber min={0} max={9} value={answer} onChange={this.handleAnswerChange} />
        </Form.Item>
        <Form.Item {...submitLayout}>
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
      guessNumberLoading,
      result,
      won,
      award,
    } = this.state;

    return (
      <Card className="GuessNumber">
        {this.renderGuessNumber()}
        <Modal
          title="恭喜!"
          visible={won}
          onCancel={this.handleRestart}
          footer={null}
        >
          您赢得了{etherFromWei(award)} ETH
        </Modal>
        <div className="AlertMessages">
          {guessNumberLoading ? <Alert message="正在提交答案..." /> : null}
          {result != null ? (
            <Alert
              type={result === 0 ? 'success' : 'error'}
              message="猜测结果为:"
              description={translateResult(result)}
            />
          ) : null }
          {won === false ? (
            <Alert
              type="error"
              message="你输了!"
            />
          ) : null}
        </div>
      </Card>
    )
  }
}

export default BinaryPve;
