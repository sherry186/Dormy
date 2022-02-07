import React from 'react'
import Navigation from './navigation'
import { Rate, Card,List, Avatar, Space, Button, PageHeader, message } from 'antd';
import { useState, useEffect } from 'react';
import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons';
import { Icon } from '@iconify/react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';


const Rating_Page = ({login,name,setCurrent,current, userId, setLogin, setUserId, setName}) => {

    const [appliers, setAppliers] = useState([]);
    const [flag, setFlag] = useState(false);

    let {requestId} = useParams();

    async function getAppliers() {
      try {
        let res = await axios.get(`http://127.0.0.1:8000/appliers/asked/${requestId}`);
        console.log(res.data);
        var temp = res.data.map(applier => {
          return {
            name: applier.User.user_name,
            id: applier.User.user_id,
            gender: applier.User.gender,
            rating: applier.Applier.rating
          }
        });
        setAppliers(temp);
      } catch (error) {
        console.log(error);
      }
    };
    if(!flag) {
      getAppliers();
      setFlag(true);
    }

    //default value
    const navBar = (
        <header>
        <div><Navigation login={login} name={name} setCurrent={setCurrent} current={current} userId={userId} setLogin={setLogin} setUserId={setUserId} setName={setName}/></div>
        </header>
      )


    const handleStar = (id, inputValue) => {
      var tempArr = Array.from(appliers);
      var indexToUpdate = tempArr.findIndex(applier => applier.id === id);
      tempArr[indexToUpdate].rating = inputValue;
      setAppliers(tempArr);
    }

    async function handleSubmit() {
      for(let i = 0; i < appliers.length; i++) {
        let params = {
          requestId: requestId,
          applierId: appliers[i].id,
          score: appliers[i].rating
        }
        console.log(params);
        try {
          await axios.patch(`http://127.0.0.1:8000/users/rateRequest`, params);
        } catch(e) {
          console.log(e);
          message.error("無法進行評分");
          return;
        }
      }
      message.success("評分成功！")
      window.history.back();
    }

      return(
          <div className="rating">
            {navBar}
            {/* 這邊再加一個 */}
            <PageHeader
            onBack={() => window.history.back()}
            // title="返回歷史紀錄"
            subTitle="返回歷史紀錄"
            />
            <div className="rating_frame">
              <List
                className="rating_list"
                itemLayout="vertical"
                size="large"
                pagination={{
                  onChange: page => {
                    console.log(page);
                  },
                  pageSize: 5,
                }}
                dataSource={appliers}
                renderItem={applier => (
                  <List.Item
                    key={applier.id}
                  >
                    <List.Item.Meta
                      title={applier.name}
                      avatar={applier.gender === 'M'? <Icon icon="noto-v1:boy-light-skin-tone" color="#c9c9c9" height="20" />: <Icon icon="noto:girl-light-skin-tone" color="#c9c9c9" height="20" />}
                      description={
                        <Rate onChange={(value) => handleStar(applier.id, value)} defaultValue={applier.rating} value={applier.rating}/>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
              {appliers.length !== 0 && 
              <div>
                <Button className="cancel_button" onClick={() => window.history.back()}>取消</Button>
                <Button type="primary" className="send_button" onClick={() => handleSubmit()}>送出</Button>
              </div>
              }
            </div>
    )


}

export default Rating_Page



