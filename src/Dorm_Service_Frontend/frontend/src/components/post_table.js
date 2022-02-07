import { Table, Tag, Button, message } from 'antd';
import { useState } from 'react'
import { ArrowRightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Icon } from '@iconify/react';

const Post_Table = ({Page, serviceStatus, userId, titleFilter}) => {
    // console.log("post table");
    const [index, setIndex] = useState(0); //待改，每輸入一筆資料 setIndex(index+1)
    const [dataList, setDataList] = useState([]);
    const [start, setStart] = useState(true);

    const columns = [
    {
        title: '標題',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: '活動開始時間',
        dataIndex: 'activity_start_time',
        key: 'activity_start_time',
    },
    {
        title: '活動結束時間',
        dataIndex: 'activity_end_time',
        key: 'activity_end_time',
    },
    {
        title: '服務項目',
        dataIndex: 'service_item',
        key: 'service_item',
        render: service_item => (
        <>
            {service_item.map(tag => {
                let color;
                if (tag === '打蟑螂') {
                    color = 'volcano';
                    return (
                        <Tag color={color} key={tag} style={{ paddingBottom: '2px',paddingTop: '2px' }}><Icon icon="simple-icons:cockroachlabs" height="15" style={{ marginBottom: '-3px' }}/> {tag}</Tag>
                    );
                } if (tag === '物品搬運') {
                    color = 'green';
                    return (
                        <Tag color={color} key={tag} style={{ paddingBottom: '2px',paddingTop: '2px' }}><Icon icon="fluent:box-24-regular" height="15" style={{ marginBottom: '-3px' }}/> {tag}</Tag>
                    );
                } if (tag === '載人服務') {
                    color = 'geekblue';
                    return (
                        <Tag color={color} key={tag} style={{ paddingBottom: '2px',paddingTop: '2px' }}><Icon icon="fluent:vehicle-bicycle-20-regular" height="15" style={{ marginBottom: '-3px' }}/> {tag}</Tag>
                    );
                } if (tag === '辦活動') {
                    color = 'gold';
                    return (
                        <Tag color={color} key={tag} style={{ paddingBottom: '2px',paddingTop: '2px' }}><Icon icon="bi:people" height="15" style={{ marginBottom: '-3px' }}/> {tag}</Tag>
                    );
                }
            })}
        </>
        ),
    },
    ];

    //判斷最右側按鈕是檢視詳細資料，或是有評分功能
    if(Page === "history"){
        const arrowIcon ={
            title: '',
            dataIndex: 'click',
            key: 'click',
            render: (_, rows) => (
                <>
                    <Button key = {index} type="secondary">
                        <Link to ={`/rating/${rows.key}`}>我要評分</Link>
                    </Button>
                </>
                ),
        }
        columns.push(arrowIcon);
    }
    else{
        const arrowIcon ={
            title: '',
            dataIndex: 'click',
            key: 'click',
            // render: icon => <a>{icon}</a>,
            // render: () => {  
            //     return (
            //         <Button type="default" shape="circle" href="/post_detail/th" icon={<ArrowRightOutlined />}/>
            //     );
            // },
            render: (_, rows) => (
                <>
                    {
                        rows.click[0] === '打蟑螂' ?  
                        (<Button  key={index} type="default" shape="circle" >
                                <Link to= {`/post_detail/kill_cockroach/${rows.key}`}>➜</Link>
                        </Button>) 
                        : rows.click[0] === '物品搬運' ?
                        (<Button  key={index} type="default" shape="circle" >
                                <Link to= {`/post_detail/heavylifting/${rows.key}`}>➜</Link>
                        </Button>)
                        : rows.click[0] === '載人服務' ?
                        (<Button  key={index} type="default" shape="circle" >
                                <Link to= {`/post_detail/drive/${rows.key}`}>➜</Link>
                        </Button>)
                        : 
                        (<Button  key={index} type="default" shape="circle" >
                                <Link to= {`/post_detail/host/${rows.key}`}>➜</Link>
                        </Button>)
                    }
                    
                    
                </>
                ),
        }
        columns.push(arrowIcon);
    }

    async function getRequestData(){
        try {
            // GET api
            let res;
            if(Page === "main"){
                res = await axios.get("http://127.0.0.1:8000/requests/available");
            }
            else if(Page === "myPost" && userId != ""){
                res = await axios.get(`http://127.0.0.1:8000/requests/ongoing/${userId}`);
            }
            //新增history模式，代更正get 內容
            else{
                console.log(userId);
                res = await axios.get(`http://127.0.0.1:8000/requests/history/${userId}`);
            }

            
            
            
            if(res.status === 200) {
                setDataList(
                    res.data.map(e => {
                        if(e.service_id == 1){
                            return{
                                key: e.request_id,
                                title: e.title,
                                activity_start_time: e.act_start_time.slice(0,10) + "  " + e.act_start_time.slice(11, 16),
                                activity_end_time: e.act_end_time.slice(0,10) + "  " + e.act_end_time.slice(11, 16),
                                service_item: ['載人服務'],
                                click: ['載人服務'],
                                requester_id: e.requester_id
                            }
                        }
                        else if(e.service_id == 2){
                            return{
                                key: e.request_id,
                                title: e.title,
                                activity_start_time: e.act_start_time.slice(0,10) + "  " + e.act_start_time.slice(11, 16),
                                activity_end_time: e.act_end_time.slice(0,10) + "  " + e.act_end_time.slice(11, 16),
                                service_item: ['物品搬運'],
                                click: ['物品搬運'],
                                requester_id: e.requester_id
                            }
                        }
                        else if(e.service_id == 3){
                            return{
                                key: e.request_id,
                                title: e.title,
                                activity_start_time: e.act_start_time.slice(0,10) + "  " + e.act_start_time.slice(11, 16),
                                activity_end_time: e.act_end_time.slice(0,10) + "  " + e.act_end_time.slice(11, 16),
                                service_item: ['打蟑螂'],
                                click: ['打蟑螂'],
                                requester_id: e.requester_id
                            }
                        }
                        else if(e.service_id == 4){
                            return{
                                key: e.request_id,
                                title: e.title,
                                activity_start_time: e.act_start_time.slice(0,10) + "  " + e.act_start_time.slice(11, 16),
                                activity_end_time: e.act_end_time.slice(0,10) + "  " + e.act_end_time.slice(11, 16),
                                service_item: ['辦活動'],
                                click: ['辦活動'],
                                requester_id: e.requester_id
                            }
                        }
                        
                    })
                )
            }
            return;
        } catch (error) {
            console.log(error);
            if(Page === "myPost" && error.response.status == 404){
                console.log("There are no ongoing request from this user.");
                message.error("You have no ongoing request now.");
            }
        }
    }

    if(start){
        getRequestData();
        setStart(false);
    }

    
    if(titleFilter != "" && Page === "main" || Page === "history"){
        console.log("titleFilter  ", {titleFilter});
        if(serviceStatus === "all"){
            return <Table columns={columns} dataSource={dataList.filter(request => request.title.includes(titleFilter))} />
        }
        else if(serviceStatus === "kill_cockroach"){
            return <Table columns={columns} dataSource={dataList.filter(request => request.service_item[0] === '打蟑螂' && request.title.includes(titleFilter))} />
        }
        else if(serviceStatus === "heavylifting"){
            return <Table columns={columns} dataSource={dataList.filter(request => request.service_item[0] == '物品搬運' && request.title.includes(titleFilter))} />
        }
        else if(serviceStatus === "drive"){
            return <Table columns={columns} dataSource={dataList.filter(request => request.service_item[0] == '載人服務' && request.title.includes(titleFilter))} />
        }
        else if(serviceStatus === "host"){
            return <Table columns={columns} dataSource={dataList.filter(request => request.service_item[0] == '辦活動' && request.title.includes(titleFilter))} />
        }
    }
    // else if(Page === "main"){
    //     if(serviceStatus === "all"){
    //         return <Table columns={columns} dataSource={dataList.filter(request => request.requester_id !== userId)} />
    //     }
    //     else if(serviceStatus === "kill_cockroach"){
    //         return <Table columns={columns} dataSource={dataList.filter(request => request.service_item[0] === '打蟑螂' && request.requester_id !== userId)} />
    //     }
    //     else if(serviceStatus === "heavylifting"){
    //         return <Table columns={columns} dataSource={dataList.filter(request => request.service_item[0] == '物品搬運' && request.requester_id !== userId)} />
    //     }
    //     else if(serviceStatus === "drive"){
    //         return <Table columns={columns} dataSource={dataList.filter(request => request.service_item[0] == '載人服務' && request.requester_id !== userId)} />
    //     }
    //     else if(serviceStatus === "host"){
    //         return <Table columns={columns} dataSource={dataList.filter(request => request.service_item[0] == '辦活動' && request.requester_id !== userId)} />
    //     }
    // }
    else{
        if(serviceStatus === "all"){
            return <Table columns={columns} dataSource={dataList} />
        }
        else if(serviceStatus === "kill_cockroach"){
            return <Table columns={columns} dataSource={dataList.filter(request => request.service_item[0] === '打蟑螂')} />
        }
        else if(serviceStatus === "heavylifting"){
            return <Table columns={columns} dataSource={dataList.filter(request => request.service_item[0] == '物品搬運')} />
        }
        else if(serviceStatus === "drive"){
            return <Table columns={columns} dataSource={dataList.filter(request => request.service_item[0] == '載人服務')} />
        }
        else if(serviceStatus === "host"){
            return <Table columns={columns} dataSource={dataList.filter(request => request.service_item[0] == '辦活動')} />
        }
    }

    

    return <Table columns={columns} dataSource={dataList} />
}

export default Post_Table;