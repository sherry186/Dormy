import { Form, Input, Button, message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useHistory } from "react-router-dom";
import React, {useState, useEffect} from 'react';
import axios from 'axios';

const Login_Page = ({login, setLogin, setName, setUserId}) => {

    let history = useHistory();
    const[userName, setUserName] = useState("");
    const[password, setPassword] = useState("");

    // const onChange = (e) => {
    //     setUserName(e.target.value);
    // };
    async function handleLogin(){
        try {
            // GET api
            let res = await axios.post("http://127.0.0.1:8000/users/login", {
                userName: userName,
                password: password
            });
            //If login is performed successfully, we have to record this user's id, which will be res.data
            message.success("Login successfully!")
            if(res.status === 200) {
                history.push("/");
                setLogin(true);
                setName(userName);
                setUserId(res.data);
            }
            return;
        } catch (error) {
            console.log(error);
            //Here we need to handle the situation that login failed
            if(userName === "" || password === "") message.error("Username or password cannot be empty!");
            else message.error("Your username or password is wrong!");
        }
    }
    return (
        <>
            <h1 className="login_title">Login</h1>
            <div className="login_page">
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{remember: true,}}
                >
                    <Form.Item
                        name="username"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your Username!',
                        },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} value = {userName} placeholder="Username" onChange={(e) => setUserName(e.target.value)}/>
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                        },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                            value = {password}
                            onChange = {(e) => setPassword(e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="wide-form-button" onClick={() => handleLogin()}>
                            Login
                        </Button>
                        Don't have an Account?  <a href="/signUp">Sign Up</a>
                    </Form.Item>
                </Form>
            </div>
        </>
    );


}

export default Login_Page;