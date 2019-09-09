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

io.on("connection",(socket)=>{

    //---------------------------------General----------------------------------------//

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
        io.to(socket.id).emit("room-created",{roomID,userID,user:name})
    })

    socket.on("join-game",({name,roomID})=>{
        // Todo - should send if game was not found -- on client should resend join request if game not found
        const roomKeys = Object.keys(rooms)
        const numOfRooms = roomKeys.length
        //Emit event if no rooms exist

        if(numOfRooms <= 0){ return io.to(socket.id).emit("no-rooms")}

        if(!roomID){
            
            for(let i = 0; i < numOfRooms; i++){
                const currentRoomKey = roomKeys[i]
                const currentRoom = rooms[currentRoomKey]

                if( !currentRoom.isPrivate && currentRoom.users.length===1){
                    socket.join(currentRoomKey)
                    currentRoom.users.push({name,userID:socket.id})
                    // Since roomID is being used as a key, it needs to be appended onto the room object when emitted
                    io.in(currentRoomKey).emit("game-starting",{...currentRoom,roomID:currentRoomKey,userID:socket.id})
                }
            }
        }
        //Find room by id given
        else if(roomID.length === 10){
           const roomToFind = roomKeys.find(room=>room === roomID)
           const roomUsers = rooms[roomToFind].users
           
           if(roomToFind){ 
               if(roomUsers.length === 1){
                    socket.join(roomToFind)
                    rooms[roomToFind].users.push({name,userID:socket.id})
                    io.in(roomToFind).emit("game-starting",{...rooms[roomToFind],roomID:roomToFind,userID:socket.id})
               }
               else{
                   io.to(socket.id).emit("room-full")
               }
            }
            //If room not found, enter new room or take back to homepage - still deciding
            // Give input error -
            else{
                io.to(socket.id).emit("invalid-room")
            }
        }
        else io.to(socket.id).emit("invalid-room")
    })

    socket.on("disconnect",()=>{
        
        
        const userToNotify = disconnect(socket,rooms)
        console.log("There has been a disconnection")
        console.log("user id ",userToNotify)
        io.to(userToNotify).emit("player-disconnected",userToNotify)

        //Pending - need to create logic for leaving after game ends
        //Could be done on client -- maybe no further action is needed

        
        //Need to account for player leaving mid-game - "player left message"
        // Again, single endpoint could be hit by client - determining what to do can be delegated to client
    })

     //To check rooms from client(temporary)
     socket.on("show-rooms",(data)=>{
        socket.emit("room",rooms)
    })

    socket.on("test",()=>socket.emit("test-run"))

    //---------------------------------Matchmaking----------------------------------------//

    socket.on("leave-matchmaking",(roomID)=>{

        try{
            delete rooms[roomID]
            io.to(socket.id).emit("matchmaking-left")
        }
        catch(e){
            console.log(e)
        }

    })

    socket.on("verify-player",({identifier,roomID})=>{

        const currentRoom = rooms[roomID]
        
        if(!currentRoom) return io.to(socket.id).emit("player-not-verified")

        const isPlayer = currentRoom.users.findIndex(user=>user.userID === identifier)

        if(isPlayer>=0){
            io.to(socket.id).emit("player-verified")
            
        }
        else{
            io.to(socket.id).emit("player-not-verified")
        }

    })

    function handleRand(roomID){
        const randIndex = Math.round(Math.random())
        const firstTurn = rooms[roomID].users[randIndex]
        console.log("The rand index was ",randIndex ,"and user was ", firstTurn)
        return firstTurn
    }

    socket.on("select-first-turn",({identifier,roomID})=>{
        let firstTurn = handleRand(roomID)
        io.in(roomID).emit("first-turn",{firstTurn})
    })

    //Gameplay progression

    socket.on("player-moved",({roomID,position})=>{
        socket.to(roomID).emit("opponent-moved",{position})
    })

    // gameSocket(io,socket,rooms)
    
    //Reset game
    socket.on("request-rematch",({ roomID })=>{
        socket.to(roomID).emit("rematch-requested")
    })

    socket.on("rematch-response",(({ response,roomID })=>{
        if(response){ 
            socket.to(roomID).emit("rematch-accepted",{response});
            console.log("accepted")
            let firstTurn = handleRand(roomID)
            io.in(roomID).emit("first-turn",{firstTurn})

        }
        else{ socket.to(roomID).emit("rematch-declined",{response});console.log("declined")}
        // logic to restart game state if rematch accepted
    }))

    // Chatting

    socket.on("send-message",({message,roomID,user})=>{
        if(!rooms[roomID]) return
        socket.to(roomID).emit("message-received",({message,user}))
    })


})

http.listen(5000,()=>console.log("Server started"))


