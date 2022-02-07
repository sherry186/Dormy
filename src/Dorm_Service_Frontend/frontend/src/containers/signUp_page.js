import React from 'react';
import { Form,Input,Select,Button, message, notification} from 'antd';
import { useHistory } from "react-router-dom";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const SignUp_Page = () => {
  let history = useHistory();
  const [form] = Form.useForm();

  async function onFinish(values) {
    console.log('Received values of form: ', values);

    try {
        let res = await axios.get("http://127.0.0.1:8000/locations/2");
        console.log(res.data);
        let dormId = res.data.find(location => location.location_name === values.dorm).location_id;
        console.log(dormId);
        console.log(values.facebook_url);
        if(dormId !== undefined) {
            try {
                let res = await axios.post("http://127.0.0.1:8000/users", {
                    userName: values.username,
                    password: values.password,
                    gender: values.gender,
                    phoneNum: values.phone_number,
                    fbUrl: `https://${values.facebook_url}`,
                    dormID: dormId
                })
                if(res.status === 201) {
                    
                    (() => {
                        notification['success']({
                            message: "Registered Successfully!",
                            description: "You will be redirected to Login Page after 3 sceonds.",
                            placement: "topLeft",
                            duration: 2.2
                        })
                    })()

                    setTimeout(() => {
                        history.push("/login");
                    }, 3000)
                }
                return;
            } catch (error) {
                console.log(error.response.data);
                if(error.response.data.detail === 'User name already exists') message.error("Username already exists")
                return;
            }
        }
        else {
            console.log("Can't find corresponding location!");
            message.error("Can't find corresponding location!");
        }
    } catch (error) {
        console.log(error);
    }
  };

  return (
    <>
    <h1 className="signUp_title">Sign Up</h1>
    <div className="signUp_page">
        <Form 
        {...formItemLayout}
        form={form}
        // layout="vertical"
        name="register"
        onFinish={(values) => onFinish(values)}
        scrollToFirstError
        >
            <Form.Item
                name="username"
                label="Username"
                rules={[
                    {
                        required: true,
                        message: 'Please input your Username!',
                    },
                ]}
            >
                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>

            <Form.Item
                name="password"
                label="Password"
                rules={[
                {
                    required: true,
                    message: 'Please input your password!',
                },
                ]}
                hasFeedback
            >
                <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>

            <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={['password']}
                hasFeedback
                rules={[
                {
                    required: true,
                    message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                    }

                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                    },
                }),
                ]}
            >
                <Input.Password  placeholder="Confirmed Password"/>
            </Form.Item>

            <Form.Item
                name="facebook_url"
                label="Facebook_Url"
                tooltip="Please input valid FB-URL, so that other people can find you!"
                rules={[
                {
                    required: true,
                    message: 'Please input your Fb-url!',
                    whitespace: true,
                },
                ]}
            >
                <Input 
                    addonBefore="https://"
                    placeholder="facebook.com/yourname"
                />
            </Form.Item>


            <Form.Item
                name="phone_number"
                label="Phone Number"
                rules={[
                {
                    required: true,
                    message: 'Please input phone number!',
                },
                ]}
            >
                <Input placeholder="0912345678"/>
            </Form.Item>

            <Form.Item
                name="gender"
                label="Gender"
                rules={[
                {
                    required: true,
                    message: 'Please select gender!',
                },
                ]}
            >
                <Select placeholder="select your gender">
                <Option value="M">Male</Option>
                <Option value="F">Female</Option>
                <Option value="O">Other</Option>
                </Select>
            </Form.Item>

            <Form.Item
                name="dorm"
                label="Dorm"
                rules={[
                {
                    required: true,
                    message: 'Please select dorm!',
                },
                ]}
            >
                <Select placeholder="select your dorm">
                <Option value="男一舍">男一舍</Option>
                <Option value="男二舍">男二舍</Option>
                <Option value="男三舍">男三舍</Option>
                <Option value="男四宿舍">男四舍</Option>
                <Option value="男五舍">男五舍</Option>
                <Option value="男六舍">男六舍</Option>
                <Option value="男七舍">男七舍</Option>
                <Option value="男八舍">男八舍</Option>
                <Option value="第一男研究生宿舍">研一男舍</Option>
                <Option value="第一女研究生宿舍">研一女舍</Option>
                <Option value="maste第三研究生宿舍r_3">研三舍</Option>
                <Option value="大一女舍">大一女舍</Option>
                <Option value="女一舍">女一舍</Option>
                <Option value="女二舍">女二舍</Option>
                <Option value="女三舍">女三舍</Option>
                <Option value="女四舍">女四舍</Option>
                <Option value="女五舍">女五舍</Option>
                <Option value="女六舍">女六舍</Option>
                <Option value="女七舍">女七舍</Option>
                <Option value="女八舍">女八舍</Option>
                <Option value="女九舍">女九舍</Option>
                </Select>
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" className = "wide-form-button">
                    {/* Register */}
                    {/* Todo: 如果成功註冊的話跳message */}
                    {/* <Link to="/login">Sign Up</Link> */}
                    Sign Up
                </Button>
                Already have an Account?  <a href="/login">Login</a>
            </Form.Item>
        </Form>
    </div>

    </>
  );
};

export default SignUp_Page;
