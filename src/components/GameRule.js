import React from 'react';
import { Alert } from 'antd';

export default ({ desc }) => (
  <Alert
    className="GameRule"
    message="游戏规则"
    type="info"
    closeText="关闭"
    description={desc}
  />
);
