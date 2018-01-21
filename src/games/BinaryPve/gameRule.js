import React from 'react';

export default (
  <div>
    <p>
      玩家投币并猜测一个数字进行游戏。
      智能合约处理完成之后会返回三个结果之一:
    </p>
    <ul>
      <li>小了</li>
      <li>正确</li>
      <li>大了</li>
    </ul>
    <p>
      当一名玩家猜对时，她将获得当前奖池金额的 50%。
      合约自动生成下一个随机数字。
    </p>
  </div>
);
