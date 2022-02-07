import { Button,List, Dropdown, Menu } from 'antd';
import { Icon } from '@iconify/react';
import { Link, useHistory } from "react-router-dom";
import { DownOutlined } from '@ant-design/icons';
// import Menu from 'rc-menu/lib/Menu';

const Login_And_SignUp_With_Login = ({name,click, setClick, setLogin, setUserId, setName, setCurrent}) => {

    let history = useHistory();
    const handleNotif = () => {
        setClick(!click);
    }

    const handleLogout = () => {
        setLogin(false);
        setUserId('');
        setName('');
        setCurrent('title');
        history.push("/");
    }
    const menu = (
        <Menu>
          <Menu.Item key="0">
            <Link to="/personal"> 個人主頁 </Link>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="3" onClick = {handleLogout} > Logout </Menu.Item>
        </Menu>
      );

    //利用notification button, 開啟list
    return(
    <>
        <Button type="primary"><Link to="/addPost" >+ 新增任務</Link></Button>
        <Button type="text" onClick={handleNotif}><Icon icon="ci:notification" rotate={2} vFlip={true} /></Button>
        {/* <Button type="text"><Link to="/personal">{name}</Link></Button> */}
        {/* <Button onClick = {handleLogout}  >Logout</Button> */}
        <Dropdown overlay={menu} trigger={['click']} placement = "bottomCenter">
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                {name} <DownOutlined />
            </a>
        </Dropdown>
    </>
    );
}

export default Login_And_SignUp_With_Login;
