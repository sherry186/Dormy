import React, { useState, useEffect } from 'react';
import { List, message, Avatar, Skeleton, Divider } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { withRouter } from 'react-router';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

const Notification = ({userId}) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    console.log(userId)
    fetch(`http://127.0.0.1:8000/requests/${userId}`)
      .then(res => res.json())
      .then(body => {
        console.log("notification success!");
        console.log("body = ", body);
        console.log("data = ", data);
        // setData([...data, ...body]);
        const temp = [];
        body.map(
          item => {
            if(item.status !== 0){
              temp.push(item);
            }
          }
        )
        setData(temp)
        setLoading(false);
        console.log("new data = ", data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  const task_label = ['drive', 'heavylifting','kill_cockroach', 'host']

  return (
    <div
      id="scrollableDiv"
      className="notification"
      style={{
        height: 400,
        overflow: 'auto',
        padding: '0 16px',
        border: '1px solid rgba(140, 140, 140, 0.35)',
        background: 'white',
      }}
    > 
      <InfiniteScroll
        dataLength={data.length}
        next={loadMoreData}
        hasMore={data.length < 50}
        endMessage={<Divider plain>There are no more notifications!</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <List
          dataSource={data}
          renderItem={item => (
            <List.Item key={item.id}>
              {item.status === 1 && 
              <div>
                <div className="notification_item">
                  <Icon icon="ci:dot-02-s" color="#138796" height="50" />
                  <p>您應徵的任務<br/><div style={{fontWeight: 'bold'}}>{item.Request.title}</div>已被接受</p>
                  {/* <p style={{fontWeight: 'bold', fontSize: 16}}>您在「{item.Request.title}」的應徵已成功：）</p> */}
                </div>
                <Link to={`/ApplySuccess/${task_label[item.Request.service_id-1]}/${item.Request.request_id}`} style={{paddingLeft: '23vw'}}>詳細資訊</Link>
              </div>

                
              }
              {item.status === 2 && 
                <div className="notification_item">
                  <Icon icon="ci:dot-02-s" color="#F17FB2" height="50" />
                  <p>您應徵的任務<br/><div style={{fontWeight: 'bold'}}>{item.Request.title}</div>已被拒絕</p>
                </div>
              }
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  );
};

export default Notification;

