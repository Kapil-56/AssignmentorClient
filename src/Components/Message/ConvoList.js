import React, { useEffect, useState } from "react";
import { Image, Spinner } from "react-bootstrap";
import avatar from "./avatar.jpg";

//************REACT--ICONS********** */
import { RxDotFilled } from "react-icons/rx";
import Skeleton from "react-loading-skeleton";

function ConvoList({
  convo,
  currentUser,
  isLast,
  onlineUsers,
  messages,
  currentChat,
  arrivingMessage,
  mySend,
  getConversation,
}) {
  const [user, setUser] = useState("");
  const [post, setPost] = useState("");
  const [onlinefriends, setOnlinefriends] = useState([]);
  const [setterId, setSetterId] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [notifications, setNotifications] = useState({
    notiCount: 0,
    notiChatId: null,
  });

  const [MsgRead, setMsgRead] = useState(true);
  const [lastInteraction, setLastInteraction] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const friendId = convo.members.find((m) => m !== currentUser._id);
    const getUser = () => {
      fetch(`/user/${friendId}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((result) => {
          setUser(result);
        });
    };

    const getPost = () => {
      fetch(`/posts/${convo?.postId}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((result) => {
          setPost(result);
        });
    };
    getUser();
    getPost();
    //convo
  }, []);

  useEffect(() => {
    if (user && post && lastMessage) {
      setLoading(false);
    }
  }, [user, post, lastMessage]);

  useEffect(() => {
    if (isLast) {
      setLastMessage(isLast);
    }
  }, [isLast]);

  // useEffect(() => {
  //   const getLastMessages = () => {
  //     if (convo) {
  //       fetch(`/lastessage/${convo._id}`, {
  //         method: "GET",
  //       })
  //         .then((res) => res.json())
  //         .then((result) => {
  //           // setLastMessage(result);

  //           // // if (
  //           //   result.senderId === currentUser?._id ||
  //           //   currentChat?.members.includes(arrivingMessage?.sender)
  //           // ) {
  //           //   setMsgRead(true);
  //           if (result.senderId === currentUser?._id) {
  //             setMsgRead(true);
  //           } else {
  //             // console.log('works');
  //             console.log("msg read");
  //             setMsgRead(result.readFlag);
  //           }
  //           // setLastInteraction(result.createdAt)
  //           // const lastInteraction = result.createdAt;
  //           // updateLastInteraction(convo._id, lastInteraction);
  //         })
  //         .catch((err) => console.log(err));
  //     } else console.log("error");
  //   };
  //   getLastMessages();
  //   ///arrivingMessage, messages, lastMessage

  //   ///last was messages
  // }, [arrivingMessage]);

  //add a read flag to the last message

  useEffect(() => {}, [mySend, arrivingMessage]);

  useEffect(() => {
    if (arrivingMessage) {
      if (convo._id === arrivingMessage.conversationId) {
        setLastMessage(arrivingMessage);
        console.log("arrivingMessage", arrivingMessage);
        if (arrivingMessage.sender !== currentUser._id) {
          setMsgRead(false);
        }
      }
      // if (convo.members.includes(arrivingMessage?.sender)) {
      //   setLastMessage(arrivingMessage);

      // if (!currentChat || currentChat._id !== convo._id) {
      //   setMsgRead(false);
      // }
      // }
    }
  }, [arrivingMessage]);

  useEffect(() => {
    if (mySend?.conversationId === convo?._id) {
      // console.log(mySend.conversationId,convo._id);
      setLastMessage(mySend);
    }
  }, [mySend]);

  useEffect(() => {
    onlineUsers.forEach((ou) => {
      let filteredFriends = convo.members.filter(
        (item) => item !== currentUser._id
      );
      if (ou._id.includes(filteredFriends)) {
        setSetterId(true);
      }
    });

    // onlineUsers.forEach((ou) => {
    //   console.log(ou);
    // });
  }, [onlineUsers, convo]);

  //when user goes offline set setterId to false

  useEffect(() => {
    const filteredFriends = convo.members.filter(
      (item) => item !== currentUser._id
    );
    const setterIdSet = onlineUsers.some((ou) =>
      ou._id.includes(filteredFriends)
    );
    setSetterId(setterIdSet);
  }, [onlineUsers]);

  // const show = (e) => {
  //     if (!MsgRead) {
  //         let par = document.getElementsByClassName("parent")
  //         // console.log("e.currentTarget.parentElement.classList",par[index]?.classList);
  //         par[index]?.classList.add('order-first')
  //         // console.log(index);
  //     }
  //     // else{
  //     //     let par = document.getElementsByClassName("parent")
  //     //     par[index]?.classList.add('order-last')
  //     // }
  //     // e.currentTarget.parentElement.classList.add('order-first')
  // }

  const deleteConvo = (e) => {
    e.stopPropagation();
    // alert(convo?._id);

    fetch(`/conversation/${convo._id}`, {
      method: "DELETE",
      headers: {
        // 'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error("Failed to delete conversation");
        }
        // handle successful response
        getConversation();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const limit = (string, length, end = "...") => {
    return string?.length < length
      ? string
      : string?.substring(0, length) + end;
  };

  return (
    <>
      {loading ? (
        <div className="px-2  py-1 d-flex gap-3 align-items-center justify-content-between my-3">
          <Skeleton circle height={70} width={70} />
          <Skeleton height={90} width={190} />
        </div>
      ) : (
        <div className="slide-left">
          {/* <div className="px-2 py-1 d-flex gap-3 align-items-center justify-content-between my-3">
            <Skeleton circle height={70} width={70} />
            <Skeleton height={90} width={190} />
          </div> */}
          <div
            className={`d-flex align-items-center my-3 p-3 justify-content-between`}
            style={{ cursor: "pointer" }}
          >
            {/* {!MsgRead ? (e) => console.log(e.currentTarget) : null} */}
            {/* {show()} */}
            <div className="d-flex gap-4">
              <div className="position-relative">
                {setterId ? (
                  <span
                    style={{ top: "-6px" }}
                    className="position-absolute  p-2 bg-success border border-light rounded-circle"
                  ></span>
                ) : (
                  ""
                )}
                {
                  <span
                    className="position-absolute start-100 translate-middle rounded-circle"
                    style={{ top: "90%" }}
                  >
                    <Image
                      style={{ width: "1.5rem" }}
                      src={
                        user?.avatar
                          ? `data:image/svg+xml;base64,${user?.avatar}`
                          : avatar
                      }
                    ></Image>
                  </span>
                }
                <Image
                  // style={{ width: "3rem" }}
                  className="rounded shadow-sm"
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "contain",
                  }}
                  alt="avatar"
                  // src={
                  //   user?.avatar
                  //     ? `data:image/svg+xml;base64,${user?.avatar}`
                  //     : avatar
                  // }
                  src={post?.photo ? post?.photo : avatar}
                ></Image>
                {/* {console.log(user?.avatar)} */}
              </div>
              <div className="d-flex flex-column justify-content-center ">
                <span className=" fw-bold">{user?.name}</span>
                {/* <span className="fs-6 fw-light">{limit(post.title, 10)}</span> */}
                <div className=" position-relative">
                  <span className={!MsgRead ? "fw-bold" : "text-muted"}>
                    <span className="me-1">&#10004;</span>
                    {lastMessage
                      ? limit(lastMessage?.text || lastMessage, 10)
                      : ""}
                  </span>
                  {!MsgRead ? (
                    <RxDotFilled className="text-primary fs-2"></RxDotFilled>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            {/* <BiTrashAlt onClick={deleteConvo} className='text-danger ' /> */}
            <span
              className="text-danger"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete this conversation?"
                  )
                ) {
                  deleteConvo();
                }
              }}
            >
              Delete
            </span>
          </div>
          <div style={{ borderBottom: "1px solid rgba(14,4,5,0.2)" }}></div>
        </div>
      )}
    </>
  );
}

export default ConvoList;
