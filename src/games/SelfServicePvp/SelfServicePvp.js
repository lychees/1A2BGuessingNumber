import React from 'react';
import { Card, Tabs, InputNumber, Form, notification, Alert,Button,Radio } from 'antd';

// import { calcResult, translateResult, isValidAnswer } from '../../utils/game';

import '../GuessNumber.css';

class SelfServicePvp extends React.Component {

	callback(key) {
	  console.log(key);
	}

	handleModeChange() {

	}

	renderRoom() {
		return ( <Form>
				        <Form.Item label="某某房间">
				          <InputNumber />
				        </Form.Item>
				        <Form.Item>
				          <Button type="primary">
				            提交答案
				          </Button>
				        </Form.Item>
				      </Form> )
	}

	render() {
	    return (
	      <Card className="GuessNumber">

	          <Tabs defaultActiveKey="1">

			    <Tabs.TabPane tab="发布谜题" key="1">
			    	<Form>
				        <Form.Item label="我的谜题">
				          <InputNumber />
				        </Form.Item>
				        <Form.Item>
				          <Button type="primary">
				            创建房间
				          </Button>
				        </Form.Item>
				      </Form>
			      </Tabs.TabPane>

			    <Tabs.TabPane tab="房间列表" key="2">
			    	<div>
				        <Tabs
				          defaultActiveKey="1"
				          tabPosition='left'
				          style={{ height: 220 }}
				        >
				          <Tabs.TabPane tab="Tab 1" key="1">{this.renderRoom()}</Tabs.TabPane>
				          <Tabs.TabPane tab="Tab 2" key="2">{this.renderRoom()}</Tabs.TabPane>
				          <Tabs.TabPane tab="Tab 3" key="3">{this.renderRoom()}</Tabs.TabPane>
				        </Tabs>
				      </div>
			    </Tabs.TabPane>

			  </Tabs>

	      </Card>
	    )
	  }

}

export default SelfServicePvp;