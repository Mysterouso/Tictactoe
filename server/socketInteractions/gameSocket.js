function gameSocket(io,socket,rooms){

    socket.on("players-ready",({roomID})=>{
        
        const randIndex = Math.round(Math.random())
        const firstTurn = rooms[roomID].users[randIndex]
        socket.emit("first-turn",{firstTurn})


    })

}

module.exports = gameSocket