import React from 'react';
import { Alert } from 'antd';

export default () => (
  <Alert
    className="GameRule"
    message="游戏规则"
    type="info"
    closeText="关闭"
    description={(
      <div>
        <p>
          玩家投币并上传 keccak256(seed, answer)，加入游戏。
          其中 seed 为玩家任意指定的随机数字，answer 为玩家所设计的 0-9 之间的答案。
          每有两名玩家加入游戏时，系统将自动为她们匹配房间。
          同一名玩家不可加入多个房间。
          加入房间后，玩家可以猜测别人的预设的数，或者返回对方猜数的结果，其中：
        </p>
        <ul>
          <li>-1：小了。</li>
          <li>0：正确。</li>
          <li>1：大了。</li>
        </ul>
        <p>
          猜测次数较小的玩家获胜。
          游戏结束时，双方玩家还需要上传最初 seed 和 answer 交给合约进行公正。
          当玩家作弊时直接判负。
        </p>
      </div>
    )}
  />
);
