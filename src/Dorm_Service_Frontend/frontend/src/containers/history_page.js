import Navigation from '../containers/navigation';
import Post_Table from '../components/post_table';
import { useState } from 'react';
import Service_Filter from '../components/service_filter';
import Title_Search from '../components/title_search';
 
const History = ({login,name,setCurrent,current, userId, setLogin, setUserId, setName}) => {
    const [serviceStatus, setserviceStatus] = useState("all");
    const [titleFilter, settitleFilter] = useState("");
    return (
        <div id="root">
          <header> 
              <div><Navigation login={login} name={name} setCurrent={setCurrent} current={current} userId={userId} setLogin={setLogin} setUserId={setUserId} setName={setName}/></div>
          </header>
          <div class="title_line">
            <div className="line"></div>
            <h1 className="page_title">歷史紀錄</h1>
          </div> 
          <div className="filter_and_search">
            <div className="filter"><Service_Filter  setserviceStatus = {setserviceStatus}/></div>
            <div className="search"><Title_Search settitleFilter = {settitleFilter}/></div>
          </div>
          <div className="post_table"><Post_Table Page = {"history"} serviceStatus = {serviceStatus} titleFilter = {titleFilter} userId = {userId}/></div>
        </div>
      ); 
}



export default History;