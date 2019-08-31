module.exports = function (socket,rooms){

    let userToNotify;

      Object.keys(rooms).every(room=>{
          
          let roomUsers = (rooms[room]).users || {};
          
          const index = roomUsers.findIndex(user=>user.userID===socket.id)

          if(index>=0){
            if(roomUsers.length===1){ 
              delete rooms[room]
              return false
            }
            roomUsers.splice(index,1)
            userToNotify = roomUsers[0].userID
            return false
          }
          return true
        
      })

    return userToNotify
    
}

// module.exports({id:"abc"},{"asdsad":{users:[{userID:"abc"},{userID:"dce"}]}})