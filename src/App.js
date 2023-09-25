import Header from "./Components/Header";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import CreatePost from "./Components/CreatePost";
import {
  useEffect,
  createContext,
  useReducer,
  useContext,
  useRef,
} from "react";
import { reducer, initialState } from "./Reducers/UserReducer";
import Cookies from "js-cookie";
import "./App.css";
import AdProfile from "./Components/AdProfile";
import Footer from "./Components/Footer";
import Messenger from "./Components/Message/Messenger";
import Nmessage from "./Components/Message/Nmessage";
import Error404 from "./Components/Error404";
// import io from "socket.io-client";
import jwtDecode from "jwt-decode";
import { useLocation } from "react-router-dom";
import Favourites from "./Components/Favourites";
import { useState } from "react";
import FindBySubject from "./Components/FindBySubject";
import CreatePost2 from "./Components/CreatePost2";
import { Button } from "react-bootstrap";
import FindByLocation from "./Components/FindByLocation";
import EditPost from "./Components/EditPost";
import { Provider } from "react-redux"; // Import Redux Provider
import store from "./Reducers/Store"; // Import the store
import { io } from "socket.io-client";

export const UserContext = createContext();

const Routing = (props) => {
  const location = useLocation();
  const [authenticated, setAuthenticated] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]); //online users

  const socket = props.socket;
  const { state, dispatch } = useContext(UserContext);

  //get list of online users and update it when a user comes online or goes offline
  useEffect(() => {
    socket?.on("getUsers", (users) => {
      console.log(users, "online users");
      setOnlineUsers(users);
    });
  }, [socket, state]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem("user"));
  //   let userCookie = Cookies.get("jwt");
  //   if (user && userCookie) {
  //     dispatch({ type: "USER", payload: user });
  //     // navigate('/')
  //   } else {
  //     navigate("/login");
  //   }
  // }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    let userCookie = Cookies.get("jwt");
    if (user && userCookie) {
      dispatch({ type: "USER", payload: user });
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
      // navigate("/login");
    }
  }, []);

  useEffect(() => {
    const userCookie = Cookies.get("jwt");
    if (userCookie) {
      const decodedToken = jwtDecode(userCookie);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        setAuthenticated(false);
        Cookies.remove("jwt");
        localStorage.removeItem("user");
        // navigate("/login");
      }
    } else {
      setAuthenticated(false);
      // navigate("/login");
    }
  }, [authenticated]);

  return (
    <Routes>
      <Route
        exact
        path="/"
        element={<Home tabTitle={"Home | Assignmentor"} />}
      ></Route>
      <Route
        path="/profile"
        element={<Profile tabTitle={"Profile | Assignmentor"} />}
      ></Route>
      <Route
        path="/login"
        element={<Login tabTitle={"Login | Assignmentor"} />}
      ></Route>
      <Route
        path="/signup"
        element={<Signup tabTitle={"Create an account | Assignmentor"} />}
      ></Route>
      {state ? (
        <Route
          path="/createpost"
          element={<CreatePost2 tabTitle={"Post | Assignmentor"} />}
        ></Route>
      ) : null}
      <Route path="/posts/:postid" element={<AdProfile />}></Route>
      {/* <Route path="/chat/" element={<Messenger/>}></Route>
      <Route path="/chat/n/:UID" element={<Nmessage/>}></Route> */}
      {state ? (
        <Route
          path="/chat/"
          key={new Date().getTime()}
          element={
            <Messenger
              onlineeUsers={onlineUsers}
              soocket={socket}
              tabTitle={"Chat | Assignmentor"}
            />
          }
        ></Route>
      ) : null}
      {state ? (
        <Route
          path="/favourites/"
          element={<Favourites tabTitle={"Favourites | Assignmentor"} />}
        ></Route>
      ) : null}
      {state ? (
        <Route
          path="/category/:subject"
          element={<FindBySubject tabTitle={"Explore | Assignmentor"} />}
        ></Route>
      ) : null}
      {state ? (
        <Route
          path="/location/:location/:subject"
          element={<FindByLocation tabTitle={"Explore | Assignmentor"} />}
        ></Route>
      ) : null}
      {state ? (
        <Route
          path="/chat/n/:UID/:PostId"
          element={
            <Nmessage
              onlineeUsers={onlineUsers}
              soocket={socket}
              tabTitle={"Chat | Assignmentor"}
            />
          }
        ></Route>
      ) : null}
      {state ? (
        <Route
          path="editpost/:postid"
          element={<EditPost tabTitle={"Edit Post | Assignmentor"} />}
        ></Route>
      ) : null}
      <Route path="*" element={<Error404></Error404>}></Route>
    </Routes>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [socket, setSocket] = useState(null);
  // useEffect(() => {
  //   socket.current = io("ws://192.168.1.39:3000/")
  //   if (state) {
  //     socket.current.emit("addUser", state._id)
  //   }
  // }, [state])

  //check whetehr  user is logged in or not

  useEffect(() => {
    if (state !== null) {
      const socketInstance = io("ws://192.168.1.60:8900/");

      //add user to socket
      socketInstance.emit("addUser", state?._id);
      // Send a keepAlive message to the server every 20 seconds
      const interval = setInterval(() => {
        socketInstance.emit("keepAlive");
      }, 20000);

      // Use ping pong to keep connection alive and remove user when disconnected from the server
      socketInstance.on("ping", () => {
        socketInstance.emit("pong");
      });

      //remove user from socket

      socketInstance.on("disconnect", () => {
        socketInstance.emit("removeUser", state?._id);
      });

      socketInstance.on("pong", () => {
        console.log("pong");
      });

      // Set the initialized socket to socket state

      setSocket(socketInstance);

      // Cleanup the interval when the component unmounts
      return () => {
        clearInterval(interval);
        socketInstance.off("disconnect", () => {
          socketInstance.emit("removeUser", state?._id);
        });
        socketInstance.disconnect(); // Disconnect the socket when unmounting App.js
      };
    }
  }, [state?._id]);

  return (
    <Provider store={store}>
      <UserContext.Provider value={{ state, dispatch }}>
        <BrowserRouter>
          <Header />
          <Routing socket={socket} />
          {state?.email == null ? (
            <div className="AboveFooter container my-5 ">
              <div className="gradient2 rounded-4 p-5">
                <div className="text-center">
                  <div className="fs-3 text-light for-mob-font-above-footer">
                    Get Started Now and Never Miss Another Assignment Deadline!
                  </div>
                  <div className="btns pt-4 d-flex justify-content-center align-items-center gap-4">
                    {/* <div className="btn btn-light mx-2">Learn More</div>
                <div className="btn btn-primary mx-2">Get Started</div> */}
                    <Button
                      className="bg-light button btn for-mob-font-above-footer-btn"
                      variant="none"
                    >
                      Learn More
                    </Button>
                    <Button
                      onClick={() => {
                        window.location.href = "/signup";
                      }}
                      variant="primary for-mob-font-above-footer-btn"
                      className=""
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          <Footer />
        </BrowserRouter>
      </UserContext.Provider>
    </Provider>
  );
}

export default App;
