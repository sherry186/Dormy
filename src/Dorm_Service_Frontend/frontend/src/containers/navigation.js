import { Menu,List } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useState } from 'react'
import { Link } from "react-router-dom";
import Login_And_SignUp from '../components/login_and_signUp';
import Login_And_SignUp_With_Login from '../components/login_and_signUp_with_login';
import Notification from '../components/notification';
require('typeface-seaweed-script');

const Navigation = ({login,name,setCurrent,current, userId, setLogin, setUserId, setName}) => {
    const [click,setClick] = useState(false);
    const handleClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };
    //此處要跟後端拿資料
    const data = [
      'Racing car sprays burning fuel into crowd.',
      'Japanese princess to wed commoner.',
      'Australian walks 100km after outback crash.',
      'Man charged over missing wedding girl.',
    ];

    const menuItemAfterLogin = [
      (<Menu.Item key="my_post"><Link to="/myPost">檢視發起中任務</Link></Menu.Item>),
      (<Menu.Item key="history"><Link to="/history">歷史紀錄</Link></Menu.Item>)
      ]
    

    return (
      <>
      <div className = "nav">
        <div style={{fontFamily: 'Seaweed Script', fontSize: 30, color: '#138796', paddingRight:20, paddingLeft:30, background: '#CCDCD7', cursor: 'default'}}>Dormy</div>
        <Menu onClick={handleClick} selectedKeys={current} mode="horizontal" className = "left_nav">
        {/* tbd: replace with clicible logo */}
        <Menu.Item key="title">
          <Link to="/">刊登中任務</Link>
        </Menu.Item>
        {login === true
        ?menuItemAfterLogin.map(
          item => {
            return item;
          }
        )
        :<></>}
      </Menu>
      <Menu mode="horizontal" className = "right_nav">
        <div className="right_nav">
          {login === false ? <Login_And_SignUp/>  : <Login_And_SignUp_With_Login name={name} click={click} setClick={setClick} setLogin={setLogin} setUserId={setUserId} setName={setName} setCurrent = {setCurrent}/>}
        </div> 
      </Menu> 
      </div>
      {click?<Notification userId={userId}/>:null}
      </>


    );
}

export default Navigation;

{/* <List
            className="notification"
            bordered
            dataSource={data}
            renderItem={item => (
                <List.Item>
                    {item}
                </List.Item>
            )}
        /> */}