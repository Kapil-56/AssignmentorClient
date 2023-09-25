// import React from 'react'
// import { useEffect } from 'react'
// import { useState } from 'react'
// import { Image } from 'react-bootstrap'
// import avatar from './avatar.jpg'


// function Online({ onlineUsers, user }) {
//     const [friends, setFriends] = useState([])
//     const [onlinefriends, setOnlinefriends] = useState([])
//     const [ss, setSs] = useState('')

//     useEffect(() => {
//         const getConversation = () => {
//             fetch(`/conversation/${user}`, {
//                 method: "GET"
//             }).then(res => res.json())
//                 .then(result => {
//                     setFriends(result)
//                 })
//         }
//         getConversation()
//     }, [user])


//     useEffect(() => {
//         setOnlinefriends(friends.filter(f => onlineUsers.some(o => f.members.includes(o.userId))));
//         onlineUsers.forEach((ou) => {
//             friends.forEach((fd) => {
//                 let filteredFriends = fd.members.filter(item => item !== user)
//                 if (ou.userId.includes(filteredFriends)) {
//                     console.log(ou.userId);
//                 }
//             })

//         });

//     }, [friends, onlineUsers]);








//     return (
//         <div className="d-flex align-items-center gap-2 my-4 " style={{ cursor: "pointer" }}>
//             <Image src={avatar}></Image>
//             {/* {console.log(onlinefriends)} */}
//             {/* {console.log(onlinefriends, "this")} */}
//             <span>{`onlinefriends`}</span>
//         </div>
//     )
// }

// export default Online