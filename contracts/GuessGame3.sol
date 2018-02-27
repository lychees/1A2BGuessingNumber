pragma solidity ^0.4.18;

contract GuessGame3 {
    
  /**
   * Constructs funcion.
   */    
	function GuessGame3() public {
	}
	
  mapping(address => address) opp; // 对手
  mapping(address => uint) bal; // 余额
  mapping(address => bytes32) evi; // 证据
  mapping(address => uint) evi_seed; // 证据-种子  
  mapping(address => uint) evi_ans; // 证据-答案
  mapping(address => uint[]) gus; // 询问列表
  mapping(address => int[]) ans; // 获得的答案列表
  address unmatched_player;
	
	/**
	 * Join a new game. 
	 */
  event NewRoom(address p, bytes32 e); // Player p create with a new room with an evidence e.
  event JoinRoom(address p1, address p2, bytes32 e); // Player p1 join player p2's room with an evidence e.
	function join(bytes32 e) payable public{
    require(opp[msg.sender] == 0); // 不在游戏房间中
    require(msg.value > 10); // 最低赌注
    bal[msg.sender] = msg.value;
    evi[msg.sender] = e;
    if (unmatched_player != 0) { // 已经有等待的玩家
        opp[msg.sender] = unmatched_player;
        opp[unmatched_player] = msg.sender;
        JoinRoom(msg.sender, unmatched_player, e);
        unmatched_player = 0;
    } else {
        unmatched_player = msg.sender;
        NewRoom(msg.sender, e);
	    }
	}
	
	/**
	 * Game logic. 
	 */	
  event Guess(address p1, address p2, uint s); // Player p1 make a guess s for p2's puzzle.
  event WrongAnswer(address p1, address p2, int z); // Player p1 get a WrongAnswer with hint z in p2's puzzle.
  event Accepted(address p1, address p2); // Player p1 get Accepted in p2's puzzle.    
	function guess(uint s) public payable{
    address p1 = msg.sender;
    address p2 = opp[p1];    
    require(p2 != 0);
    require(ans[p1].length == 0 || ans[p1][ans[p1].length - 1] != 0);
    Guess(p1, p2, s);
    gus[p1].push(s);
	}
  function answer(int z) public payable{
    address p1 = msg.sender;
    address p2 = opp[p1];
    require(p2 != 0);
    require(ans[p2].length < gus[p2].length);
    ans[p2].push(z);
    if (z == 0){
      Accepted(p2, p1);
      if (ans[p1][ans[p1].length - 1] == 0){ // Both player finish his game.
        end(p1);
      } else if (ans[p1].length > ans[p2].length){ // p2 win.
        end(p1);
      }      
    } else {
      WrongAnswer(p2, p1, z);
      if (ans[p1][ans[p1].length - 1] == 0 && ans[p2].length > ans[p1].length){ // p2 lose.
        end(p1);
      }
    }
  }

  function reveal(uint s, uint a) public{
    evi_seed[msg.sender] = s;
    evi_ans[msg.sender] = a;    
  }
  function cmp(uint a, uint b) internal pure returns(int z){
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }
  function judge(address p1) internal view returns(bool z){ 
    if (keccak256(evi_seed[p1], evi_ans[p1]) == evi[p1]) return false;
    address p2 = opp[p1];
    for (uint i=0; i<gus[p2].length; ++i) {
      if (ans[p2][i] != cmp(gus[p2][i], evi_ans[p1])) return false;
    }
    return true;
    // To do, is legal?
  }
  event Win(address p1, address p2, uint r); // Player p1 win r from p2.
  event Draw(address p1, address p2); // There is a draw between p1 and p2. 
  function end(address p1) internal {
    require(evi_seed[p1] != 0);
    require(evi_ans[p1] != 0);    
    require(evi_seed[p2] != 0);
    require(evi_ans[p2] != 0);  
    bool j1 = judge(p1);
    bool j2 = judge(p2);
    address p2 = opp[p1];
    uint r1 = bal[p1];
    uint r2 = bal[p2];    
    uint r = r1 + r2;
    opp[p1] = 0; opp[p2] = 0;    
    bal[p1] = 0; bal[p2] = 0;

    if (!j1 && !j2) {
      p1.transfer(r1);
      p2.transfer(r2);
      Draw(p1, p2);
    } else if (!j2 || ans[p1].length < ans[p2].length) {
      p1.transfer(r);
      Win(p1, p2, r);
    } else if (!j1 || ans[p1].length > ans[p2].length) {
      p2.transfer(r);
      Win(p2, p1, r);
    } else {
      p1.transfer(r1);
      p2.transfer(r2);
      Draw(p1, p2);
    }

    gus[p1].length = 0; gus[p2].length = 0;
    ans[p1].length = 0; ans[p2].length = 0;    
  }
}