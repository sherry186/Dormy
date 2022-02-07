import { Cascader } from 'antd';
import axios from 'axios';
const Location_With_Floor = ({setLocation, setFloor}) => {
    const map = ['教學大樓','學生宿舍','系館或研究大樓','活動中心','學生餐廳','體育設施','圖書館','行政大樓','其他'];
    const floor = [5,4,5,5,3,11,3,3,5,4,11,4,4,5,4,7,4,5,7,11];
    var storeData = [];
    var options = [];
    var index = -1;
    async function locationDetail(){
        try {
            // GET api
            for(var i = 1; i <= 9; i++){
                let res = await axios.get(`http://127.0.0.1:8000/locations/${i}`, {});
                if(res.status === 200) {
                    if(i === 2){
                        var data = {
                            value: map[i-1],
                            label: map[i-1],
                            children: [
                            ],
                        };
                        res.data.map(e => {
                            index += 1;
                            let innerData = {
                                value: e.location_name,
                                label: e.location_name,
                                children: [
                                ],
                            };
                            for(var j = 1; j <= floor[index]; j++){
                                let innInnData = {
                                    value:`${j}`,
                                    label:`${j}`,
                                }
                                innerData.children.push(innInnData);
                            }
                            data.children.push(innerData);
                            storeData.push(e.location_name);
                        })
                        options.push(data);
                    } else {
                        var data = {
                            // value: `${i}`,
                            value: map[i-1],
                            label: map[i-1],
                            children: [
                            ],
                        };
                        res.data.map(e => {
                            // index += 1;
                            let innerData = {
                                // value: `${index}`,
                                value: e.location_name,
                                label: e.location_name,
                            };
                            data.children.push(innerData);
                            storeData.push(e.location_name);
                        })
                        options.push(data);
                    }    
                }
            }

            return;
        } catch (error) {
            console.log(error);
        }
    }
    function onChange(value) {
        // console.log(value.length);
        if(value.length === 3){
            setLocation(storeData.indexOf(value[1])+1);
            setFloor(parseInt(value[2]));
        }
        if(value.length === 2){
            setLocation(storeData.indexOf(value[1])+1);
        }
    }
    
    locationDetail();

    return(
        <Cascader options={options} onChange={onChange} placeholder="Please select" />
    );
}

export default Location_With_Floor;