import React from 'react'
import { Collapse, Button } from 'antd'
import Navigation from './navigation';
import { Icon } from '@iconify/react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { Divider } from 'antd';

const ApplySuccess = ({login,name,setCurrent,current,userId, setLogin, setUserId, setName}) => {

    const [requestDetail, setRequestDetail] = useState([]);
    const [start, setStart] = useState(true);
    const [location, setLocation] = useState([]);
    const [dorm, setDorm] = useState({});
    const [userInfo, setUserInfo] = useState([]);
    const [renewUserInfo, setRenewUserInfo] = useState(false);
    // const { confirm } = Modal;
    let history = useHistory();

    let title = "Title";
    const startActTime = "2020.05.18";
    const endActTime = "2020.05.20";
    const startHireTime = "2020.05.18";
    const endHireTime = "2020.05.20";
    let fee = 100;
    let DetailInfo = "拜託趕快來嗚";

    let tempRequesterId = ""
    const userName = "林一二"
    const gender = 'F'
    const phoneNum = '0912345678'
    const fbUrl = 'facebook.com'

      // get location detail
  async function getLocation(){
    try {
        // GET api
        let res = await axios.get("http://127.0.0.1:8000/locations");
        
        if(res.status === 200) {
          setLocation(
                res.data.map(e => {
                      return{
                        location_name: e.location_name,
                        location_id: e.location_id,
                        longitude: e.longitude,
                        _class: e._class,
                        latitude: e.latitude
                    }
                })
            )
        }
        return;
    } catch (error) {
        console.log(error);
    }
  }

  async function getDorm(){
    try {
        // GET api
        let res = await axios.get("http://127.0.0.1:8000/locations/dormitory/");
        
        if(res.status === 200) {
          setDorm(
                res.data.map(e => {
                      return{
                        elevator_exist: e.elevator_exist,
                        location_id: e.location_id,
                        dorm_floor_count: e.dorm_floor_count,
                        facilities: e.facilities
                    }
                })
            )
        }
        return;
    } catch (error) {
        // console.log(error);
    }
  }


  //tbd
  async function getUserInfo(input_requester_id){
    try {
        // GET api
        // console.log("user id = ", input_requester_id)
        let res = await axios.get(`http://127.0.0.1:8000/users/${input_requester_id}`);                              
        if(res.status === 200) {
          console.log("data = ",res.data);
          setUserInfo(
            {
              userName: res.data.userName,
              gender: res.data.gender === 'O' ? '其他' : res.data.gender === 'F' ? '女' : '男',
              phoneNum: res.data.phoneNum,
              fbUrl: res.data.fbUrl
            }
          )
        }
        return;
    } catch (error) {
        console.log("QAQ")
        console.log(error);
    }
  }
  //tbd





  const actArea = [
    (<p>{requestDetail.length === 0 ? startActTime : requestDetail[0].startActTime}</p>),
    (<Icon icon="ic:baseline-arrow-right" height="10"/>),
    (<p>{requestDetail.length === 0 ? endActTime : requestDetail[0].endActTime}</p>)
  ]
  const hireArea = [
    (<p>{requestDetail.length === 0 ? startHireTime : requestDetail[0].startHireTime}</p>),
    (<Icon icon="ic:baseline-arrow-right" height="10"/>),
    (<p>{requestDetail.length === 0 ? endHireTime : requestDetail[0].endHireTime}</p>)
  ]

  let {serviceId, requestId} = useParams();
  console.log("IDs = ", serviceId, requestId)

    
  
    const item = (title, description) => {
        return(
          <div className = "detailItem">
            <p className =  "detailItemTitle">{title}</p>
            <p>&emsp;&emsp;&emsp;&emsp;&emsp;</p>
            {/* 換行 */}
            {[...description]}
          </div>
        )
      }
    
    const { Panel } = Collapse;
    const navBar = (
        <header>
        <div><Navigation login={login} name={name} setCurrent={setCurrent} current={current} userId={userId} setLogin={setLogin} setUserId={setUserId} setName={setName}/></div>
        </header>
      )


  const contentShow_Kill = () => {
    let place = "place";

    if(start){
      getDorm();
      getLocation();
      getaKillRequest();
      setStart(false);
    }
    

    if(location.length != 0 && requestDetail.length != 0){
      location.map(e => {
        e.location_id == requestDetail[0].requester_location_id ? place = e.location_name : place = place
      })
    }

    


      taskArea = (
        <div className="taskAreaContent">
          <div className="detailTitle">
            {taskTitle}
          </div>
          {item("出沒地點",[(<p>{place}</p>)])}
      </div>
      )
  }

  const contentShow_HeavyLifting = () => {
    let startPoint = "place";
    let endPoint = "place";
    // const distance = "100 m";
    let elevator = true;
    const elevatorText = elevator ? "有" : "沒有"; 
    const type = "十張桌子"
    const weight = "10kg"
   

    if(start){
      getDorm();
      getLocation();
      getaHeavyLiftingRequest();
      // getUserInfo();
      setStart(false);
      console.log("requestDetail", requestDetail)
    }

    if(location.length != 0 && requestDetail.length != 0){
      location.map(e => {
        e.location_id == requestDetail[0].to_id ? endPoint = e.location_name + " " +  requestDetail[0].to_floor + " 樓" : endPoint = endPoint
      });
      location.map(e => {
        e.location_id == requestDetail[0].from_id ? startPoint = e.location_name + " " + requestDetail[0].from_floor + " 樓" : startPoint = startPoint
      })
    }


    taskArea = (
      <div className="taskAreaContent">
        <div className="detailTitle">
          {taskTitle}
        </div>
        {item("預估起點",[(<p>{startPoint}</p>)])}
        {item("預估終點",[(<p>{endPoint}</p>)])}
        {/* {item("預估距離",[(<p>{distance}</p>)])} */}
        {/* {item("有無電梯",[(<p>{elevatorText}</p>)])} */}
        {item("物件種類",[(<p>{requestDetail.length == 0 ? type : requestDetail[0].type}</p>)])}
        {item("預估重量",[(<p>{requestDetail.length == 0 ? weight : requestDetail[0].weight}</p>)])}
    </div>
    )

  }

  const contentShow_Drive = () => {
    let startPoint = "place";
    let endPoint = "place";
    // const distance = "100 m";

    if(start){
      getDorm();
      getLocation();
      getaDriveRequest();
      // getUserInfo();
      setStart(false);
    }

    if(location.length != 0 && requestDetail.length != 0){
      location.map(e => {
        e.location_id == requestDetail[0].to_id ? endPoint = e.location_name : endPoint = endPoint
      });
      location.map(e => {
        e.location_id == requestDetail[0].from_id ? startPoint = e.location_name : startPoint = startPoint
      })
    }

    taskArea = (
      <div className="taskAreaContent">
        <div className="detailTitle">
          {taskTitle}
        </div>
        {item("預估起點",[(<p>{startPoint}</p>)])}
        {item("預估終點",[(<p>{endPoint}</p>)])}
        {/* {item("預估距離",[(<p>{distance}</p>)])} */}
    </div>
    )
  }

  const contentShow_Host = () => {
    let  place = "place";
    const  location_detail = "no detail";

    if(start){
      getDorm();
      getLocation();
      getaHostEventRequest();
      setStart(false);
    }

    console.log("place",place)
    if(tempRequesterId !== '' && renewUserInfo !== true){
      console.log("tempRequesterId", tempRequesterId);
      getUserInfo();
      setRenewUserInfo(true);
    }

    if(location.length != 0 && requestDetail.length != 0){
      location.map(e => {
        e.location_id == requestDetail[0].event_location_id ? place = e.location_name : place = place
      })
    }


    taskArea = (
      <div className="taskAreaContent">
        <div className="detailTitle">
          {taskTitle}
        </div>
        {item("活動地點",[(<p>{place}</p>)])}
        {item("詳細資訊",[(<p>{requestDetail.length === 0 ? location_detail : requestDetail[0].location_detail}</p>)])}
    </div>
    )

  }
  


  const taskTitle = (
    <Divider orientation="left" plain>
    任務資訊
    </Divider>
  )

  let titleArea = (
    <h1 className = "detail_title_Area">
    </h1>
  )

  let taskArea = (
    <div className="taskAreaContent"></div>
  )

  if(serviceId === 'kill_cockroach'){
    contentShow_Kill();
  }
  if(serviceId === 'heavylifting'){
    contentShow_HeavyLifting();
  }
  if(serviceId === 'drive'){
    console.log("get")
    contentShow_Drive();
  }
  if(serviceId === 'host'){
    contentShow_Host();
  }

  const basicArea = (
    <div>
      <Divider orientation="left" plain>
      基本資訊
      </Divider>

      {item("活動區間",actArea)}
      {item("徵求區間",hireArea)}
      {serviceId !== 'host' && item("願付酬勞",[<p></p>,(<p>{requestDetail.length === 0 ? fee : requestDetail[0].fee}</p>)])}
      {item("詳細資訊",[(<p>{requestDetail.length === 0 ? DetailInfo : requestDetail[0].DetailInfo}</p>)])}
      
    </div>
  )


  async function getaDriveRequest(){
    try {
        // GET api
        let res = await axios.get(`http://127.0.0.1:8000/requests/drive/${requestId}`);
        if(res.status === 200) {
            setRequestDetail(
                res.data.map(e => {
                      tempRequesterId = e.Request.requester_id;
                      return{
                        key: e.Request.request_id,
                        startActTime: e.Request.act_start_time.slice(0,10) + "  " + e.Request.act_start_time.slice(11,16),
                        endActTime: e.Request.act_end_time.slice(0,10) + "  " + e.Request.act_end_time.slice(11,16),
                        startHireTime: e.Request.start_time.slice(0,10) + "  " + e.Request.start_time.slice(11,16),
                        endHireTime: e.Request.end_time.slice(0,10) + "  " + e.Request.end_time.slice(11,16),
                        fee : e.Request.reward,
                        DetailInfo: e.Request.description,
                        title: e.Request.title,
                        from_id: e.DriveServicePost.from_id,
                        to_id:e.DriveServicePost.to_id,
                        requester_id: e.Request.requester_id
                    }
                })
            )
            getUserInfo(tempRequesterId);

        }
        return;
    } catch (error) {
        console.log(error);
    }
  }
  
  async function getaKillRequest(){
    try {
        // GET api
        let res = await axios.get(`http://127.0.0.1:8000/requests/kill/${requestId}`);
        
        if(res.status === 200) {
            const tempRequestDetail = [];
            setRequestDetail(
                res.data.map(e => {
                      tempRequesterId = e.Request.requester_id;
                      return{
                        key: e.Request.request_id,
                        startActTime: e.Request.act_start_time.slice(0,10) + "  " + e.Request.act_start_time.slice(11,16),
                        endActTime: e.Request.act_end_time.slice(0,10) + "  " + e.Request.act_end_time.slice(11,16),
                        startHireTime: e.Request.start_time.slice(0,10) + "  " + e.Request.start_time.slice(11,16),
                        endHireTime: e.Request.end_time.slice(0,10) + "  " + e.Request.end_time.slice(11,16),
                        fee : e.Request.reward,
                        DetailInfo: e.Request.description,
                        title: e.Request.title,
                        requester_location_id: e.KillCockroachServicePost.requester_location_id,
                        requester_id: e.Request.requester_id
                    }
                })
            )
            getUserInfo(tempRequesterId);
        }
        return;
    } catch (error) {
        console.log(error);
    }
  }
  
  async function getaHeavyLiftingRequest(){
    try {
        // GET api
        let res = await axios.get(`http://127.0.0.1:8000/requests/heavyLifting/${requestId}`);
        if(res.status === 200) {
            setRequestDetail(
                res.data.map(e => {
                      tempRequesterId = e.Request.requester_id;
                      return{
                        key: e.Request.request_id,
                        startActTime: e.Request.act_start_time.slice(0,10) + "  " + e.Request.act_start_time.slice(11,16),
                        endActTime: e.Request.act_end_time.slice(0,10) + "  " + e.Request.act_end_time.slice(11,16),
                        startHireTime: e.Request.start_time.slice(0,10) + "  " + e.Request.start_time.slice(11,16),
                        endHireTime: e.Request.end_time.slice(0,10) + "  " + e.Request.end_time.slice(11,16),
                        fee : e.Request.reward,
                        DetailInfo: e.Request.description,
                        title: e.Request.title,
                        type: e.HeavyliftingServicePost.item,
                        weight: e.HeavyliftingServicePost.item_weight,
                        to_id: e.HeavyliftingServicePost.to_id,
                        to_floor: e.HeavyliftingServicePost.to_floor,
                        from_id: e.HeavyliftingServicePost.from_id,
                        from_floor: e.HeavyliftingServicePost.from_floor,
                        requester_id: e.Request.requester_id
                    }
                })
            )
            getUserInfo(tempRequesterId);
        }
        return;
    } catch (error) {
        console.log(error);
    }
  }
  
  async function getaHostEventRequest(){
    try {
        // GET api
        let res = await axios.get(`http://127.0.0.1:8000/requests/hostEvent/${requestId}`);
        
        if(res.status === 200) {
            setRequestDetail(
                res.data.map(e => {
                      tempRequesterId = e.Request.requester_id;
                      return{
                        key: e.Request.request_id,
                        startActTime: e.Request.act_start_time.slice(0,10) + "  " + e.Request.act_start_time.slice(11,16),
                        endActTime: e.Request.act_end_time.slice(0,10) + "  " + e.Request.act_end_time.slice(11,16),
                        startHireTime: e.Request.start_time.slice(0,10) + "  " + e.Request.start_time.slice(11,16),
                        endHireTime: e.Request.end_time.slice(0,10) + "  " + e.Request.end_time.slice(11,16),
                        fee : e.Request.reward,
                        DetailInfo: e.Request.description,
                        title: e.Request.title,
                        location_detail: e.HostEventPost.location_detail,
                        event_location_id: e.HostEventPost.event_location_id,
                        requester_id: e.Request.requester_id
                    }
                })
            )
            getUserInfo(tempRequesterId);
        }
        return;
    } catch (error) {
        console.log(error);
    }
  }
  
  useEffect(() => {
    if(serviceId === 'kill_cockroach'){
      contentShow_Kill();
    }
    if(serviceId === 'heavylifting'){
      contentShow_HeavyLifting();
    }
    if(serviceId === 'drive'){
      contentShow_Drive();
    }
    if(serviceId === 'host'){
      contentShow_Host();
    }
  }, [requestDetail, userInfo, location]);

  console.log("detail", requestDetail)

    return (
        <div>
          {/* 因為在這個頁面跳另一個notification的功能有點問題，所以先把navigation bar mute掉了 */}
            {/* {navBar} */}
            <div className = "detail_title_Area">
                 <Icon icon="line-md:confirm-circle" color="#14d61c" height="30" style={{marginTop:"1.5vh"}} />
                <h1 className="detail_title" style={{paddingTop:'3vh'}}>&emsp;您的應徵已成功！請立即聯繫案主</h1>
            </div>
            <div className="collapse_position">
                <Collapse accordion defaultActiveKey={['1']} >
                    <Panel header="案主資訊" key="1">
                      <div>
                        {item("用戶姓名",[(<p>{userInfo.length === 0 ? userName : userInfo.userName}</p>)])}
                        {item("用戶性別",[(<p>{userInfo.length === 0 ? gender : userInfo.gender}</p>)])}
                        {item("用戶電話",[(<p>{userInfo.length === 0 ? phoneNum : userInfo.phoneNum}</p>)])}
                        {item("臉書網址",[(<p>{userInfo.length === 0 ? fbUrl : userInfo.fbUrl}</p>)])}
                        
                      </div>
                    </Panel>
                    <Panel header="任務資訊" key="2">
                    {basicArea}
                    {taskArea}
                    </Panel>
                </Collapse>
            </div>
            <div className="back_to_home_button" >
                <Button>
                    <Link to="/">回到首頁</Link>
                </Button>
            </div>
            
        </div>
    )
}

export default ApplySuccess
