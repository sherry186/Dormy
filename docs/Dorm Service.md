---
tags: Database Management System
---
# Dorm Service

# 前端

## Flow Chart
[figma link](https://www.figma.com/file/fzbRmZ243Jk48DUb9UeaoU/flowchart?node-id=0%3A1)
## Wireframe
[figma read-only link](https://www.figma.com/file/LQyQTHnrP1AnYmtc7V3nr4/wireframe?node-id=0%3A1)
## Frontend Development
### Setup
```javascript=
npm install
npm start
...
```
# API Documentation

## 各處通用之 APIs
### GET /service
#### description: 
獲取 Service Table 所有詳細
#### request body schema
null
#### response 
* 200 : successful operation
```
[
  {
    serviceId:             integer
    serviceName:           string
    serviceDescription:    string
  }
]
```

### GET /locations
#### description
獲取 locations table 的所有詳細資料
#### request body schema
null
#### response
* 200 : successful operation
```
[
  {
    locationId:     integer
    locationName:   string
    class:          integer
    longitude:      integer
    latitude:       integer
  }
]
```
* 400 : error
## 註冊、登入及個人資料相關 (郭)
### POST /users
#### description:
註冊時使用，透過傳入 request body 即會在 users table 中新增一名 user，並回傳 user_id。

後端實作注意：除了在 Users 表增加一個 entry，還要同時在 User_Points 表同時增加四個 entries（for every service）#by 郭：耶我做出來ㄌ
#### request body schema
```
{
    userName: string,
    password: string,
    gender: string,
    phoneNum: string,
    fbUrl: string,
    dormID: integer
}
```
#### response body schema
* 201 Created : user created successfully
```
user_id: integer
```
### POST /users/login
#### description:
當使用者進行登入時會使用。透過傳入 request body 即會回傳該 user 的 user_id。
#### request body schema
```
{
    userName: string,
    password: string,
}
```
#### response
* 200 OK : login successfully
```
{
    user_id: integer 
}
```
* 404 NOT FOUND: combination of username and password is not found in Users.
### GET /users/{userId}
#### description:
當使用者要查看個人頁面時使用。透過傳入 user_id 即會回傳需要呈現於前端的資訊。
#### request body schema
```
user_id: integer
```
#### response
* 200 OK : request accepted
```
{
    userId: integer
    userName: string
    password: string
    gender: string
    phoneNum: string
    fbUrl: string
    dormId: integer
    userPoint: number
    userLevel: [string]
}
```
### GET /requests/history/{userId}
#### description:
問：我們確定不做歷史解決對吧？
當使用者要查看歷史刊登資訊時會使用。當傳入 userId 後，後端會根據 userId 回傳 requests table 中 userId == requesterId 及 accepted == true 的所有資料。
#### request body schema
```
{
    user_id: integer
}
```
#### response
* 200 OK : request accepted
```
{
    request_id: integer
    service_id: integer
    start_time: string
    act_start_time: timestamp
    reward: string
    requester_id: integer
    description: string
    end_time: timestamp
    act_end_time: timestamp
    title: string
    
}
```
<!-- ### GET /requests/history/detail/{requestId}
#### description:
當檢視歷史刊登時，想要點進各個歷史請求查看詳細資料時使用。當傳入想顯示的 requestId 後，後端會回傳此 requestId 對應的 services 的 table 中的詳細資料。
#### request body schema
```
{
    request_id: integer
}
```
#### response
* 200 OK : request accepted
依照不同服務會回傳不同的詳細屬性資料 -->
### PATCH /users/rateRequest
#### description:
當使用者移至歷史刊登頁面時，想針對特定歷史請求進行評分時使用。透過傳入想進行評分的 requestId、評分對象（applierId）及分數後，後端會將User_Points進行更新，其中Level_ID必須在每個等級的次數與平均分都達到門檻時(大於等於)才會屬於該等級，並在行動成功後回傳成功訊息。
#### request body schema
```
{
    request_id: integer
    applier_id: integer
    score: integer
}
```

#### response
* 200 OK : request accepted
## 任務發起、編輯及檢視發起中之任務相關 (翁)
### POST /requests/drive
#### description: 
建立一新的 Drive Service 任務。
#### request body schema:
```
{
  requesterId:     integer
  title:           string
  endTime:         string
  actStartTime:    string
  actEndTime:      string
  reward:          string
  description:     string
  fromId:          integer
  toId:            integer
}
```
#### response:
* 201 Created : drive_post created successfully
```
{
    requestId:    integer
}
```
### POST /requests/heavyLifting
#### description: 
建立一新的 Heavylifting 任務。當 toId/fromId 為 2 (種類為宿舍) 時，才需要紀錄樓層。
#### request body schema:
```
{
    requesterId:  integer
    title:        string
    endTime:      string
    actStartTime: string
    actEndTime:   string
    reward:       string
    description:  string
    fromId:       integer
    fromFloor:    integer
    toId:         integer
    toFloor:      integer
    item:         string
    itemWeight:   string
}
```
#### response:
* 201 Created : heavyLifting_post created successfully
```
{
    requestId:     integer
}
```
### POST /requests/killCockroach
#### description: 
建立一新的 killing cockroach 任務。
#### request body schema:
```
{
  requesterId:         integer
  title:               string
  endTime:             string
  actStartTime:        string
  actEndTime:          string
  reward:              string
  description:         string
  requesterLocationId: integer
}
```
#### response:
* 201 Created : killing_cockcroach_post created successfully
```
{
    requestId:     integer
}
```
### POST /requests/hostEvent
#### description: 
建立一新的 Host event 任務。
#### request body schema:


```
{
  requesterId:      integer
  title:            string
  endTime:          string
  actStartTime:     string
  actEndTime:       string
  description:      string
  eventLocationId:  integer
  locationDetail:   string
}

```
#### response:
* 201 Created : host_event_post created successfully
```
{
    requestId:     integer
}
```
### GET /requests/ongoing/{requesterId}
#### description: 
檢視當前使用者正在進行中(招募中)的任務。(當endTime晚於當前時間)
#### request body schema:
```
null
```
#### response:
* 200 : successful operation
```
[
    {
        request_id: integer
        service_id: integer
        start_time: string
        act_start_time: timestamp
        reward: string
        requester_id: integer
        description: string
        end_time: timestamp
        act_end_time: timestamp
        title: string
    }
]
```
* 404 : Not Found

### PATCH /requests/revise/drive
#### description:
更新任務類型為"drive"的任務詳細內容
#### request body schema
```
{
    requestId:    integer
    title:        string
    description:  string
    endTime:      string
    actStartTime: string
    actEndTime:   string
    reward:       string
    fromId:       integer
    toId:         integer
}
```
#### response
* 200 OK : request accepted
```
null
```
* 404 : Not Found

### PATCH /requests/revise/heavylifting
#### description:
更新任務類型為"heavylifting"的任務詳細內容

#### request body schema
```
{
    requestId:    integer
    title:        string
    description:  string
    endTime:      string
    actStartTime: string
    actEndTime:   string
    reward:       string
    fromId:       integer
    fromFloor:    integer
    toId:         integer
    toFloor:      integer
    item:         string
    itemWeight:   string
}
```
#### response
* 200 OK : request accepted
```
null
```
* 404 : Not Found


### PATCH /requests/revise/killCockroach
#### description:
更新任務類型為"killCockroach"的任務詳細內容

#### request body schema
```
{
    requestId:    integer
    title:                string
    description:          string
    endTime:              string
    actStartTime:         string
    actEndTime:           string
    reward:               string
    requesterLocationId   integer
}
```
#### response
* 200 OK : request accepted
```
null
```
* 404 : Not Found


### PATCH /requests/revise/hostEvent
#### description:
更新任務類型為"hostEvent"的任務詳細內容

#### request body schema
```
{
    requestId:    integer
    title:            string
    description:      string
    endTime:          string
    actStartTime:     string
    actEndTime:       string
    eventLocationId   integer
    locationDetail    string
}
```
#### response
* 200 OK : request accepted
```
null
```
* 404 : Not Found

## 通知功能相關 (葉)
* 有人應徵你的任務了喔
### GET /appliers/asked/{requestId}
#### description: 
透過requestId，取得正在應徵該request的所有應徵者資料。
#### request body schema : null
#### response 
* 200 : successful operation
```
[
    {
        requestId:	integer
        requesterId:	integer
        title:	string
        description:	string
        serviceId:	integer
        startTime: string
        endTime:	string
        actStartTime:	string
        actEndTime:	string
        reward:	string
    }
]
```


* 你的應徵被接受了喔
### GET /requests/accepted/{applierId}
#### description: 
篩選出該應徵者應徵的貼文中，被發文者接受的貼文。

#### request body : null
#### response
* 200 : successful operation
```
[
    {
        requestId:	integer
        requesterId:	integer
        title:	string
        description:	string
        serviceId:	integer
        startTime: string
        endTime:	string
        actStartTime:	string
        actEndTime:	string
        reward:	string
    }
]
```
* 你的應徵失敗了喔
### GET /requests/refused/{applierId}
#### description: 
篩選出該應徵者應徵的貼文中，被發文者拒絕的貼文。

#### request body : null
#### response
* 200 : successful operation
```
[
    {
        requestId:	integer
        requesterId:	integer
        title:         string
        description:	string
        serviceId:	integer
        startTime:  string
        endTime:	string
        actStartTime:	string
        actEndTime:	string
        reward:	string
    }
]
```

### PATCH /requests/accept
#### description: 
接受應徵者的要求

#### request body schema: 
```
{
    requestId: integer
    applierId: integer
}
```
#### response
* 200 OK : request accepted
```
{
    requestId:	integer
    applierId:	integer
    status:	integer
}
```

### PATCH /requests/refuse
#### description: 
拒絕應徵者的要求

#### request body schema: 
```
{
    requestId: integer
    applierId: integer
}
```
#### response
* 200 OK : request accepted
```
{
    requestId:	integer
    applierId:	integer
    status:	integer
}
```


## 瀏覽刊登中任務及申請任務相關 (陳)
### GET /requests/available
#### description:
取得可以應徵的所有任務
requests table: End_Time >= now_time

#### request body schema
```
null 
```
#### response
* 200 OK : request accepted
```
[    
    {
        requestId:      integer
        requesterId:    integer
        title:          string
        description:    string
        serviceId:      integer
        startTime:      string
        endTime:        string
        actStartTime:   string
        actEndTime:     string
        reward:         string
    }
]
```

### GET /requests/drive/{requestId}
#### description:
取得任務類型為"drive"的任務詳細內容
Get drive request by ID

#### request body schema
```
null
```
#### response
* 200 OK : request accepted
```
[
  {
    "DriveServicePost": {
      "from_id":        integer
      "to_id":          integer
      "request_id":     integer
    },
    "Request": {
      "request_id":     integer
      "service_id":     integer
      "start_time":     string
      "act_start_time": string
      "reward":         string
      "requester_id":   integer
      "description":    string
      "end_time":       string
      "act_end_time":   string
      "title":          string
    }
  }
]
```
* 404 : Not Found

### GET /requests/heavylifting/{requestId}
#### description:
取得任務類型為"heavylifting"的任務詳細內容
Get heavylifting request by ID

#### request body schema
```
null
```
#### response
* 200 OK : request accepted
```
[
  {
    "HeavyliftingServicePost": {
      "request_id":     integer
      "to_id":          integer
      "to_floor":       integer
      "item_weight":    string
      "from_id":        integer
      "from_floor":     integer
      "item":           string
    },
    "Request": {
      "request_id":     integer
      "service_id":     integer
      "start_time":     string
      "act_start_time": string
      "reward":         string
      "requester_id":   integer
      "description":    string
      "end_time":       string
      "act_end_time":   string
      "title":          string
    }
  }
]
```
* 404 : Not Found


### GET /requests/killCockroach/{requestId}
#### description:
取得任務類型為"killCockroach"的任務詳細內容
Get killCockroach request by ID

#### request body schema
```
null
```
#### response
* 200 OK : request accepted
```
[
  {
    "KillCockroachServicePost": {
      "requester_location_id": integer
      "request_id":            integer
    },
    "Request": {
      "request_id":            integer
      "service_id":            integer
      "start_time":            string
      "act_start_time":        string
      "reward":                string
      "requester_id":          integer
      "description":           string
      "end_time":              string
      "act_end_time":          string
      "title":                 string
    }
  }
]
```
* 404 : Not Found


### GET /requests/hostEvent/{requestId}
#### description:
取得任務類型為"hostEvent"的任務詳細內容
Get hostEvent request by ID

#### request body schema
```
null
```
#### response
* 200 OK : request accepted
```
[
  {
    "HostEventPost": {
      "request_id":         integer
      "location_detail":    string
      "event_location_id":  integer
    },
    "Request": {
      "request_id":         integer
      "service_id":         integer
      "start_time":         string
      "act_start_time":     string
      "reward":             string
      "requester_id":       integer
      "description":        string
      "end_time":           string
      "act_end_time":       string
      "title":              string
    }
  }
]
```
* 404 : Not Found

### POST /applier/{requestId}
#### description:
當應徵者按下「我要幫忙」按鈕後，呼叫此 API 更新此任務的應徵者
update a request by id

後端實作注意：要在 Appliers table 增加一則應徵者紀錄

#### request body schema
```
{
    applierId: integer
} 
```
#### response
* 200 OK : request accepted
```
[    
    {
        applierId:    integer
        requestId: integer
        status: integer
    }
]
```

* 404 : Not Found
* 409 : Conflict （this request: `asked` = true, 此任務已經有人應徵）


# 後端

## Database Visualization
https://app.diagrams.net/#G1toYS_Zl0Nb43LqaCm_y2pKx4YqkxRxWE
## Backend Development
### Setup
進入 Dorm_Service_Backend 後：
1. 創建虛擬環境 (windows)：python3 -m venv dorm_service
2. 進入虛擬環境：dorm_service/Scripts/activate
3. 安裝所需套件：pip install -r requirements.txt

#### Run the server
進入 Dorm_Service_Backend 後：
1. 進入虛擬環境：dorm_service/Scripts/activate
2. cd App
3. uvicorn main:app --reload
4. uvicorn 會替 FastAPI 開啟 server，接著上 localhost:8000/docs，如果可以看到 APIs 就成功了！(所謂的起後端？

#### About connecting to local postgresql
現階段的連線都是用 Localhost <br>
所以沒有辦法共用一個 postgresql 更新資料<br>
現階段先麻煩大家連線到自己的 local host。
前置作業如下：<br>
1. 要先在自己的 postgresql new database (取名為 dorm_service)
2. 將 Dorm_Service_Backend/App/database.py 內的 engine 改成自己的密碼

### db setup(restore)
1. 首先先建立一個 db 叫做 dorm_service
![](https://i.imgur.com/uhqnTZL.png)
2. 點擊 dorm_service/Schemas/public 右鍵，並點選 "Restore"，如果跳錯請看[下方](###如果點擊"restore"時跳錯要怎麼解)
![](https://i.imgur.com/yk8XHG7.png)
3. 選擇檔案路徑->點擊 dormDB 這個 custom 檔案後按下 "Select" 按鈕
![](https://i.imgur.com/9xrq6nA.png)
![](https://i.imgur.com/iESySj0.png)
4. 最後按下 "Restore" 這個按鈕就可以成功建立所有 table
![](https://i.imgur.com/A630tzO.png)

### db backup
1. 點擊 dorm_service/Schemas/public 右鍵，並點選 "Backup"
![](https://i.imgur.com/A4uMUT9.png)
2. `Filename` 要填寫完整存檔路徑，`Format` 要選擇 Custom，其他都不用填寫，直接按 "Backup" 按鈕即可
![](https://i.imgur.com/32o9zD9.png)


### 如果點擊"restore"時跳錯要怎麼解
1. 請參考這個[網站](https://dba.stackexchange.com/questions/149169/binary-path-in-the-pgadmin-preferences )
2. 因為 postgersql 有更改過頁面，所以可以參考下方設定，另外，要記得將版本號更改為 14 
![](https://i.imgur.com/Wrcy1Bh.png)



