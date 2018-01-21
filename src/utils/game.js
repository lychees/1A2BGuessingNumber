import web3 from '../web3';

export const translateResult = result => result === 0 ? '正确' : (result > 0 ? '大了' : '小了');

export const calcResult = (answerOfOpponent, puzzle) => {
  if (answerOfOpponent < puzzle) {
    return -1;
  }

  if (answerOfOpponent > puzzle) {
    return 1;
  }

  return 0;
};

export const isValidAnswer = (answer, answers) => !answers.includes(answer);

export const etherFromWei = num => web3.fromWei(num, 'ether').toString();
