import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Placeholder,
  Button,
  Breadcrumb,
} from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import ava from "../Images/avatar.jpg";
import HomeCard from "./HomeCard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import locationIcon from "../Images/locationIcon.svg";
import rupeeIcon from "../Images/rupeeIcon.svg";
import calenderIcon from "../Images/calenderIcon.svg";
import { UserContext } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

function AdProfile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { postid } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState("  ..show more");
  const { state, dispatch } = useContext(UserContext);
  const [locationPosts, setLocationPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setShow("  ..show more");
      // console.log(isOpen);
    } else {
      setShow("show less");
      // console.log(isOpen);
    }
  };

  const [postInfo, setPostInfo] = useState({
    title: "",
    body: "",
    postedBy: "",
    photo: "",
    subject: "",
    postedOn: "",
    price: "",
    postedById: "",
    address: "",
    deadline: "",
    avatar: null,
  });

  const {
    title,
    body,
    postedBy,
    photo,
    postedOn,
    subject,
    price,
    postedById,
    address,
    deadline,
    avatar,
  } = postInfo;
  const charLength = body.length;

  useEffect(() => {
    if (title) {
      document.title = `${title} | Assignmnetor`;
    }
  }, [title]);

  useEffect(() => {
    const fetchPostInfo = async () => {
      try {
        const response = await fetch(`/posts/${postid}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        const { title, body, photo, subject, price, address } = result;
        const normalDate = new Date(result.createdAt);
        const normalDeadline = new Date(result.deadline);
        const dateOptions = { day: "numeric", month: "short" };
        setPostInfo({
          title,
          body,
          photo,
          subject,
          price,
          address,
          postedOn: normalDate.toLocaleDateString("en-gb"),
          postedBy: result.postedBy.name,
          postedById: result.postedBy._id,
          deadline: normalDeadline.toLocaleDateString("en-in", dateOptions),
          avatar: result.postedBy.avatar,
        });
      } catch (err) {
        console.log(err);
        navigate("/");
      }
    };
    fetchPostInfo();
  }, [postid]);

  useEffect(() => {
    const fetchPostsByLocation = async () => {
      setLoading(true);
      if (address) {
        try {
          const response = await fetch(`/allpost?address=${address}`);
          const data = await response.json();
          // setPosts(data.posts);
          // console.log(data.posts);
          const filteredPosts = data.posts.filter(
            (post) => post._id !== postid
          );
          setLocationPosts(filteredPosts);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
      }
    };
    fetchPostsByLocation();
  }, [address, postid]);

  return (
    <>
      <Container fluid className="mb-4">
        <div className="breadcrumbContainer ">
          <Breadcrumb className="text-muted text-decoration-none ">
            <Breadcrumb.Item
              className="text-muted text-decoration-none"
              onClick={() => {
                navigate("/");
              }}
            >
              <svg
                width="24px"
                height="24px"
                viewBox="0 0 24 28"
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
                    d="M20 11.75C19.8376 11.7507 19.6795 11.698 19.55 11.6L12 5.94L4.45 11.6C4.29087 11.7193 4.09085 11.7706 3.89394 11.7425C3.69702 11.7143 3.51935 11.6091 3.4 11.45C3.28066 11.2909 3.22941 11.0908 3.25754 10.8939C3.28567 10.697 3.39087 10.5193 3.55 10.4L11.55 4.4C11.6798 4.30263 11.8377 4.25 12 4.25C12.1623 4.25 12.3202 4.30263 12.45 4.4L20.45 10.4C20.5952 10.5179 20.6911 10.6859 20.7189 10.8709C20.7466 11.0559 20.7042 11.2446 20.6 11.4C20.5363 11.503 20.4482 11.5888 20.3436 11.6498C20.239 11.7108 20.121 11.7452 20 11.75Z"
                    fill="#000000"
                  ></path>{" "}
                  <path
                    d="M18 19.75H6C5.80189 19.7474 5.61263 19.6676 5.47253 19.5275C5.33244 19.3874 5.25259 19.1981 5.25 19V9.5C5.25 9.30109 5.32902 9.11032 5.46967 8.96967C5.61032 8.82902 5.80109 8.75 6 8.75C6.19891 8.75 6.38968 8.82902 6.53033 8.96967C6.67098 9.11032 6.75 9.30109 6.75 9.5V18.25H17.25V9.5C17.25 9.30109 17.329 9.11032 17.4697 8.96967C17.6103 8.82902 17.8011 8.75 18 8.75C18.1989 8.75 18.3897 8.82902 18.5303 8.96967C18.671 9.11032 18.75 9.30109 18.75 9.5V19C18.7474 19.1981 18.6676 19.3874 18.5275 19.5275C18.3874 19.6676 18.1981 19.7474 18 19.75Z"
                    fill="#000000"
                  ></path>{" "}
                  <path
                    d="M14 19.75C13.8019 19.7474 13.6126 19.6676 13.4725 19.5275C13.3324 19.3874 13.2526 19.1981 13.25 19V12.75H10.75V19C10.75 19.1989 10.671 19.3897 10.5303 19.5303C10.3897 19.671 10.1989 19.75 10 19.75C9.80109 19.75 9.61032 19.671 9.46967 19.5303C9.32902 19.3897 9.25 19.1989 9.25 19V12C9.25259 11.8019 9.33244 11.6126 9.47253 11.4725C9.61263 11.3324 9.80189 11.2526 10 11.25H14C14.1981 11.2526 14.3874 11.3324 14.5275 11.4725C14.6676 11.6126 14.7474 11.8019 14.75 12V19C14.7474 19.1981 14.6676 19.3874 14.5275 19.5275C14.3874 19.6676 14.1981 19.7474 14 19.75Z"
                    fill="#000000"
                  ></path>{" "}
                </g>
              </svg>
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="text-muted text-decoration-none"
              onClick={() => {
                navigate(`/category/${subject}`);
              }}
            >
              {subject}
            </Breadcrumb.Item>
            <Breadcrumb.Item
              className="text-muted text-decoration-none"
              onClick={() => {
                navigate(`/location/${address}/${subject}`);
              }}
            >
              {address}
            </Breadcrumb.Item>
            <Breadcrumb.Item active>{title}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Row className="v">
          <Col sm={8} md={6} lg={6} xl={5} className="p-4 mx-auto">
            <div className="text-center">
              {photo ? (
                <Image
                  thumbnail
                  // style={{ width: "80%" }}
                  fluid
                  className=" m-auto my-2 rounded-3 w-100"
                  src={photo}
                  alt={title}
                ></Image>
              ) : (
                <Image
                  thumbnail
                  fluid
                  className="w-50 m-auto rounded-3 placeholder"
                  src={avatar}
                  alt={"placeholder"}
                ></Image>
              )}
            </div>
            {/* {charLength > 100 ? <Button onClick={handleClick} className='my-3' variant='secondary'>Load More</Button> : null} */}

            {/* <div className="d-flex align-items-center justify-content-start my-3">
              <i className="fa-regular fa-circle-question text-warning fs-3 me-2"></i>
              {title ? (
                <h2 className="fw-bold m-0 text-break fs-4">{title}</h2>
              ) : (
                <span>title</span>
              )}
            </div>
            {body ? (
              <div className="text-break fs-4 mt-2">
                {isOpen ? body : body.slice(0, 100)}
                {charLength > 100 ? (
                  <Link
                    onClick={handleClick}
                    className="my-3 fs-5 text-decoration-none"
                    variant="secondary"
                  >
                    {show}
                  </Link>
                ) : null}
              </div>
            ) : (
              <>
                <Placeholder as="p" animation="glow">
                  <Placeholder className="bg-warning" xs={6} />
                </Placeholder>
                <Placeholder as="p" animation="glow">
                  <Placeholder className="bg-warning" xs={6} />
                </Placeholder>
              </>
            )} */}
          </Col>
          <Col sm={4} md={6} lg={6} xl={5} className={"mx-auto"}>
            {/* <div
              className=" my-3 shadow-sm p-5 pb-3 rounded-3 position-sticky border border-2"
              style={{ top: "10%" }}
            >
              <div className="text-center mb-5">
                <h2 className="mx-auto fw-bold">Details</h2>
              </div>
              <div className="d-flex justify-content-around align-items-center">
                <div className="same d-flex flex-column align-items-center text-center w-50">
                  <Image
                    className="w-25"
                    fluid
                    src={avatar ? `data:image/svg+xml;base64,${avatar}` : ava}
                    alt={"avatar"}
                  ></Image>
                  {postedBy ? postedBy : "John Doe"}
                </div>
                <div className="same d-flex flex-column align-items-center text-center w-50">
                  <Image
                    style={{ aspectRatio: "16/4" }}
                    src={locationIcon}
                    fluid
                    alt="locationIcon"
                  ></Image>
                  {address ? address : "Gurgaon"}
                </div>
              </div>
              <div className="d-flex justify-content-around align-items-center mt-5">
                <div className="same d-flex flex-column align-items-center text-center w-50">
                  <Image
                    style={{ aspectRatio: "16/4" }}
                    src={calenderIcon}
                    fluid
                    alt="calenderIcon"
                  ></Image>
                  <span>{deadline ? deadline : "5 nov"}</span>
                </div>
                <div className="same d-flex flex-column align-items-center text-center w-50">
                  <Image
                    style={{ aspectRatio: "16/4" }}
                    fluid
                    src={rupeeIcon}
                    alt="rupeeIcon"
                  ></Image>

                  <span>₹{price ? price : 250}</span>
                </div>
              </div>
              <div className="text-center mt-5">
                <Link
                  to={
                    postedById == user?._id
                      ? "/profile"
                      : `/chat/n/${postedById}/${postid}`
                  }
                  role={"button"}
                  style={{ backgroundColor: "#04AA0A" }}
                  className="btn-success px-4 py-2 rounded border-0 text-decoration-none text-light"
                >
                  {postedById === user?._id ? "Profile" : "Chat Now"}
                  {postedById === user?._id ? (
                    <svg
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="ms-1"
                      style={{ verticalAlign: "sub" }}
                      xmlns="http://www.w3.org/2000/svg"
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
                          d="M12.12 12.78C12.05 12.77 11.96 12.77 11.88 12.78C10.12 12.72 8.71997 11.28 8.71997 9.50998C8.71997 7.69998 10.18 6.22998 12 6.22998C13.81 6.22998 15.28 7.69998 15.28 9.50998C15.27 11.28 13.88 12.72 12.12 12.78Z"
                          stroke="#ffffff"
                          strokeWidth={"1.5"}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>{" "}
                        <path
                          d="M18.74 19.3801C16.96 21.0101 14.6 22.0001 12 22.0001C9.40001 22.0001 7.04001 21.0101 5.26001 19.3801C5.36001 18.4401 5.96001 17.5201 7.03001 16.8001C9.77001 14.9801 14.25 14.9801 16.97 16.8001C18.04 17.5201 18.64 18.4401 18.74 19.3801Z"
                          stroke="#ffffff"
                          strokeWidth={"1.5"}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>{" "}
                        <path
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          stroke="#ffffff"
                          strokeWidth={"1.5"}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>{" "}
                      </g>
                    </svg>
                  ) : (
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth={"0"}
                      viewBox="0 0 24 24"
                      className="fs-2 ms-2"
                      height="20px"
                      width="20px"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M16 2H8C4.691 2 2 4.691 2 8v12a1 1 0 0 0 1 1h13c3.309 0 6-2.691 6-6V8c0-3.309-2.691-6-6-6zm4 13c0 2.206-1.794 4-4 4H4V8c0-2.206 1.794-4 4-4h8c2.206 0 4 1.794 4 4v7z"></path>
                      <circle cx="9.5" cy="11.5" r="1.5"></circle>
                      <circle cx="14.5" cy="11.5" r="1.5"></circle>
                    </svg>
                  )}
                </Link>
              </div>
              <div
                className="text-end text-muted mt-3"
                style={{ fontSize: "small" }}
              >
                {" "}
                Posted on:{postedOn ? postedOn : "loading"}
              </div>
            </div> */}
            <div className="main-wrapper d-flex flex-column flex-wrap gap-3">
              <div className="wrapper title border p-3 rounded">
                <div className=" fw-bold d-flex justify-content-between align-items-center ">
                  <span className="fs-3 text-dark">₹ {price}</span>
                  <div className="d-flex align-items-center">
                    <FontAwesomeIcon
                      className="text-danger ms-3 fs-3"
                      icon={faHeart}
                    />
                  </div>
                </div>
                <div
                  className="title text-muted fw-bolder"
                  style={{ lineBreak: "anywhere" }}
                >
                  {title}
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="location text-muted mt-4">{address}</div>
                  <div className="location text-muted mt-4 px-3 py-2 bg-secondary  rounded-5 fw-bold text-dark d-flex align-items-center">
                    {/* //flag svg here */}
                    {/* <img width="48" height="48" src="https://img.icons8.com/pulsar-color/48/000000/overtime.png" alt="overtime"/> */}
                    <img
                      width="20"
                      height="20"
                      className="me-2"
                      alt="deadline"
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAECUlEQVR4nO2Zy2vUQBjApxXFm4q6+WbbskXFR8Wi1Gcf87W1VVB7ULEemuALfIGiKNiNeFBBRCuoFA+KXvSg4kHRv8KKiHeplwpifRyEYu068qXd7CSbpNlHthb3g2FhM8l8v++VmS+MBUisqrkeAG9qXLwBjp+B4ygADmlcDGgc+zjHZsZYBfsXJZHA2RqI78BRBg0LRmtpZ9MVAGwQvMHYnhnsX5LYeAid5bxli6ZtijHWMHN+TWM8FscO4NgPXPx0gIB4nivEwmpcAiDO0C8rtSxY0MI1Lp5leyK8AMcPE/d+iE5TWgjEFQ3ECP26LlVoXFx3QGiiLfRzeeY+FqVogL8s5QB/eVyuUD1Bia1WJwDxADimJs8lMUZVDjg+DW2EeHzzfAC8CtCyrxBLUTipOTFRYtm8eR1zwhYCcA/A+3V1dbMCAQDEvcyibQ35AkzM6VdyoS93D6AHhLgXDMDxvTJ5XSEAMS46FYDXLPfQrAQQKzQuHjohWjEAQPxIT0wkcG5IgEqvOVRiFfcPFVIcNMBHyrMeBwDgaEaxhpmTWYpG7ZK9r3rOjb00TPnNMKVMj57eURsyXtVh/5/P2HX8o/2smtquEeO8bPaxgJX11kSyYIClbqteWN9+K2vR7lNf7OuJxbsLAtCTKftZPN4m9aRM6aY8mW1Zjq/TE+kN6+9sVkmWT8+tqtmatei2/QP2osvqjxYEYJjSkczjUDK1Lymb3AB9ysT+AABGYbN+820Zr+6Um7bezVpw5doz+ZVLPvlQ1nnhUIrqtfIi+Un13A9AT8qvftbqPjVsuTpqAN2Uw15v0YFM+RPP/Pb4/u7+I+s3XohMeXB64E+WYrSfd94grnlB+Cm/ofOOY7HtB94WHP+GRw6kh2d40C5SvYE84Q4nr7BxW55giqG8kSsA7eNpP+/yBO1t+ukNSyVW7x2V3ae/WNVmXftNqxKp8+s3mFb5myKANARezSdGG1r7pN47VjTljfwAMjmhJnbQWLrqcNFi3igWwIRUUImlw4r1sgMc4lUdMrFot1y66ogV612H3ltJHIXyRhEAsiQqRY0yQMht7rTygOZxBp5WAKDcXAYwyx6Q5RAiKSexWa5C8n8qo2IsAzDe8y+l8rqrrZJPFfpkP4Dj8lID7Do+6NtjCgvwVDlePiw1wJqmyzbA6saLuQNQf95xRgZ8RFYp5pHR8AibnccG5eqmS47433HwXe4AlhcA70fZKoGQR1UXaHZbxU/o44L6/WAqlO/p/e30kkdjK4QnWhE4Pqmu7RqJsvvG421WwlLMu8MmE2byOctXqMVNDdZSJrPhVD6ln5eNrBChFvdUQOi0ZlKeYMUQanFTl5jiMXLFTTlMYVOw5ctSFuYpfwGyNJNATmIOAgAAAABJRU5ErkJggg=="
                    ></img>
                    {/* deadline: {deadline} */}

                    <span className="text-dark text-nowrap ">{deadline}</span>
                  </div>
                </div>
              </div>

              <div className="wrapper border p-3 description  rounded">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="fs-5 fw-bold text-dark mb-2 ">
                    Description
                  </div>
                  <span className="bg-secondary rounded-5 px-3 py-1 border">
                    {subject}
                  </span>
                </div>
                <div className="text-muted" style={{ lineBreak: "anywhere" }}>
                  {body}
                  {/* {charLength > 100 ? (
                  <Link
                    onClick={handleClick}
                    className="my-3 fs-5 text-decoration-none"
                    variant="secondary"
                  >
                    {show}
                  </Link>
                // </div>
              ) : null}       */}
                </div>
              </div>

              <div className="wrapper-author p-3  border rounded">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="avatar&Name d-flex align-items-center gap-2">
                    <Image
                      src={`data:image/svg+xml;base64,${avatar}`}
                      fluid
                      width={50}
                      height={50}
                    />
                    <span className="fs-3 fw-bold">{postedBy}</span>
                  </div>
                  <div className="deadline text-muted">{postedOn}</div>
                </div>
                <Button
                  variant="none"
                  className="btn btn-dark mt-3 w-100 px-3 py-2"
                  onClick={() => {
                    if (user) {
                      navigate(`/chat/n/${postedById}/${postid}`);
                    } else {
                      navigate("/login");
                    }
                  }}
                >
                  Let's Talk
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* //if locationPosts is empty then do not show this section */}
      {locationPosts.length > 0 ? (
        <section className="my-4">
          {/* <Container>
          <h3 className="text-dark ">More in <span className="text-primary">{address}</span></h3>
        </Container> */}
          <Container fluid>
            <h3 className="text-dark ">
              More in <span className="text-primary">{address}</span>
            </h3>

            {loading ? (
              <Skeleton height={30} count={5} />
            ) : (
              <div className="d-flex row justify-content-start">
                {locationPosts.map((item) => {
                  return (
                    <HomeCard
                      id={item._id}
                      key={item._id}
                      price={item.price}
                      subject={item.subject}
                      avatar={item.postedBy.avatar}
                      name={item.postedBy.name}
                      photo={item.photo}
                      title={item.title}
                      body={item.body}
                      address={item.address}
                    />
                  );
                })}
                {/* <HomeCard price={price} subject={subject} photo={photo} title={title} body={body} />
                        <HomeCard price={price} subject={subject} photo={photo} title={title} body={body} /> */}
                {/* <HomeCard price={price} subject={subject} photo={photo} title={title} body={body} /> */}
              </div>
            )}
          </Container>
        </section>
      ) : null}
    </>
  );
}

export default AdProfile;
