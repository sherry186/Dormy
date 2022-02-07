# Dormy 你的宿舍好幫手

說明影片: [https://youtu.be/RNknZ7edNKw]("https://youtu.be/RNknZ7edNKw")

## 專案簡介

Dormy 你的宿舍好幫手是一個媒合住宿需求與願意提供協助方的任務媒合平台。需求方可以透過平台刊登任務，供給方則能透過平台查看所有刊登中的任務，並針對能提供協助的任務發起應徵，等待需求方接受應徵。此外，Dormy 你的宿舍好幫手也提供了評分及榮譽機制。在成功媒合一項任務後，需求方可以根據供給方的表現進行評分，系統會根據供給方累積的表現提供榮譽徽章 (詳見影片 Demo)。如此，需求方將能透過應徵者的榮譽徽章了解其歷史評價並判斷其是否符合需求的期待。一方面降低了資訊不透明所帶來的風險，另一方面則能透過榮譽制讓供給者良好的表現被肯定。我們期望透過此平台，住宿生能不再因為不知從何找尋能提供協助的人而放棄求助，有能力提供協助的同學也能透過平台解決他人的問題。透過雙方共同的努力，讓宿舍環境更加友善、讓宿舍生活更加便利。

## 專案分工

在專案製作的分工上，我們分成了兩階段。第一階段的分工為前端、後端的開發以及前後端的溝通及 APIs 串接。第二階段的分工為書面報告撰寫和影片製作，細部分工內容將於書面報告的組員心得中講述。

### 第一階段

前端：巫芊瑩、陳沛妤<br>
後端：翁子婷、葉小漓<br>
前後端溝通與串接：郭子麟、陳冠伊<br>

### 第二階段

書面報告撰寫：陳沛妤、翁子婷、郭子麟、陳冠伊<br>
影片製作：巫芊瑩、葉小漓<br>

## 開啟流程

### 一、 建立資料庫

#### DB setup(restore)

1. 首先先建立一個 db 叫做 dorm_service  
   <img src="https://i.imgur.com/uhqnTZL.png" data-canonical-src="https://i.imgur.com/uhqnTZL.png" height="180" />
2. 點擊 dorm_service/Schemas/public 右鍵，並點選 "Restore"，如果跳錯請看[下方](###如果點擊"restore"時跳錯要怎麼解)
   <img src="https://i.imgur.com/yk8XHG7.png" data-canonical-src="https://i.imgur.com/yk8XHG7.png" height="400" />
3. 選擇檔案路徑-> 在 Dorm_Service/Dorm_Service_Backend 點擊 dormDB 這個 custom 檔案後按下 "Select" 按鈕
   <img src="https://i.imgur.com/9xrq6nA.png" data-canonical-src="https://i.imgur.com/9xrq6nA.png" height="300" />
   <img src="https://i.imgur.com/iESySj0.png" data-canonical-src="https://i.imgur.com/iESySj0.png" height="400" />
4. 最後按下 "Restore" 這個按鈕就可以成功建立所有 table
   <img src="https://i.imgur.com/A630tzO.png" data-canonical-src="https://i.imgur.com/A630tzO.png" height="300" />

#### 如果點擊"restore"時跳錯要怎麼解

1. 請參考這個[網站](https://dba.stackexchange.com/questions/149169/binary-path-in-the-pgadmin-preferences)
2. 因為 postgersql 有更改過頁面，所以可以參考下方設定，另外，要記得將版本號更改為 14
   <img src="https://i.imgur.com/Wrcy1Bh.png" data-canonical-src="https://i.imgur.com/Wrcy1Bh.png" height="400" />

### 二、 啟動後端

#### Setup

進入 Dorm_Service_Backend 後：

1. 創建虛擬環境
   - (windows)：python3 -m venv dorm_service
   - (macOS) : python3 -m venv dorm_service
2. 進入虛擬環境
   - (windows)：dorm_service/Scripts/activate
   - (macOS) : source dorm_service/bin/activate
3. 安裝所需套件：pip install -r requirements.txt

#### 連接資料庫

前置作業如下：<br>

1. 要先在自己的 postgresql new database (取名為 dorm_service)
2. 將 Dorm_Service_Backend/App/database.py 內的 engine 改成自己的密碼

#### Run the server

進入 Dorm_Service_Backend 後：

1. 進入虛擬環境
   - (windows)：dorm_service/Scripts/activate
   - (macOS) : source dorm_service/bin/activate
2. cd App
3. uvicorn main:app --reload
4. uvicorn 會替 FastAPI 開啟 server，接著上 localhost:8000/docs，如果可以看到 APIs 就成功了！

### 三、 啟動前端

### Run the server

1. cd Dorm_Service_Frontend/frontend
2. yarn/npm install
3. yarn/npm start

如果第三步出現問題的話，可嘗試在檔案夾中新增 <code>.env</code> 檔案，並在內新增 <code> SKIP_PREFLIGHT_CHECK=true</code>
