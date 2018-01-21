pragma solidity ^0.4.18;
contract BinaryPve {
    uint public answer; // Should be private
    uint public seed;


    /**
     * Create a 0-9 random number.
     */
    event NewGame(uint answer); // Start a new game a answer.

	function newGame() internal {
		seed = block.timestamp + block.difficulty + block.number + 256;
        answer = seed % 10;
        NewGame(answer);
	}

    /**
     * Constructs funcion.
     */

    function BinaryPve() public {
		newGame();
	}



    /**
     * Make a guess t, and return a result.
     * -1: t < answer
     *  0: correct.
     *  1: t > answer
     */

    event Guess(address p, uint t); // Player p make a guess t.
    event WrongAnswer(address p, int z); // Player p get a WrongAnswer with hint z.
    event Accepted(address p, uint z); // Player p get Accepted and won z as reward.


	function guess(uint t) payable public returns(int z){
		require(msg.value >= 10);
		Guess(msg.sender, t);
        if (t < answer) {
            WrongAnswer(msg.sender, -1);
            return -1;
        } else if (t > answer) {
            WrongAnswer(msg.sender, 1); // event
            return 1;
        }
        newGame();
        Accepted(msg.sender, this.balance / 2); // event
        msg.sender.transfer(this.balance / 2);
        return 0;
	}


}