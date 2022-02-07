import React from 'react';
import { Form,Input,Select,DatePicker,Button,Divider, message } from 'antd';
import Navigation from '../containers/navigation';
import { useState } from 'react'
import { Link,useHistory } from 'react-router-dom';
import Location from '../components/location';
import Location_With_Floor from '../components/location_with_floor';
import axios from 'axios';

const { RangePicker } = DatePicker;

const Add_Post_Page = ({login,name,setCurrent,current,userId, setLogin, setUserId, setName}) => {
    let history = useHistory();
    const [form] = Form.useForm();
    const [key, setKey] = useState();
    const [location, setLocation] = useState();
    const [startlocation, setStartLocation] = useState();
    const [endlocation, setEndLocation] = useState();
    const [startfloor, setStartFloor] = useState(0);
    const [endfloor, setEndFloor] = useState(0);
    
    
    const success = () => {
        message.success("您已成功刊登任務！")
    }
    async function onFinish(values) {
        // console.log(values.time._d);
        let substring_1 = String(values.act_time[0]._d).substring(0,String(values.act_time[0]._d).lastIndexOf(" "));
        let final_1 = substring_1.substring(0,substring_1.lastIndexOf(" "));
        let substring_2 = String(values.act_time[1]._d).substring(0,String(values.act_time[1]._d).lastIndexOf(" "));
        let final_2 = substring_2.substring(0,substring_2.lastIndexOf(" "));
        let substring_3 = String(values.time._d).substring(0,String(values.time._d).lastIndexOf(" "));
        let final_3 = substring_3.substring(0,substring_3.lastIndexOf(" "));
        try {
            // GET api
            var res;
            if(key === 'kill_cockroach'){
                res = await axios.post("http://127.0.0.1:8000/requests/kill", {
                    requesterId: userId,
                    title: values.title,
                    endTime: final_3,
                    actStartTime: final_1,
                    actEndTime: final_2,
                    reward: values.reward,
                    description: values.detail,
                    requesterLocationId: location,
                });
            }
            if(key === 'heavylifting'){
                res = await axios.post("http://127.0.0.1:8000/requests/heavyLifting", {
                    requesterId: userId,
                    title: values.title,
                    endTime: final_3,
                    actStartTime: final_1,
                    actEndTime: final_2,
                    reward: values.reward,
                    description: values.detail,
                    fromId: startlocation,
                    fromFloor: startfloor,
                    toId: endlocation,
                    toFloor: endfloor,
                    item: values.item,
                    itemWeight: values.itemWeight,
                });
            }
            if(key === 'drive'){
                res = await axios.post("http://127.0.0.1:8000/requests/drive", {
                    requesterId: userId,
                    title: values.title,
                    endTime: final_3,
                    actStartTime: final_1,
                    actEndTime: final_2,
                    reward: values.reward,
                    description: values.detail,
                    fromId: startlocation,
                    toId: endlocation,
                });
            }
            if(key === 'host'){
                res = await axios.post("http://127.0.0.1:8000/requests/hostEvent", {
                    requesterId: userId,
                    title: values.title,
                    endTime: final_3,
                    actStartTime: final_1,
                    actEndTime: final_2,
                    description: values.detail,
                    eventLocationId: location,
                    locationDetail: values.location_detail,
                });
            }
            
            if(res.status === 201) {
                message.success("您已成功刊登任務！")
                setTimeout(() => {
                    history.push("/myPost");
                }, 1000)
            }
            return;
        } catch (error) {
            console.log(error);
        }
    }

    const rangeConfig = {
        rules: [
          {
            type: 'array',
            required: true,
            message: 'Please select time!',
          },
        ],
      };

  return (
    <>
      <header> 
          <div><Navigation login={login} name={name} setCurrent={setCurrent} current={current} userId={userId} setLogin={setLogin} setUserId={setUserId} setName={setName}/></div>
      </header>
      <Divider orientation="left" plain>基本資訊</Divider>
      <Form
        form={form}
        labelCol={{span: 4}}
        wrapperCol={{span: 14}}
        layout="horizontal"
        onFinish={(values) => onFinish(values)}
        >
        <Form.Item label="任務類別"
            name="service_type" 
            rules={[
            {
                required: true,
                message: 'Please select service type!',
            },
        ]}>
          <Select onChange={(value) => {setKey(value)}}  placeholder="select service type">
            <Select.Option value="kill_cockroach">打蟑螂</Select.Option>
            <Select.Option value="heavylifting">物品搬運</Select.Option>
            <Select.Option value="drive">載人服務</Select.Option>
            <Select.Option value="host">辦活動</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="任務標題" name="title" rules={[
            {
                required: true,
                message: 'Please input item title!',
            }]}>
          <Input placeholder="請輸入標題"/>
        </Form.Item>

        <Form.Item name="act_time" label="活動區間" {...rangeConfig} >
            <RangePicker showTime={{ format: 'HH:mm' }}
      format="YYYY-MM-DD HH:mm"/>
        </Form.Item>

        <Form.Item name="time" label="徵求截止時間" rules={[
            {
                required: true,
                message: 'Please select time!',
            }]}>
            <DatePicker showTime={{ format: 'HH:mm' }}
      format="YYYY-MM-DD HH:mm"/>
        </Form.Item>

        {key==='kill_cockroach'||key==='heavylifting'||key==='drive'?
        <Form.Item label="願付酬勞" name="reward" rules={[
            {
                required: true,
                message: 'Please input rewards!',
            }]}>
          <Input/>
        </Form.Item>:null}
        
        <Form.Item
            name="detail"
            label="詳細資訊"
            rules={[{ required: true, message: 'Please input Intro!' }]}
        >
        <Input.TextArea showCount maxLength={100} placeholder="可填寫地點、服務相關補充資訊"/>
      </Form.Item>
      
      {
        key==='kill_cockroach'?(
        <>
            <Divider orientation="left" plain>任務資訊</Divider>
            <Form.Item label="出沒地點" name="location" required={true}>
                <Location setLocation={setLocation}/>
            </Form.Item>
        </>
        ):key==='heavylifting'?(
        <>
            <Divider orientation="left" plain>任務資訊</Divider>
            <Form.Item label="預估起點" name="start_location" required={true}>
                <Location_With_Floor setLocation={setStartLocation} setFloor={setStartFloor}/>
            </Form.Item>
            <Form.Item label="預估終點" name="end_location" required={true}>
                <Location_With_Floor setLocation={setEndLocation} setFloor={setEndFloor}/>
            </Form.Item>
            <Form.Item label="物件種類" name="item" rules={[{ required: true, message: 'Please input item type!' }]}>
                <Input />
            </Form.Item>
            <Form.Item label="預估重量" name="itemWeight" rules={[{ required: true, message: 'Please input item weight!' }]}>
                <Input />
            </Form.Item>
            
        </>
        ):key==='drive'?(
            <>
            <Divider orientation="left" plain>任務資訊</Divider>
            <Form.Item label="預估起點" name="start_location" required={true}>
                <Location setLocation={setStartLocation}/>
            </Form.Item>
            <Form.Item label="預估終點" name="end_location" required={true}>
                <Location setLocation={setEndLocation}/>
            </Form.Item>    
        </>
        ):key==='host'?(
        <>
            <Divider orientation="left" plain>任務資訊</Divider>
            <Form.Item label="預估地點" name="location" required={true}>
                <Location setLocation={setLocation}/>
            </Form.Item> 
            <Form.Item label="地點詳細資訊" name="location_detail" rules={[{ required: true, message: 'Please input location detail!' }]}>
                <Input />
            </Form.Item> 
        </>
        ):null
      }
        <Form.Item>
            <Button className="cancel_button"><Link to="/">取消</Link></Button>
            <Button type="primary" className="send_button"　htmlType="submit">送出</Button> 
            {/* onClick={success} */}
        </Form.Item>
      </Form>
    </>
  );
};

export default Add_Post_Page;