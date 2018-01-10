pragma solidity ^0.4.18;
contract guessnumber {
    mapping(uint => uint) public answer;
    uint public seed = 2569;

    event NewGame();
    event Guess(uint A, uint B, uint C, uint D);
    event WrongAnswer(uint A, uint B);
    event Accepted(uint reward);

	// create a four-digit random number
	function newGame() {
		seed = block.timestamp+block.difficulty+block.number + 256;

		for (uint i=0;i<4;i++) {
            uint x = seed % 9;
            seed /= 10;
        	answer[i] = x+1;
		}
		NewGame();
	}

	function guessnumber() {
		newGame();
	}

	// enter a four-digit number and get a hint
	// A = count of digits that meet the right number
	// B = count of numbers that exist but at a wrong place
	// eg: if the answer is 1234, then 3254 = 2A1B
	function guess(uint _answer) payable returns(uint A,uint B){
		require(msg.value >= 10);

		uint[] memory guessanswer = new uint[](4);
		uint a = 0;
		uint b = 0;
		for (uint i=0; i<4; i++) {
			guessanswer[i] = _answer % 10;
			_answer /= 10;
		}
		Guess(guessanswer[0], guessanswer[1], guessanswer[2], guessanswer[3]);
		for (uint j=0;j<4;++j) {
			if (guessanswer[j] == answer[j]) {
				a += 1;
			}
			for (uint k=0;k<4;++k) {
				if (guessanswer[k] == answer[j]) {
					b += 1;
				}
			}
		}

		b -= a;
		if (a == 4) {
		    newGame();
            Accepted(this.balance / 2);
		    msg.sender.transfer(this.balance / 2);
		} else {
	    	WrongAnswer(a, b);
		}
		return (a,b);
	}
}