import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Col,
  Container,
  Image,
  Row,
  InputGroup,
  Form,
  Button,
  Spinner,
} from "react-bootstrap";
// import avatar from '.../'

//************REACT--ICONS********** */
import ConvoList from "./ConvoList";
import ScrollToBottom from "react-scroll-to-bottom";
import { css } from "@emotion/css";
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../App";
// import Online from "./Online";
import avatar from "./avatar.jpg";
import InboxIcon from "../../Images/inboxIcon.svg";
import ChatsImage from "../../Images/noMessages.png";
import { _, ceil } from "lodash";
// import _ from "lodash";
import { format } from "timeago.js";

import { useDispatch, useSelector } from "react-redux";
import { setUserConvoList } from "../../Reducers/UserConvoList";

function Messenger({ tabTitle, soocket, onlineeUsers }) {
  const dispatch = useDispatch();
  const userConvoList = useSelector((state) => state.userConvoList);

  const user = JSON.parse(localStorage.getItem("user"));
  const { UID } = useParams();
  const { state } = useContext(UserContext);
  const [onlineUsers, setOnlineUsers] = useState(onlineeUsers);
  const navigate = useNavigate();
  const socket = useRef();
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivingMessage, setArrivingNewMessage] = useState(null);
  const [fruser, setFruser] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [readMsgId, setReadMsgId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mySend, setMySend] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLast, setIsLast] = useState("");
  const [csrfToken, setCsrfToken] = useState("");

  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const limitPerPage = 10; // Change this to your desired number

  const [sortedMessages, setSortedMessages] = useState([]);

  const loadMoreMessages = () => {
    // Increment the page number
    setPage(page + 1);
  };

  // useEffect(() => {
  //   soocket = io("ws://192.168.1.39:8900/");
  //   // Send a keepAlive message to the server every 20 seconds
  //   const interval = setInterval(() => {
  //     soocket.emit("keepAlive");
  //   }, 20000);

  //   //use ping pong to keep connection alive and remove user when disconnected from server
  //   soocket.on("ping", () => {
  //     soocket.emit("pong");
  //   });

  //   soocket.on("disconnect", () => {
  //     soocket.emit("removeUser", user._id);
  //   });

  //   soocket.on("pong", () => {
  //     console.log("pong");
  //   });

  //   soocket.on("getMessage", (data) => {
  //     setArrivingNewMessage({
  //       sender: data.senderId,
  //       text: data.text,
  //       cretedAt: Date.now(),
  //       conversationId: data.conversationId,
  //     });
  //   });

  //   // Cleanup the interval when the component unmounts
  //   // return () => clearInterval(interval);

  //   // return () => {
  //   //   soocket.emit("removeUser", user._id);
  //   // };

  //   return () => {
  //     clearInterval(interval);
  //     // Remove the disconnect event listener
  //     soocket.off("disconnect", () => {
  //       soocket.emit("removeUser", user._id);
  //     });
  //   };
  // }, []);

  useEffect(() => {
    soocket.on("getMessage", (data) => {
      setArrivingNewMessage({
        sender: data.senderId,
        text: data.text,
        cretedAt: Date.now(),
        conversationId: data.conversationId,
      });
    });
  }, [soocket, arrivingMessage]);

  useEffect(() => {
    getConversation();
    console.log('getConversation');
  }, [arrivingMessage, mySend]);

  useEffect(() => {
    document.title = tabTitle;
    fetch("/csrf-token")
      .then((response) => response.json())
      .then((data) => setCsrfToken(data.csrfToken))
      .catch((error) => console.error(error));
  }, []);

  const ROOT_CSS = css({
    height: "50vh",
  });

  //typing
  useEffect(() => {
    setIsTyping(false);
    soocket.on("typing", (data) => {
      setIsTyping(data);
      // console.log(data);
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  }, [isTyping]);

  // useEffect(() => {
  //   // soocket.emit("addUser", user._id);

  //   // Set up a callback function to handle the "getUsers" event from the server
  //   const handleGetUsers = (users) => {
  //     console.log(users);
  //     setOnlineUsers(users);
  //   };

  //   soocket.on("getUsers", handleGetUsers);

  //   // Clean up the event listener when the component unmounts or is re-rendered
  //   return () => {
  //     soocket.off("getUsers", handleGetUsers);
  //   };
  // }, [user._id,soocket]);

  useEffect(() => {
    if (arrivingMessage && currentChat) {
      console.log(arrivingMessage, "arrivingMessage");
      if (currentChat.members.includes(arrivingMessage.sender)) {
        // setMessages((prev) => [...prev, arrivingMessage]);
        const today = new Date(arrivingMessage.cretedAt)
          .toISOString()
          .split("T")[0];
        const todayMessages = messages.find((group) => group.date === today);

        if (todayMessages) {
          // If there's an array for today, add the new message to it
          todayMessages.messages.push(arrivingMessage);

          // Update the 'messages' state (no need to spread the array, as it's already a reference)
          setMessages([...messages]);
        } else {
          // If there's no array for today, create a new one and add the new message
          setMessages([
            ...messages,
            {
              messages: [arrivingMessage],
              date: today,
            },
          ]);
        }
      }
    }
  }, [arrivingMessage, currentChat]);

  useEffect(() => {
    soocket.emit("messageRead", {
      senderId: user?._id,
      messageId: readMsgId,
    });
  }, [readMsgId]);

  const getConversation = () => {
    fetch(`/conversation/${user._id}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((result) => {
        ///set last message
        console.log(result, "result");
        setConversations(result);
        //add to redux store
        dispatch(setUserConvoList(result));
        setLoading(false);
      });
  };

  useEffect(() => {
    //only get conversation list if userConvoList is empty
    if (userConvoList.length === 0) {
      console.log("userConvoList is empty");
      getConversation();
    }
  }, [userConvoList]);

  useEffect(() => {
    if (conversations?.members?.includes(arrivingMessage?.sender)) {
      console.log(conversations, "this");
      getConversation();
    }

    //if arriving message is there then update the userConvoList
    if (arrivingMessage) {
      console.log(arrivingMessage, "arrivingMessage");
      //if arrivinng.sender is not in userConvoList then add it to userConvoList
      if (
        !userConvoList.some((convo) =>
          convo.members.includes(arrivingMessage.sender)
        )
      ) {
        console.log("sender is not in userConvoList");
        getConversation();
      }
    }
  }, [arrivingMessage]);

  const memoizedMessages = useMemo(() => {
    if (!messages) {
      fetch(`/messages/${currentChat?._id}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((result) => {
          setMessages(result);
          setReadMsgId(result[result.length - 1]?._id);
        })
        .catch((err) => console.log(err));
    }
    return messages;
    //messages,currentChat,arrivingMessage
  }, [currentChat]);

  //below was working gr8 4 sept 2023
  // useEffect(() => {
  //   if (currentChat) {
  //     fetch(`/messages/${currentChat?._id}`, {
  //       method: "GET",
  //     })
  //       .then((res) => res.json())
  //       .then((result) => {
  //         // setLastMessage(result.length);
  //         setReadMsgId(result[result.length - 1]?._id);
  //         setMessages(result);
  //         // console.log(conversations);
  //         // updateLastInteraction(conversations._id, result[result.length - 1]?._id)
  //       })
  //       .catch((err) => console.log(err));
  //   }
  //   //arrivalMessage,currentChat
  // }, [currentChat, arrivingMessage]);

  // useEffect(() => {
  //   if (currentChat) {
  //     fetch(
  //       `/messages/${currentChat?._id}?page=${page}&limit=${limitPerPage}`,
  //       {
  //         method: "GET",
  //       }
  //     )
  //       .then((res) => res.json())
  //       .then((result) => {
  //         if (result.length === 0) {
  //           // No more messages available
  //           setHasMore(false);
  //         } else {
  //           // Append new messages to the existing messages
  //           setMessages([...messages, ...result]);
  //         }
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // }, [currentChat, page]);

  //set messages
  useEffect(() => {
    //scroll to bottom irrespective of the message

    if (currentChat) {
      fetch(
        `/messages/${currentChat?._id}?page=${page}&limit=${limitPerPage}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((result) => {
          if (result.length === 0) {
            // No more messages available
            setHasMore(false);
          } else {
            // Append new messages to the existing messages
            console.log(result, "result");
            setMessages(result);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [currentChat, page]);

  //if arriving message is there then update the convo list

  const handleSubmit = async () => {
    //smotth scroll to bottom

    if (isSubmitting) {
      return;
    }

    if (newMessage.trim() === "") {
      return alert("Message can't be empty");
    }

    setIsSubmitting(true);

    try {
      // Send message through socket connection
      const recieverId = currentChat.members.find(
        (member) => member !== user._id
      );
      soocket.emit("sendMessage", {
        senderId: user._id,
        recieverId,
        text: newMessage,
        conversationId: currentChat._id,
      });

      // Save message on server
      const response = await fetch("/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          senderId: user._id,
          receiverId: recieverId,
          text: newMessage,
        }),
      });
      const data = await response.json();

      // Get today's date in the 'YYYY-MM-DD' format
      const today = new Date(data.createdAt).toISOString().split("T")[0];

      // Check if there's an array for today in 'messages'
      const todayMessages = messages.find((group) => group.date === today);

      if (todayMessages) {
        // If there's an array for today, add the new message to it
        todayMessages.messages.push(data);

        // Update the 'messages' state (no need to spread the array, as it's already a reference)
        setMessages([...messages]);
      } else {
        // If there's no array for today, create a new one and add the new message
        setMessages([
          ...messages,
          {
            messages: [data],
            date: today,
          },
        ]);
      }
      setMySend(data);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }

    setIsSubmitting(false);
  };

  const convoSetter = (convo) => {
    setCurrentChat(convo);
    // console.log(currentChat && currentChat.members ? currentChat.members.find(member => member !== user._id):"");
    const friendId = convo.members.find((m) => m !== user._id);
    const getUser = () => {
      fetch(`/user/${friendId}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((result) => {
          setFruser(result);
        });
    };
    getUser();
    console.log(friendId, convo.postId, "friendId");

    //if post id is null alert user

    if (!convo.postId) {
      return alert("This conversation is not related to any post");
    } else {
      navigate(`/chat/n/${friendId}/${convo.postId}`);
    }

    // navigate(`/chat/n/${friendId}/${convo.postId}`);
  };

  // const updateLastInteraction = (convoId, lastInteraction) => {
  //   setConversations((prevConversations) => {
  //     const index = prevConversations.findIndex(
  //       (convo) => convo._id === convoId
  //     );
  //     if (index === 0) {
  //       // Conversation is already at the top, no need to update
  //       return prevConversations;
  //     } else {
  //       const updatedConvo = { ...prevConversations[index], lastInteraction };
  //       return [
  //         updatedConvo,
  //         ...prevConversations.slice(0, index),
  //         ...prevConversations.slice(index + 1),
  //       ];
  //     }
  //   });
  // };

  //setting last message 10 sept

  //previous one was working withour redux
  // const memoizedConvoList = useMemo(() => {
  //   return userConvoList
  //     .slice()
  //     .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  //     .map((convo, index) => (
  //       <div
  //         className="parent"
  //         key={convo._id}
  //         onClick={() => convoSetter(convo)}
  //       >
  //         <ConvoList
  //           key={convo._id}
  //           index={index}
  //           currentChat={currentChat}
  //           arrivingMessage={arrivingMessage}
  //           messages={memoizedMessages}
  //           onlineUsers={onlineUsers}
  //           convo={convo}
  //           isLast={isLast.conversationId === convo._id ? isLast : ""}
  //           currentUser={user}
  //           mySend={mySend}
  //           updateLastInteraction={updateLastInteraction}
  //           getConversation={getConversation}
  //         />
  //       </div>
  //     ));
  // }, [
  //   conversations,
  //   currentChat,
  //   arrivingMessage,
  //   memoizedMessages,
  //   onlineUsers,
  //   isLast,
  //   user,
  // ]);

  const memoizedConvoList = useMemo(() => {
    return userConvoList
      .slice()
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .map((convo) => (
        <div key={convo._id} onClick={() => convoSetter(convo)}>
          <ConvoList
            currentChat={
              currentChat && currentChat.conversationId === convo._id
                ? currentChat
                : ""
            }
            // arrivingMessage={
            //   arrivingMessage && arrivingMessage.conversationId === convo._id
            //     ? arrivingMessage
            //     : ""
            // }
            arrivingMessage={arrivingMessage}
            messages={
              messages && messages.length > 0
                ? messages.filter((msg) => msg.conversationId === convo._id)
                : ""
            }
            onlineUsers={onlineeUsers}
            convo={convo}
            currentUser={user}
            isLast={convo.message[0] ? convo.message[0] : mySend}
            getConversation={getConversation}
            mySend={mySend}
          />
        </div>
      ));
  }, [
    userConvoList,
    currentChat,
    arrivingMessage,
    messages,
    onlineUsers,
    onlineeUsers,
    isLast,
    user,
  ]);

  return (
    <>
      {userConvoList.length === 0 ? (
        <div className="vhh-100 flex-column d-flex justify-content-center align-items-center">
          {/* <h1><BiMessageSquareError /></h1> */}
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth={"0"}
            viewBox="0 0 24 24"
            className="fs-2"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16 2H8C4.691 2 2 4.691 2 8v12a1 1 0 0 0 1 1h13c3.309 0 6-2.691 6-6V8c0-3.309-2.691-6-6-6zm4 13c0 2.206-1.794 4-4 4H4V8c0-2.206 1.794-4 4-4h8c2.206 0 4 1.794 4 4v7z"></path>
            <circle cx="9.5" cy="11.5" r="1.5"></circle>
            <circle cx="14.5" cy="11.5" r="1.5"></circle>
          </svg>
          <h2 className="text-center text-warning">
            No conversation to display
          </h2>
        </div>
      ) : (
        <Container fluid className="my-2">
          <Row className="">
            {/* <Col className='col-3 '>
                    <h2 className='d-flex gap-2 align-items-center'>Chats
                        <BiMessageSquareDetail />
                    </h2>
                    <div className="px-2 py-2 d-flex flex-column" style={{ height: "400px", overflowY: "auto" }}>
                        {conversations.map(convo => (
                            <div key={convo._id} onClick={() => convoSetter(convo)}>
                                <ConvoList currentChat={currentChat} arrivingMessage={arrivingMessage} messages={messages} onlineUsers={onlineUsers} convo={convo} currentUser={user} />
                            </div>
                        ))}


                    </div>
                </Col> */}
            <Col className="col-md-3 col-12 p-0">
              <h2 className="d-flex  align-items-center px-3">
                Inbox
                {/* <BiMessageSquareDetail /> */}
                <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="ms-2"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#000000"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth={"0"}></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M16 2H8C4 2 2 4 2 8V21C2 21.55 2.45 22 3 22H16C20 22 22 20 22 16V8C22 4 20 2 16 2Z"
                      stroke="#000000"
                      strokeWidth={"2"}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>{" "}
                    <path
                      d="M7 9.5H17"
                      stroke="#000000"
                      strokeWidth={"2"}
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>{" "}
                    <path
                      d="M7 14.5H14"
                      stroke="#000000"
                      strokeWidth={"2"}
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>{" "}
                  </g>
                </svg>
              </h2>
              <div
                className=" d-flex flex-column vhh-100"
                style={{ overflowY: "auto" }}
              >
                {userConvoList && userConvoList.length === 0 ? (
                  <div className="d-flex justify-content-center align-items-center vhh-100">
                    <Spinner animation="border" variant="warning" />
                  </div>
                ) : (
                  memoizedConvoList
                )}
                {/* {loading ? (
                  <div className="d-flex justify-content-center align-items-center vhh-100">
                    <Spinner animation="border" variant="warning" />
                  </div>
                ) : (
                  memoizedConvoList
                )} */}
              </div>
            </Col>
            <Col className="col-md-9 for-mob-chats">
              {currentChat ? (
                <Container>
                  <h2 className="d-flex gap-2 align-items-center position-relative">
                    {onlineeUsers.some((ou) => ou._id.includes(fruser._id)) ? (
                      <span
                        style={{ top: "-6px" }}
                        className="position-absolute  p-2 bg-success border border-light rounded-circle"
                      ></span>
                    ) : (
                      ""
                    )}
                    <Image
                      style={{ width: "3rem" }}
                      src={
                        fruser?.avatar
                          ? `data:image/svg+xml;base64,${fruser?.avatar}`
                          : avatar
                      }
                    ></Image>
                    {/* {onlineUsers.userId === fruser._id?console.log('yess'):console.log('noo')} */}
                    {/* {console.log(onlineUsers.some(ou => ou.userId.includes(fruser._id)))} */}
                    {fruser.name}
                  </h2>
                </Container>
              ) : (
                <h2 className="d-flex gap-2 align-items-center">
                  Chats
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={"0"}
                    viewBox="0 0 24 24"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M16 2H8C4.691 2 2 4.691 2 8v12a1 1 0 0 0 1 1h13c3.309 0 6-2.691 6-6V8c0-3.309-2.691-6-6-6zm4 13c0 2.206-1.794 4-4 4H4V8c0-2.206 1.794-4 4-4h8c2.206 0 4 1.794 4 4v7z"></path>
                    <circle cx="9.5" cy="11.5" r="1.5"></circle>
                    <circle cx="14.5" cy="11.5" r="1.5"></circle>
                  </svg>
                </h2>
              )}
              {currentChat ? (
                <div
                  className="d-flex flex-column gap-4"
                  style={{ height: "500px", overflowY: "auto" }}
                  //add on scroll to top log
                  onScroll={(e) => {
                    if (e.target.scrollTop === 0) {
                      console.log("scrolled to top");
                      loadMoreMessages();
                    }
                  }}
                >
                  <ScrollToBottom
                    followButtonClassName="bg-warning visually-hidden"
                    initialScrollBehavior="smooth"
                    className={`${ROOT_CSS} conversation-list`}
                    //when i scroll to top then log the message
                  >
                    {/* {messages && messages.length === 0 ? (
                      <div className="d-flex justify-content-center align-items-center ">
                        <Spinner animation="border" variant="warning" />
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message._id}
                          className={`d-flex flex-column ${
                            message.senderId === user._id
                              ? "align-self-end"
                              : "align-self-start"
                          }`}
                        >
                          <div
                            className={`d-flex flex-column gap-1 ${
                              message.senderId === user._id
                                ? "align-items-end"
                                : "align-items-start"
                            }`}
                          >
                            <div
                              className={`d-flex gap-2 ${
                                message.senderId === user._id
                                  ? "flex-row-reverse"
                                  : ""
                              }`}
                            >
                              <Image
                                style={{ width: "2rem" }}
                                src={
                                  message.senderId === user._id
                                    ? user.avatar
                                      ? `data:image/svg+xml;base64,${user.avatar}`
                                      : avatar
                                    : fruser.avatar
                                    ? `data:image/svg+xml;base64,${fruser.avatar}`
                                    : avatar
                                }
                                roundedCircle
                              ></Image>
                              <span
                                className={`p-2 rounded-3 mx-2 ${
                                  message.senderId === user._id
                                    ? "bg-warning text-dark"
                                    : "bg-light"
                                }`}
                              >
                                {message.text}
                              </span>
                            </div>
                            <span
                              className={`  p-2 text-muted${
                                message.senderId === user._id
                                  ? "text-end"
                                  : "text-start"
                              }`}
                              style={{
                                fontSize: "0.7rem",
                                maxWidth: "200px",
                              }}
                            >
                              {new Date(
                                message.createdAt || Date.now()
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      ))
                    )} */}{" "}
                    {hasMore ? (
                      <div className="d-flex justify-content-center align-items-center ">
                        <Spinner animation="border" variant="warning" />
                      </div>
                    ) : null}
                    {messages.map((group) => (
                      <div key={group.date}>
                        <h4
                          className="text-center m-auto bg-light p-2 text-dark rounded"
                          style={{
                            fontSize: "0.8rem",
                            width: "fit-content",
                          }}
                        >
                          {new Date(group.date).toLocaleDateString([], {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </h4>
                        {group.messages.map((message) => (
                          <div
                            key={message._id}
                            className={`d-flex flex-column ${
                              message.senderId === user._id
                                ? "align-self-end"
                                : "align-self-start"
                            }`}
                          >
                            <div
                              className={`d-flex flex-column gap-1 ${
                                message.senderId === user._id
                                  ? "align-items-end"
                                  : "align-items-start"
                              }`}
                            >
                              <div
                                className={`d-flex gap-2 ${
                                  message.senderId === user._id
                                    ? "flex-row-reverse"
                                    : ""
                                }`}
                              >
                                <Image
                                  style={{ width: "2rem" }}
                                  src={
                                    message.senderId === user._id
                                      ? user.avatar
                                        ? `data:image/svg+xml;base64,${user.avatar}`
                                        : avatar
                                      : fruser.avatar
                                      ? `data:image/svg+xml;base64,${fruser.avatar}`
                                      : avatar
                                  }
                                  roundedCircle
                                ></Image>
                                <span
                                  className={`p-2 rounded-3 mx-2 ${
                                    message.senderId === user._id
                                      ? "bg-warning text-dark"
                                      : "bg-light"
                                  }`}
                                >
                                  {message.text}
                                </span>
                              </div>
                              <span
                                className={`p-2 text-muted${
                                  message.senderId === user._id
                                    ? "text-end"
                                    : "text-start"
                                }`}
                                style={{
                                  fontSize: "0.7rem",
                                  maxWidth: "200px",
                                }}
                              >
                                {new Date(
                                  message.createdAt || Date.now()
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </ScrollToBottom>
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                    className="d-flex align-items-center gap-2"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Type a message"
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        soocket.emit("typing", {
                          senderId: user._id,
                          receiverId: currentChat.members.find(
                            (member) => member !== user._id
                          ),
                        });
                      }}
                    ></Form.Control>
                    <Button
                      type="submit"
                      className="bg-warning border-0"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Spinner animation="border" variant="light" />
                      ) : (
                        "Send"
                      )}
                    </Button>
                  </Form>
                </div>
              ) : (
                <div className="d-flex flex-column align-items-center justify-content-center h-100">
                  <link rel="preload" href={ChatsImage} as="image" />
                  <Image className="w-25" src={ChatsImage}></Image>
                  <span className="fw-bold text-warning fs-4">
                    Select to start a conversation
                  </span>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

export default Messenger;
