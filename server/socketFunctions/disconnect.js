module.exports = function (socket,rooms){

    let userToNotify;

    Object.keys(rooms).forEach(room=>{
        
        let roomUsers = (rooms[room]).users || {};
        
        const index = roomUsers.findIndex(user=>user.userID===socket.id)
     
        if(index>=0){
            
          if(roomUsers.length===1) return delete rooms[room];
          roomUsers.splice(index,1)
          userToNotify = roomUsers[0].userID
          return userToNotify
        }
       
    })
}