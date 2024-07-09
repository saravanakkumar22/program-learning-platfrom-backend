
const express = require("express");
const server = express();
const http = require("http").createServer(server);
const { Server } = require("socket.io");
const mysql = require("mysql");
const cors = require("cors");
const { error } = require("console");

server.use(express.json());
server.use(cors());

const io = new Server(http, { cors: { origin: "https://program-learning-platform-backend.onrender.com" } });






//---------------------Database connection-----------------

 const Connection = mysql.createConnection({
    port: "3306",
    host: "bgjx071eqchw98a1ogig-mysql.services.clever-cloud.com",
    user: "uedq7trjza8dnnkn",
    password: "1OLbbNTEtV2q9KTxKfYu",
    database: "bgjx071eqchw98a1ogig"
});

Connection.connect((err) => {
    if(err){
        console.error('Error connecting: ' + err.stack);
        return;
      }
      console.log('Connected as id ' + Connection.threadId);
    
});

//------------------data get from database -----------------

server.get("/", (req, res) => {
    const qr = "SELECT * FROM studentregister";
    Connection.query(qr, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        res.json(result);
    });
});


//-----------Login Data Validation-------------------

server.post("/login", (req, res, next) => {
    const { Email, Password } = req.body;
    const qr = "SELECT * FROM studentregister"
    Connection.query(qr, (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).json({ Message: "server error" });
        }
        let profileData = "";
        let correctEmail = false;
        let correctPassword = false;
        let logUserPswd = false;
        for (let regData of result) {
            if (Email === regData.Email) {
                correctEmail = true;
                if (Password === regData.Password) {
                    correctPassword = true;
                    logUserPswd = true;
                    profileData = regData;
                    break;
                }
            }
        }
        if (correctEmail && correctPassword) {
            res.json({
                profileData,
                logUserPswd,
                message: "Login Successfully Completed"
            });
        }
        else if (correctEmail) {
            res.json({ message: "InCorrect Password" });
        }
        else {
            res.json({ message: "Incorrect Email Id" });
        }
    });
});


//--------------data insert into database--------------------

server.post("/post", (req, res) => {
    const { Name, Email, Mobile, Password } = req.body;
    const qr = `INSERT INTO studentregister (Name, Email, Mobile, Password) VALUES (?, ?, ?, ?)`;
    Connection.query(qr, [Name, Email, Mobile, Password], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to insert data" });
        }
        res.json({ message: "Data inserted successfully" });
    });
});

// ------------get single data-------------------

server.get("/user/:id", (req, res) => {
    const gId = req.params.id;
    const qr = `SELECT * FROM studentregister WHERE id = ?`;
    Connection.query(qr, [gId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.json({ message: `Data found for id ${gId}`, data: result });
    });
});

//---------------update single data------------------

server.put("/user/:id", (req, res) => {
    const uId = req.params.id;
    const { Name, Email, Mobile, Password } = req.body;
    const qr = `UPDATE studentregister SET Name = ?, Email = ?, Mobile = ?, Password = ? WHERE id = ?`;
    Connection.query(qr, [Name, Email, Mobile, Password, uId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to update data" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.json({ message: "Data updated successfully" });
    });
});

//-------------- delete data-----------------

server.delete("/user/:id", (req, res) => {
    const dId = req.params.id;
    const qr = `DELETE FROM studentregister WHERE id = ?`;
    Connection.query(qr, [dId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Failed to delete data" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Data not found" });
        }
        res.json({ message: "Data deleted successfully" });
    });
});

// dashBoard main contents course details insert into database------


server.post("/postProgramingLanguages", (req, res) => {
    const { id, header, image, content, footheader } = req.body;
    const qr = "INSERT INTO programinglanguages (id, header, image, content, footheader) VALUES (?, ?, ?, ?, ?)";
    Connection.query(qr, [id, header, image, content, footheader], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Server error" });
        }
        res.json({ message: "Data inserted in database" });
    });
});


//----------dashBoard main content courses show full details insert into database

server.post("/postProgramingLanguageDetails", (req,res) => {
    const {id,name,image,introheader,introduction,feature1,feature2,feature3,feature4,feature5,feature6,feature7,feature8,feature9,feature10,feature11}=req.body;
    const qr="INSERT INTO programinglanguagedetails VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    Connection.query(qr,[id,name,image,introheader,introduction,feature1,feature2,feature3,feature4,feature5,feature6,feature7,feature8,feature9,feature10,feature11] ,(err,result) => {
        if(err){
            console.error(err);
            return res.status(500).json({message:"server error",err});
        }
        res.json({message:"data inserted successfully"});
    });
});


//---------------dashboard main home content details get----------------------
server.get("/getProgramingLanguages", (req,res)=>{
    const  qr= "SELECT * FROM programinglanguages";
    Connection.query(qr, (err,result)=>{
        if(err){
            console.error(err);
            return res.status(500).json({message:"server error"});
        }
        res.json(result);
    })
});

// dashboard main content show full details---------------------

server.get("/getProgramingLanguageDetails", (req,res)=>{
    const qr="SELECT * FROM programinglanguagedetails";
    Connection.query(qr, (err,result)=>{
        if(err){
            console.error(err);
            res.status(500).json({message:"server error"});
        }
        res.json(result);
    });
});

//------------------Exercise Data insert into database-----------------
server.post("/postExerciseData", (req, res) => {
    const {exercisedata} = req.body;
    console.log(req.body)
    const qr = "INSERT INTO exercisesubmitdata (exercisedata) VALUES (?)";
    Connection.query(qr,[exercisedata], (err, result) => {
        if(err){
            console.error(err);
            res.status(500).json({err,message:"server error"});
        }
        res.json({ message:"exercise data inserted"});
    });
});


//-------------------Exercise single data get into database-----------------------
server.get("/getExerciseData/:id", (req, res) => {
    const exerciseid=req.params.id;
    const qr ="SELECT * FROM exercisesubmitdata WHERE id=?";
    Connection.query(qr,[exerciseid], (err, result) => {
        if(err){
            console.error(err);
            res.status(500).json({message:"server error"});
        }
        console.log("single data geted")
        res.json(result);
    });
});

//------------exercise all data get into database---------
server.get("/getAllExerciseData", (req, res) => {
    const qr="SELECT * FROM exercisesubmitdata";
    Connection.query(qr,(err,result)=>{
        if(err){
            console.error(err);
            res.status(500).json({message:"server error"});
        }
        console.log(result,"getallvalue");
        res.json(result);
    });
});

// socket.io connection
io.on("connection", (socket) => {
    console.log("socket.io connected");
    socket.on("message", (message,userName,sendTime)=>{
        console.log(message);

        const qrPost = "INSERT INTO messages(message,userName,sendTime) VALUES (?,?,?)";
        const qrGet = "SELECT *FROM messages ORDER BY id DESC LIMIT 1";
        Connection.query(qrPost, [message,userName,sendTime], (error,result) => {
            if(error){
                console.error(error);
            }
        });

        Connection.query(qrGet, (error, result) => {
            if(error){
                console.error(error);
            }
            socket.broadcast.emit("recive", {result}),
            console.log(result)
    });
    })
});

//old messages get-----and send message get

server.get("/getOldMessages", (req,res) => {
    const qrGet = "SELECT * FROM messages";
    Connection.query(qrGet,(error,result) => {
        if(error){
            console.error(error);
            res.status(500).json({message:"server error"});
        }
        res.json(result);
        console.log(result);
    })
});



//-------------------port-----------------------
 const PORT = process.env.PORT || 4000;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
