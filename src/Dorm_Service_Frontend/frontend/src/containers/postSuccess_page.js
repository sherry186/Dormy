import React from 'react'
import { Icon } from '@iconify/react';
import { Button } from 'antd';
import Navigation from '../containers/navigation';
import { Link } from 'react-router-dom';


const postSuccess_page = ({login,name,setCurrent,current,userId, setLogin, setUserId, setName}) => {


    return (
        <>
        <header> 
              <div><Navigation login={login} name={name} setCurrent={setCurrent} current={current} userId={userId} setLogin={setLogin} setUserId={setUserId} setName={setName}/></div>
        </header>
        <div className="succes_page">
            <Icon icon="akar-icons:check-box" color="green" height="150" />
            <h1>您的意願已送出！</h1>
            <h5>若發布方回覆訊息，將收到通知</h5>
            <Button>
                <Link to="/">回到首頁</Link>
            </Button>
        </div>
        </>
    )
}

export default postSuccess_page
