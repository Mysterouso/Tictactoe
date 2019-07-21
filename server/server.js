const express = require("express")
const socketio = require("socket.io")
const nanoid = require("nanoid/async")
const app = express()
const http = require('http').createServer(app);

app.use(express.json())

app.use(express.urlencoded({extended:true}))


const rooms = {}

//Create room 
// Append room to rooms
// need room id , is full,users needed to join

//Change of plan
// Implement MAP data structure 
//More appropriate for situation

const io = socketio(http)

io.on("connection",(socket)=>{

    //General interactions
    socket.on("create-game", async (name)=>{
        const roomName = await nanoid(10);
        const userID = socket.id;
        if(!rooms[roomName]){
            rooms[roomName] = {
                                users:[
                                    {
                                        name,
                                        userID
                                    }
                                ]
                            };
        }
        socket.join(roomName)
    })

    socket.on("join-game",({name,roomID})=>{
        if(!roomID){
            //Getting random room from rooms
            const roomKeys = Object.keys(rooms)
            const randIndex = 
                Math.floor(Math.random() * roomKeys.length)
            const randKey = roomKeys[randIndex]
            if(rooms[randKey].users.length===1){
                socket.join(randKey)
                rooms[randKey].users.push({name,userID:socket.id})
                io.in(randKey).emit("game-starting",rooms[randKey])
            };
        }
        else{
         console.log("Placeholding the placehold")   
        }
    })
    //To check rooms from client(temporary)
    socket.on("show-rooms",(data)=>{
        socket.emit("room",rooms)
    })

    socket.on("disconnect",()=>{
        Object.keys(rooms).forEach(room=>{
            
            let roomUsers = (rooms[room]).users || {};
            
            const index = roomUsers.findIndex(user=>user.userID===socket.id)
            
            if(index>=0){
                
              if(roomUsers.length===1) return delete rooms[room];

              roomUsers.splice(index,1)
            }
        })
        //Need to account for player leaving mid-game - "player left message"
    })

    //Chatting

    //Gameplay progression

    //Reset game
})

http.listen(5000,()=>console.log("Server started"))


