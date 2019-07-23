const express = require("express")
const socketio = require("socket.io")
const nanoid = require("nanoid/async")
const app = express()
const http = require("http").createServer(app);
const gameSocket = require("./socketInteractions/gameSocket");

app.use(express.json())

app.use(express.urlencoded({extended:true}))

const rooms = {}

const io = socketio(http)

io.on("connection",(socket)=>{

    //General interactions
    socket.on("create-game", async (name)=>{
        const roomID = await nanoid(10);
        const userID = socket.id;

        if(!rooms[roomID]){
            rooms[roomID] = {
                            users:[
                                {
                                    name,
                                    userID
                                }
                            ]
                        };
        }
        socket.join(roomID)
        io.to(socket.id).emit("room-created",{roomID})
    })

    socket.on("join-game",({name,roomID})=>{

        //Join games by roomID

        const roomKeys = Object.keys(rooms)

        if(!roomID){
            
            let roomFound = false

            while(!roomFound){
                //Getting random room from rooms
                const randIndex = 
                    Math.floor(Math.random() * roomKeys.length)
                const randKey = roomKeys[randIndex]
                //Joining room if not already full
                if(rooms[randKey].users.length===1){
                    socket.join(randKey)
                    rooms[randKey].users.push({name,userID:socket.id})
                    io.in(randKey).emit("game-starting",rooms[randKey])
                    roomFound = true
                };
            }
        }
        else if(roomID.length === 10){
            const roomIndex = roomKeys.findIndex(room=>room === roomID)
           if(roomIndex >= 0){ 
               roomToJoin = roomKeys[roomIndex]
               socket.join(roomToJoin)
               rooms[roomToJoin].users.push({name,userID:socket.id})
               io.in(roomToJoin).emit("game-starting",rooms[roomToJoin])
            }
            //If room not found, enter new room or take back to homepage - still deciding
            // Give input error -
            else{
                roomID = null;
                io.to(socket.id).emit("invalid-room")
            }
        }
        else if(roomID.length>10 || roomID.length <10 && roomID.length>0){
            io.to(socket.id).emit("invalid-room")
        }


       
    })
    //To check rooms from client(temporary)
    socket.on("show-rooms",(data)=>{
        socket.emit("room",rooms)
    })

    socket.on("disconnect",()=>{
        

        //Pending - need to create logic for leaving after game ends

        let userToNotify;

        Object.keys(rooms).forEach(room=>{
            
            let roomUsers = (rooms[room]).users || {};
            
            const index = roomUsers.findIndex(user=>user.userID===socket.id)
            
            if(index>=0){
                
              if(roomUsers.length===1) return delete rooms[room];
              roomUsers.splice(index,1)
              userToNotify = roomUsers[0].userID
              io.to(userToNotify).emit("player-disconnected")
            }
           
        })
        //Need to account for player leaving mid-game - "player left message"
    })

    //Chatting

    //Gameplay progression

    //Reset game
})

http.listen(5000,()=>console.log("Server started"))


