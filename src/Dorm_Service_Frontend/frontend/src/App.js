import { BrowserRouter as Router, Route } from "react-router-dom";
import Main_Page from './containers/main_page';
import My_Posting_Page from './containers/my_posting_page';
import Login_Page from './containers/login_page';
import SignUp_Page from './containers/signUp_page';
import Add_Post_Page from './containers/add_post_page';
import Post_Detail_Page from './containers/post_detail_page';
import Post_Success_Page from './containers/postSuccess_page';
import Rating_Page from "./containers/rating_page";
import Personal_Page from "./containers/personal_page";
import { useState } from 'react'
import History from "./containers/history_page";
import ApplySuccess from "./containers/applySucess_page";

const App = () => {
  const [current, setCurrent] = useState('title');
  const [login, setLogin] = useState(false);
  const [name, setName] = useState('');
  const [viewSelf, setViewSelf] = useState(false);
  const [userId, setUserId] = useState('');

  
  return (
    <Router> 
      <div className="App">
          <Route path="/" exact component={() => <Main_Page login={login} name={name} setCurrent={setCurrent} current={current} setViewSelf={setViewSelf} userId={userId} setLogin={setLogin} setUserId={setUserId} setName={setName}/>}/>
          <Route path="/addPost" exact component={() => <Add_Post_Page login={login} name={name} setCurrent={setCurrent} current={current} userId={userId} setLogin={setLogin} setUserId={setUserId} setName={setName}/>}/>
          <Route path="/myPost" component={() => <My_Posting_Page login={login} name={name} setCurrent={setCurrent} current={current} setViewSelf={setViewSelf} userId={userId} setLogin={setLogin} setUserId={setUserId} setName={setName}/>}/>
          <Route path="/login" component={() => <Login_Page login = {login} setLogin={setLogin} setName={setName} setUserId={setUserId}/>}/>
          <Route path="/signUp" component={SignUp_Page}/>
          <Route path="/post_detail/:serviceId/:requestId" component={() => <Post_Detail_Page login={login} name={name} setCurrent={setCurrent} current={current} viewSelf={viewSelf} userId={userId} setLogin={setLogin} setUserId={setUserId} setName={setName}/>}/>
          {/* <Route path="/post_detail/:serviceId" component={Post_Detail_Page}/> */}
          <Route path="/postSuccess" component={() => <Post_Success_Page login={login} name={name} setCurrent={setCurrent} current={current} userId = {userId} setLogin={setLogin} setUserId={setUserId} setName={setName}/>}/>
          <Route path="/rating/:requestId" component={() => <Rating_Page login={login} name={name} setCurrent={setCurrent} current={current} userId = {userId} setLogin={setLogin} setUserId={setUserId} setName={setName}/>}/>
          <Route path="/history" component={() => <History login={login} name={name} setCurrent={setCurrent} current={current} userId={userId} setLogin={setLogin} setUserId={setUserId} setName={setName}/>}/>
          <Route path="/personal" component={() => <Personal_Page login={login} name={name} setCurrent={setCurrent} current={current} userId={userId} setLogin={setLogin} setUserId={setUserId} setName={setName}/>}/>
          <Route path="/applySuccess/:serviceId/:requestId" component={() => <ApplySuccess login={login} name={name} setCurrent={setCurrent} current={current} userId={userId} setLogin={setLogin} setUserId={setUserId} setName={setName}/>}/>
      </div>
    </Router>
  );
}

export default App;
