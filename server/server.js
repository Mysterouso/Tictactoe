const express = require("express")
const socketio = require("socket.io")
const nanoid = require("nanoid/async")
const app = express()
const http = require("http").createServer(app);
const gameSocket = require("./socketInteractions/gameSocket");
const disconnect = require("./socketFunctions/disconnect");

app.use(express.json())

app.use(express.urlencoded({extended:true}))

const rooms = {}

const io = socketio(http)

//Allow option to disable random joins
// Need structure update -- isPrivate property in room object 

io.on("connection",(socket)=>{

    //General interactions
    socket.on("create-game", async ({name,isPrivate})=>{
        const roomID = await nanoid(10);
        const userID = socket.id;

        if(!rooms[roomID]){
            rooms[roomID] = {
                            isPrivate,
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

        if(!roomID && roomKeys.length > 0){
            
            for(let i=0;i<roomKeys.length;i++){
                const currentRoomKey = roomKeys[i]
                const currentRoom = rooms[currentRoomKey]
                //Joining room if not already full

                if( !currentRoom.isPrivate && currentRoom.users.length===1){
                    socket.join(currentRoomKey)
                    currentRoom.users.push({name,userID:socket.id})
                    io.in(currentRoomKey).emit("game-starting",currentRoom)
                }
            }
        }
        else if(roomID.length === 10){
            setTimeout(()=>{
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
        },5000)
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
        
        const userToNotify = disconnect(socket,rooms)

        io.to(userToNotify).emit("player-disconnected")

        //Pending - need to create logic for leaving after game ends
        //Could be done on client -- maybe no further action is needed

        
        //Need to account for player leaving mid-game - "player left message"
        // Again, single endpoint could be hit by client - determining what to do can be delegated to client
    })

    socket.on("leave-matchmaking",(roomID)=>{

        try{
            delete rooms[roomID]
            io.to(socket.id).emit("matchmaking-left")
        }
        catch{
            //Endpoint being hit by client -- no need to do anything else
            console.log("Theres a bug somewhere")
        }

    })

    //Chatting

    //Gameplay progression

    //Reset game
})

http.listen(5000,()=>console.log("Server started"))


