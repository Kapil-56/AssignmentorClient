import React, { lazy, Suspense } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons/faHeart";
import Card from "react-bootstrap/Card";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Container, Image } from "react-bootstrap";
import calenderIcon from "../Images/calenderIcon.svg";
import moment from "moment";
import { BrowserView, MobileView } from "react-device-detect";

function HomeCard(props) {
  const [liked, setLiked] = useState(false);
  const [isLogged, setIsLogged] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate();

  // Fetch CSRF token from server on component mount
  // useEffect(() => {
  //   fetch("/csrf-token")
  //     .then((response) => response.json())
  //     .then((data) => setCsrfToken(data.csrfToken))
  //     .catch((error) => console.error(error));
  // }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      return;
    }
    setIsLogged(true);
  }, []);

  const [showCard, setShowCard] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowCard(true);
    }, 200);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    setLiked(props.abc);
  }, [props.abc]);

  const like = (id) => {
    if (!isLogged) {
      return alert("please login to continue");
    }
    setLiked(true);

    // console.log(id);
    fetch("/like", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": csrfToken, // Add CSRF token to headers
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          return alert("Please login to continue");
        }
        // const newData = props.data.map((item) => {
        //   if (item._id === result._id) {
        //     return result;
        //   } else {
        //     return item;
        //   }
        // });
      });
  };
  const Unlike = (id) => {
    setLiked(false);
    fetch("/unlike", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "CSRF-Token": csrfToken, // Add CSRF token to header
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result)
        // setLiked(false)
      });
  };

  const limit = (string, length, end = "...") => {
    return string.length < length ? string : string.substring(0, length) + end;
  };

  return (
    // <CSSTransition in={showCard} timeout={200} classNames="popup">
    <div
      className={`col-lg-${
        props.lg ? props.lg : "3"
      } col-md-4  col-xxl-3 col-6 col-sm-12`}
    >
      <Card
        style={{ cursor: "pointer" }}
        className={`my-3 cardHome rounded border shadow-sm ${
          showCard ? "slide-up" : ""
        }`}
      >
        <span
          className="dot position-absolute bg-body shadow-sm"
          style={{ right: "5px", top: "10px" }}
        ></span>
        <div
          onClick={() => (liked ? Unlike(props.id) : like(props.id))}
          className="position-absolute for-mob-like lll"
          style={{ top: "16px", right: "10px" }}
        >
          {liked ? (
            <i
              key={"unlike"}
              className="text-danger fs-4 fa-solid fa-heart"
            ></i>
          ) : (
            <FontAwesomeIcon className="text-danger fs-4" icon={faHeart} />
          )}
        </div>
        <Link
          to={`/posts/${props.id ? props.id : ""}`}
          className="text-decoration-none d-md-block d-flex flex-row"
          style={{ color: "black" }}
        >
          <div className="  d-md-block ">
            <Card.Img
              src={`${props.photo}?w=500&h=500&q=50`}
              alt={`${props.title}`}
              className="mob-border mob-card-img "
              style={{
                height: "10rem",
                objectFit: "contain",
                //add a transparent background to the image
                // backgroundColor: "rgba(0, 0, 0, 0.5)",
                // objectFit: "fill",
                // height: "100%",

                borderRadius: "6px 6px 6px 0px",
              }}
            />
          </div>
          <div className="2 col-7 col-md-12">
            <Card.Body className="pb-0 d-flex d-md-block flex-column justify-content-between h-100">
              <div className="wrapper">
                <Card.Title
                  className="fs-6 "
                  style={{ height: "2.5em", wordBreak: "break-all" }}
                >
                  <span className="fw-bold">
                    {limit(props.title, 35)}
                    {/* {limit(props.title.trim().replace(/\s+/g, " "), 35)} */}
                  </span>
                  {/* <span style={{ fontSize: "12px" }}> • 2 days</span> */}
                </Card.Title>
                <div className="card-text">
                  <span className="my-2 fs-4 ">₹{props.price}</span>
                  <Card.Subtitle
                    className="no-wrap-onMob text-muted"
                    style={{
                      height: "3rem",
                      lineBreak: "anywhere",
                    }}
                  >
                    {/* {props.body ? limit(props.body, 50) : "No description"} */}
                    {props.body
                      ? limit(props.body.trim().replace(/\s+/g, " "), 50)
                      : "No description"}
                  </Card.Subtitle>
                </div>
              </div>

              <div
                className="data my-1"
                style={{
                  borderTop: "1px solid #e2e8f0",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <div className="d-flex  align-items-center justify-content-md-around py-2 text-muted justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <div className=" text-center">
                      <img
                        width="32"
                        height="32"
                        className="img-fluid img"
                        alt="deadline"
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAECUlEQVR4nO2Zy2vUQBjApxXFm4q6+WbbskXFR8Wi1Gcf87W1VVB7ULEemuALfIGiKNiNeFBBRCuoFA+KXvSg4kHRv8KKiHeplwpifRyEYu068qXd7CSbpNlHthb3g2FhM8l8v++VmS+MBUisqrkeAG9qXLwBjp+B4ygADmlcDGgc+zjHZsZYBfsXJZHA2RqI78BRBg0LRmtpZ9MVAGwQvMHYnhnsX5LYeAid5bxli6ZtijHWMHN+TWM8FscO4NgPXPx0gIB4nivEwmpcAiDO0C8rtSxY0MI1Lp5leyK8AMcPE/d+iE5TWgjEFQ3ECP26LlVoXFx3QGiiLfRzeeY+FqVogL8s5QB/eVyuUD1Bia1WJwDxADimJs8lMUZVDjg+DW2EeHzzfAC8CtCyrxBLUTipOTFRYtm8eR1zwhYCcA/A+3V1dbMCAQDEvcyibQ35AkzM6VdyoS93D6AHhLgXDMDxvTJ5XSEAMS46FYDXLPfQrAQQKzQuHjohWjEAQPxIT0wkcG5IgEqvOVRiFfcPFVIcNMBHyrMeBwDgaEaxhpmTWYpG7ZK9r3rOjb00TPnNMKVMj57eURsyXtVh/5/P2HX8o/2smtquEeO8bPaxgJX11kSyYIClbqteWN9+K2vR7lNf7OuJxbsLAtCTKftZPN4m9aRM6aY8mW1Zjq/TE+kN6+9sVkmWT8+tqtmatei2/QP2osvqjxYEYJjSkczjUDK1Lymb3AB9ysT+AABGYbN+820Zr+6Um7bezVpw5doz+ZVLPvlQ1nnhUIrqtfIi+Un13A9AT8qvftbqPjVsuTpqAN2Uw15v0YFM+RPP/Pb4/u7+I+s3XohMeXB64E+WYrSfd94grnlB+Cm/ofOOY7HtB94WHP+GRw6kh2d40C5SvYE84Q4nr7BxW55giqG8kSsA7eNpP+/yBO1t+ukNSyVW7x2V3ae/WNVmXftNqxKp8+s3mFb5myKANARezSdGG1r7pN47VjTljfwAMjmhJnbQWLrqcNFi3igWwIRUUImlw4r1sgMc4lUdMrFot1y66ogV612H3ltJHIXyRhEAsiQqRY0yQMht7rTygOZxBp5WAKDcXAYwyx6Q5RAiKSexWa5C8n8qo2IsAzDe8y+l8rqrrZJPFfpkP4Dj8lID7Do+6NtjCgvwVDlePiw1wJqmyzbA6saLuQNQf95xRgZ8RFYp5pHR8AibnccG5eqmS47433HwXe4AlhcA70fZKoGQR1UXaHZbxU/o44L6/WAqlO/p/e30kkdjK4QnWhE4Pqmu7RqJsvvG421WwlLMu8MmE2byOctXqMVNDdZSJrPhVD6ln5eNrBChFvdUQOi0ZlKeYMUQanFTl5jiMXLFTTlMYVOw5ctSFuYpfwGyNJNATmIOAgAAAABJRU5ErkJggg=="
                      ></img>
                    </div>
                    <span className="text mob-font">
                      {moment(props.deadline).format("DD MMM")}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2 mob-font">
                    <div className="d-fle text-center ">
                      {/* <Image
                          src={calenderIcon}
                          style={{ height: "30px", width: "30px" }}
                          alt="calenderIcon"
                          className=""
                        ></Image> */}
                      <img
                        width="32"
                        height="32"
                        src="https://img.icons8.com/pulsar-color/150/000000/book.png"
                        alt="book"
                      />
                    </div>

                    <span className="text ">
                      {props.subject.length > 10
                        ? props.subject.substring(0, 10) + "..."
                        : props.subject}
                    </span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </div>
        </Link>
        <div className="3">
          <Card.Footer className="border-top-0 py-0 px-1 ">
            <div className="a d-flex  align-items-center justify-content-between gap-2">
              <div className="d-flex align-items-center">
                <Image
                  fluid
                  className=" px-1 py-2 mob-footer-img"
                  style={{
                    height: "3em",
                    width: "3em",

                    borderRadius: "50%",
                  }}
                  // alt="avatar"
                  src={
                    props.avatar
                      ? `data:image/svg+xml;base64,${props.avatar}`
                      : null
                  }
                ></Image>
                <span className="d-flex flex-column">
                  <span className="span">{props.name}</span>
                  <span
                    className="span text-muted"
                    style={{ fontSize: "10px" }}
                  >
                    <BrowserView>
                      {props.address.split(" ").slice(0, 3).join(" ")}
                    </BrowserView>
                    <MobileView>{props.address}</MobileView>
                  </span>
                </span>
              </div>
              <Button
                size="sm"
                variant="none"
                className="card-btn  rounded-5 border-0 px-4 py-2 shadow-sm text-nowrap fw-bold"
                onClick={() => {
                  navigate(`/posts/${props.id}`);
                }}
              >
                More
              </Button>
              {/* <p className="m-0">
                <a href="#" class="link-primary text-decoration-none px-3 py-3">
                  View
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-arrow-right ms-1"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.354 11.354a.5.5 0 0 1 0-.708L13.293 8l-2.94-2.646a.5.5 0 1 1 .708-.708l3.5 3a.5.5 0 0 1 0 .708l-3.5 3a.5.5 0 0 1-.708 0z"
                    />
                    <path
                      fillRule="evenodd"
                      d="M2.5 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"
                    />
                  </svg>
                </a>
              </p> */}
            </div>
          </Card.Footer>
        </div>
      </Card>
    </div>
    // </CSSTransition>
  );
}

export default HomeCard;
