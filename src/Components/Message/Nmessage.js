import React, { useEffect, useRef, useState } from "react";
import {
  Col,
  Container,
  Image,
  Row,
  InputGroup,
  Form,
  Button,
  CloseButton,
  Spinner,
} from "react-bootstrap";
// import avatar from '.../'
import ScrollToBottom from "react-scroll-to-bottom";
import { css } from "@emotion/css";
import { io } from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import avatar from "./avatar.jpg";
// import ConvoList from './ConvoList';
import ChatBg from "../../Images/chatBg2.png";
import _ from "lodash";
import { format } from "timeago.js";

//************REACT--ICONS********** */

function Messenger({ tabTitle, soocket, onlineeUsers }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { UID, PostId } = useParams();
  const [UIDdetails, setUIDdetails] = useState("");
  const [conid, setConid] = useState(null);
  const socket = useRef();
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [setterId, setSetterId] = useState(null);
  const [arrivingMessage, setArrivingNewMessage] = useState(null);
  const ROOT_CSS = css({
    height: "50vh",
  });
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [mySend, setMySend] = useState("");
  const [readMsgId, setReadMsgId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isId, setIsId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [postDetail, setPostDetail] = useState("");

  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const limitPerPage = 10; // Change this to your desired number

  //capture scroll to bottom button
  const scrollToBottom = document.getElementsByClassName("scrollToBottom");

  useEffect(() => {
    document.title = tabTitle;
  }, []);

  useEffect(() => {
    if (UID === user._id) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    fetch("/csrf-token")
      .then((response) => response.json())
      .then((data) => setCsrfToken(data.csrfToken))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/user/${UID}`, {
          method: "GET",
        });
        const result = await res.json();
        if (result.error) {
          return navigate("/chat");
        } else {
          setUIDdetails(result);

          // getConversation()
        }
      } catch (err) {
        console.log("An error occurred while fetching the user");
      }
    };
    const getPostDetail = async () => {
      try {
        const res = await fetch(`/posts/${PostId}`, {
          method: "GET",
        });
        const result = await res.json();
        if (result.error) {
          return navigate("/chat");
        } else {
          // setUIDdetails(result);
          setPostDetail(result);
          // getConversation()
        }
      } catch (err) {
        console.log("An error occurred while fetching the user");
      }
    };
    getUser();
    getPostDetail();
  }, [UID, PostId]);

  useEffect(() => {
    // soocket = io("ws://192.168.1.39:8900");
    soocket?.on("getMessage", (data) => {
      setArrivingNewMessage({
        sender: data.senderId,
        text: data.text,
        cretedAt: Date.now(),
      });
    });
  }, [soocket]);

  // useEffect(() => {
  //   //   // soocket?.emit("addUser", user._id);

  //   // Set up a callback function to handle the "getUsers" event from the server
  //   const handleGetUsers = (users) => {
  //     console.log(users, "online users");
  //     setOnlineUsers(users);
  //   };
  //   soocket?.on("getUsers", handleGetUsers);

  //   // Clean up the event listener when the component unmounts or is re-rendered
  //   return () => {
  //     soocket.off("getUsers", handleGetUsers);
  //   };
  // }, [soocket]);

  // const getConversation = () => {
  //     fetch(`/conversation/${user._id}`, {
  //         method: "GET"
  //     }).then(res => res.json())
  //         .then(result => {
  //             // console.log(result,"thhis");
  //             setConversations(result)
  //             // setLoading(false);
  //         })
  // }
  // useEffect(() => {
  //     getConversation()
  // }, [])

  // const getConversation = () => {
  //     fetch(`/conversation/${user._id}`, {
  //         method: "GET"
  //     }).then(res => res.json())
  //         .then(result => {
  //             console.log(result);
  //             setConversations(result[0])
  //             setCurrentChat(result[0])
  //         })
  // }

  useEffect(() => {
    if (UID) {
      const fetchConversationId = async (senderId, receiverId) => {
        try {
          const response = await fetch(
            `/conversation/${senderId}/${receiverId}`
          );
          const json = await response.json();
          if (json.error) {
            console.log(json.error);
          } else {
            json.forEach((item) => {
              if (item.postId?.includes(PostId)) {
                setConid(item?._id);
              }
            });
          }
        } catch (error) {
          console.log(
            "An error occurred while fetching the conversation ID: ",
            error
          );
        }
      };
      // console.log(user._id, UID);
      fetchConversationId(user._id, UID);
    }
  }, [UID]);

  // useEffect(() => {
  //     const getConversation = () => {
  //         fetch(`/conversation/${user._id}`, {
  //             method: "GET"
  //         }).then(res => res.json())
  //             .then(result => {
  //                 console.log(result);
  //                 setConversations(result[0])
  //                 setCurrentChat(result[0])
  //             })
  //     }
  //     getConversation()

  // }, [user._id])

  // useEffect(() => {
  //     const getConversation = () => {
  //         fetch(`/conversation/${UID}`, {
  //             method: "GET"
  //         }).then(res => res.json())
  //             .then(result => {
  //                 console.log(result);
  //                 // console.log(UID);
  //                 // console.log(result);
  //                 // console.log(result.find(member => member !== user._id));
  //                 // setCurrentChat(result.filter(item => item.members.includes(UID && user._id)));
  //                 // setCurrentChat(result[0])
  //                 // setConversations(result)
  //             })
  //     }
  //     getConversation()

  // }, [UID])

  useEffect(() => {
    if (conid) {
      setHasMore(true);
      const getMessages = () => {
        fetch(
          `/messages/${conid}?page=${page}&limit=${limitPerPage}
        `,
          {
            method: "GET",
          }
        )
          .then((res) => res.json())
          .then((result) => {
            if (result.length < limitPerPage) {
              setHasMore(false);
            }
            setMessages(result);

            setReadMsgId(result[result.length - 1]?._id);
          })
          .catch((err) => console.log(err));
      };
      getMessages();
    }
  }, [conid, arrivingMessage, page]);

  // useEffect(() => {
  //   if (conid) {
  //     const getMessages = () => {
  //       fetch(`/messages/${conid}`, {
  //         method: "GET",
  //       })
  //         .then((res) => res.json())
  //         .then((result) => {
  //           setReadMsgId(result[result.length - 1]?._id);
  //         })
  //         .catch((err) => console.log(err));
  //     };
  //     getMessages();
  //     //scroll to bottom
  //   }
  // }, [conid, arrivingMessage]);

  useEffect(() => {
    soocket?.emit("messageRead", {
      senderId: user?._id,
      messageId: readMsgId,
    });
  }, [readMsgId]);

  // useEffect(() => {
  //   setIsTyping(false);
  //   soocket?.on("typing", (data) => {
  //     setIsTyping(data);
  //   });
  // }, []);

  // //changes one add a isTypping timeout
  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     setIsTyping(false);
  //   }, 1500);
  //   return () => clearTimeout(timeout);
  // }, [isTyping]);

  //typing
  useEffect(() => {
    setIsTyping(false);
    soocket?.on("typing", (data) => {
      setIsTyping(data);
      // console.log(data);
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  }, [isTyping]);

  const handleSubmit = async () => {
    //simulate a click on ScrollToBottom component to scroll to bottom

    if (newMessage.trim() === "") {
      return alert("Message can't be empty");
    }

    setIsSubmitting(true);

    let token = csrfToken;
    if (!token) {
      try {
        const response = await fetch("/csrf-token");
        const data = await response.json();
        token = data.csrfToken;
        setCsrfToken(token);
      } catch (error) {
        console.log(error);
        return;
      }
    }

    try {
      // Send message through socket connection
      const recieverId = UID;

      // Save message on server
      const response = await fetch("/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": token,
        },
        body: JSON.stringify({
          senderId: user._id,
          receiverId: recieverId,
          text: newMessage,
          postId: PostId,
          conversationId: conid,
        }),
      });
      const data = await response.json();
      setConid(data.conversationId);
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

      soocket?.emit("sendMessage", {
        senderId: user._id,
        recieverId,
        text: newMessage,
        conversationId: conid,
      });

      setMySend(data);
      setNewMessage("");
      if (scrollToBottom[0]) {
        scrollToBottom[0].click();
      }
    } catch (error) {
      console.log(error);
    }

    setIsSubmitting(false);
  };

  // useEffect(() => {
  //     arrivingMessage && currentChat.members && currentChat.members.includes(arrivingMessage.sender) &&
  //         setMessages(prev => [...prev, arrivingMessage])
  //     console.l    og(arrivingMessage);

  // }, [user
  // ])

  // useEffect(() => {
  //     if (arrivingMessage) {
  //         console.log(arrivingMessage);
  //         // if (currentChat.members.includes(arrivingMessage.sender)) {
  //         setMessages(prev => [...prev, arrivingMessage]);
  //         // }
  //     }
  // }, [arrivingMessage]);

  useEffect(() => {
    if (UID === arrivingMessage?.sender) {
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
      if (scrollToBottom[0]) {
        scrollToBottom[0].click();
      }

      // if (currentChat.members.includes(arrivingMessage.sender)) {
      //     setMessages(prev => [...prev, arrivingMessage]);
      // }
    }
  }, [arrivingMessage]);

  // const convoSetter = (convo) => {
  //     setCurrentChat(convo)
  //     const friendId = convo.members.find(m => m !== user._id)
  //     // console.log(convo);
  //     navigate(`/chat/n/${friendId}`);
  //     // setIsId(`chat/n/${friendId}`)
  // }

  const sortedMessages = [...messages].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });

  //create a function that converts time into 12 hour format like 6:00 PM
  const convertTime = (time) => {
    const date = new Date(time);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedTime = `${hours > 12 ? hours - 12 : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    } ${ampm}`;
    return formattedTime;
  };

  return (
    <Container fluid className="my-2">
      <Row className="vhh-100">
        {/* <Col className='col-4 '>
                    <h2 className='d-flex gap-2 align-items-center'>Chats
                        <BiMessageSquareDetail />
                    </h2>
                    <div className="px-2 py-2 d-flex flex-column">
                        {
                            conversations
                                .sort((a, b) => new Date(b.lastInteraction) - new Date(a.lastInteraction))
                                .map((convo, index) => (
                                    <>
                                        <div className='parent' key={convo._id} onClick={() => convoSetter(convo)}>
                                            <ConvoList
                                                index={index}
                                                currentChat={currentChat}
                                                arrivingMessage={arrivingMessage}
                                                messages={messages}
                                                onlineUsers={onlineUsers}
                                                convo={convo}
                                                currentUser={user}
                                                mySend={mySend}
                                                updateLastInteraction={updateLastInteraction}
                                                getConversation={getConversation}
                                            />
                                        </div>
                                    </>
                                ))
                        }
                    </div>
                </Col> */}
        <Col className="col-12 ">
          <div className="p-3">
            <h2
              className="d-flex align-items-center justify-content-between position-relative px-3 py-2 rounded-3 shadow-sm "
              style={{ border: "1px solid #3d4152" }}
            >
              <div className="d-flex align-items-center gap-2 ">
                {onlineeUsers.some((ou) => ou._id.includes(UID)) ? (
                  <span
                    style={{ top: "3px" }}
                    className="position-absolute  p-2 bg-success border border-light rounded-circle"
                  ></span>
                ) : (
                  ""
                )}
                <Image
                  style={{ width: "3rem" }}
                  alt="avatar"
                  className="me-2"
                  src={
                    UIDdetails?.avatar
                      ? `data:image/svg+xml;base64,${UIDdetails?.avatar}`
                      : avatar
                  }
                ></Image>
                {
                  <span
                    className="position-absolute translate-middle"
                    style={{ top: "70%", left: "6%" }}
                  >
                    <Image
                      className="rounded-circle border  shadow-sm"
                      onClick={() => navigate(`/posts/${postDetail._id}`)}
                      style={{ width: "1em", height: "1em", cursor: "pointer" }}
                      src={postDetail.photo}
                    ></Image>
                  </span>
                }
                <span> {UIDdetails.name}</span>
                {/* {isTyping.senderId === UID ? (
                  <span className="text-muted fs-6 ms-2">typing</span>
                ) : (
                  ""
                )} */}
              </div>
              <CloseButton
                onClick={() => navigate("/chat")}
                className="fs-6"
                aria-label="close"
              />
            </h2>
            {/* {
                        currentChat ? */}
            <div
              style={{
                backgroundImage: `url(${ChatBg})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
                // opacity: '0.5'
              }}
              className="d-flex flex-column gap-4"
            >
              <ScrollToBottom
                followButtonClassName="bg-warning scrollToBottom visually-hidden"
                initialScrollBehavior="smooth"
                className={`${ROOT_CSS} conversation-list`}
              >
                {hasMore ? (
                  <div className="d-flex justify-content-center align-items-center ">
                    <Spinner animation="border" variant="warning" />
                  </div>
                ) : null}
                {sortedMessages.map((group) => (
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
                    {group.messages
                      ?.sort(
                        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
                      )

                      .map((message) => (
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
                                    : UIDdetails.avatar
                                    ? `data:image/svg+xml;base64,${UIDdetails.avatar}`
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
                              {/* {new Date(
                                message.createdAt || Date.now()
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })} */}

                              {convertTime(message.createdAt || Date.now())}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                ))}

                {/* //if user is typing, show "typing..." */}
                {isTyping.senderId === UID ? (
                  <div
                    className={`text-muted text-center my-2 popUp slideInFromLeft`}
                  >
                    <span className="p-2 rounded-3 bg-light">typing...</span>
                  </div>
                ) : (
                  ""
                )}
              </ScrollToBottom>
              <div className="ASS">
                <InputGroup className="mb-3">
                  <Form.Control
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      soocket?.emit("typing", {
                        senderId: user._id,
                        recieverId: UID,
                      });
                    }}
                    value={newMessage}
                    aria-describedby="basic-addon2"
                    placeholder="write something"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit();
                      }
                    }}
                  />
                  <Button
                    disabled={csrfToken ? false : true}
                    className="d-flex"
                    onClick={handleSubmit}
                    variant="outline-dark"
                    id="button-addon2"
                  >
                    Send
                    <svg
                      width="1.5em"
                      height="1.5em"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          d="M20 12L4 4L6 12M20 12L4 20L6 12M20 12H6"
                          stroke="#198754"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>{" "}
                      </g>
                    </svg>
                    {/* <AiOutlineSend className='ms-1' /> */}
                  </Button>
                </InputGroup>
              </div>
            </div>
            {/* : <span className='text-warning fw-bolder fs-2 '>Open to start a conversation</span>} */}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Messenger;
