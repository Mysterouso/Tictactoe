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
            
            // let roomFound = false
            // Not a good idea to block server with loop -- stuck forever if no rooms available
            // Check if there rooms at all
            // keep track of iteration - use a for loop
            // while(!roomFound){
                //Getting random room from rooms
            //     const randIndex = 
            //         Math.floor(Math.random() * roomKeys.length)
            //     const randKey = roomKeys[randIndex]
            //     if(rooms[randKey].users.length===1){
            //         socket.join(randKey)
            //         rooms[randKey].users.push({name,userID:socket.id})
            //         io.in(randKey).emit("game-starting",rooms[randKey])
            //         roomFound = true
            //     };
            // }
            //////Refactoring--
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
        
        const userToNotify = disconnect(socket,rooms)

        io.to(userToNotify).emit("player-disconnected")
        //Pending - need to create logic for leaving after game ends

        
        //Need to account for player leaving mid-game - "player left message"
    })

    socket.on("leave-lobby",(roomID)=>{

        try{
            delete rooms[roomID]
            io.to(socket.id).emit("lobby-left")
        }
        catch{
            console.log("Theres a bug somewhere")
        }

    })

    //Chatting

    //Gameplay progression

    //Reset game
})

http.listen(5000,()=>console.log("Server started"))


