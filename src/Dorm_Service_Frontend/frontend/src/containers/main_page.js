import Navigation from '../containers/navigation';
import Service_Filter from '../components/service_filter';
import Title_Search from '../components/title_search';
import Post_Table from '../components/post_table';
import { useState } from 'react'
 
const Main_Page = ({login,name,setCurrent,current, setViewSelf, userId, setLogin, setUserId, setName}) => {
  setViewSelf(false);
  const [serviceStatus, setserviceStatus] = useState("all");
  const [titleFilter, settitleFilter] = useState("");

  // console.log("main page");
    return (
        <div id="root">
          <header> 
              <div><Navigation login={login} name={name} setCurrent={setCurrent} current={current} userId={userId} setLogin={setLogin} setUserId={setUserId} setName={setName}/></div>
          </header> 
          <div class="title_line">
            <div className="line"></div>
            <h1 className="page_title">刊登中任務</h1>
          </div>
          <div className="filter_and_search">
              <div className="filter"><Service_Filter  setserviceStatus = {setserviceStatus}/></div>
              <div className="search"><Title_Search  settitleFilter = {settitleFilter}/></div>
          </div>
          {/* <div className="post_table"><Post_Table  Page = {"main"}/></div> */}
          <div className="post_table"><Post_Table  Page = {"main"} serviceStatus = {serviceStatus} userId = {userId} titleFilter = {titleFilter}/></div>
        </div>
      ); 
}

export default Main_Page;