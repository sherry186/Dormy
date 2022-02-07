import { Button } from 'antd';
import { Link } from "react-router-dom";


const Login_And_SignUp = () => {
    
    return(
    <>
        <Button type="text"><Link to="/login">Login</Link></Button>
        <Button type="primary" className="signUp_button"><Link to="/signUp">Sign Up</Link></Button>
    </>
    );
}

export default Login_And_SignUp;