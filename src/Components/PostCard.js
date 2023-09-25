import { set } from "lodash";
import moment from "moment";
import { useState } from "react";
import { Button, Container, Dropdown, Image, Modal } from "react-bootstrap";
// import Button from 'react-bootstrap/Button';
import Card from "react-bootstrap/Card";
import { Link, useNavigate } from "react-router-dom";
// import logo1 from '../Images/logo1.png'

function PostCard(props) {
  const navigate = useNavigate();

  const limit = (string, length, end = "...") => {
    return string.length < length ? string : string.substring(0, length) + end;
  };

  //create a function to edit post on the basis of id

  // const EditPost = async (id) => {
  //   const res = await fetch(`/editpost/${id}`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       title: title,
  //       body: body,
  //       pic: url,
  //       subject: subject,
  //       price: price,
  //       address: address,
  //       deadline: deadline,
  //     }),
  //   });
  //   const data = await res.json();
  //   if (data.error) {
  //     alert(data.error);
  //   } else {
  //     alert("Post Updated Successfully");
  //   }
  // };

  //create a function to delete post on the basis of id

  const DeletePost = async (id) => {
    const res = await fetch(`/deletepost/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      alert("Post Deleted Successfully");
      // navigate("/profile");
      window.location.reload();
    }
  };

  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    setOpen(false);
    DeletePost(props.id);
  };

  return (
    <Container
      
      className="border  rounded-2 py-3 shadow-sm position-relative"
    >
      <span
        className="bg-secondary rounded-2 delete position-absolute"
        style={{
          cursor: "pointer",
          right: "5px",
          height: "2em",
          width: "2em",
          top: "5px",
          zIndex: "1",
        }}
      >
        {/* <i
          className="fas fa-ellipsis-vertical position-relative start-50 translate-middle"
          style={{
            top: "35%",
            color: "black",
            fontSize: "14px",
          }}
        ></i> */}
        <Dropdown
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100%", width: "100%" }}
          drop="down"
        >
          <Dropdown.Toggle
            variant="none"
            className="bg-transparent border-0 "
            id="dropdown-basic"
            style={{ color: "#7a73bd " }}
          >
            <i className="fas fa-ellipsis-v"></i>
          </Dropdown.Toggle>

          <Dropdown.Menu
            variant="dark"
            //set the min width of the dropdown menu
            style={{ minWidth: "100px" }}
          >
            <Dropdown.Item>Mark as Submitted</Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                setOpen(true);
              }}
            >
              Delete Post
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Modal centered show={open} onHide={() => setOpen(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this post? This action cannot be
            undone.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-dark"  onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </span>
      <div className="d-flex justify-content-between gap-4  flex-column flex-md-row">
        <div className="d-flex gap-3 align-items-center flex-column flex-md-row">
          <Image
            fluid
            thumbnail
            className="rounded img-handle"
            src={props.photo}
            alt={props.title}
            style={{ width: "7em", height: "7em", objectFit: "contain" }}
          />
          <div className="cin d-flex flex-column gap-1 ">
            <div
              className="text-dark fw-bold "
              style={{ wordBreak: "break-all" }}
            >
              {props.title}
            </div>
            <div
              className="description text-dark "
              style={{ wordBreak: "break-all" }}
            >
              {limit(props.body, 100)}
            </div>
            {/* <div className="price-dark fw-bolder">₹ {props.price}</div> */}
          </div>
        </div>
        <div className="more d-flex flex-row flex-md-column flex-lg-row gap-5 gap-md-3 gap-lg-5 align-items-center flex-fill justify-content-center justify-content-md-between justify-content-lg-end">
          <span className="subject d-flex flex-column  align-items-center text-center">
            <img
              width="22"
              height="20"
              src="https://img.icons8.com/pulsar-color/150/000000/book.png"
              alt="book"
            />
            <span className="ms-1" style={{ width: "60px" }}>
              {props.subject}
            </span>
          </span>
          <span className="deadline d-flex align-items-center flex-column text-nowrap">
            <img
              width="22"
              height="20"
              className="img-fluid img"
              alt="deadline"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAECUlEQVR4nO2Zy2vUQBjApxXFm4q6+WbbskXFR8Wi1Gcf87W1VVB7ULEemuALfIGiKNiNeFBBRCuoFA+KXvSg4kHRv8KKiHeplwpifRyEYu068qXd7CSbpNlHthb3g2FhM8l8v++VmS+MBUisqrkeAG9qXLwBjp+B4ygADmlcDGgc+zjHZsZYBfsXJZHA2RqI78BRBg0LRmtpZ9MVAGwQvMHYnhnsX5LYeAid5bxli6ZtijHWMHN+TWM8FscO4NgPXPx0gIB4nivEwmpcAiDO0C8rtSxY0MI1Lp5leyK8AMcPE/d+iE5TWgjEFQ3ECP26LlVoXFx3QGiiLfRzeeY+FqVogL8s5QB/eVyuUD1Bia1WJwDxADimJs8lMUZVDjg+DW2EeHzzfAC8CtCyrxBLUTipOTFRYtm8eR1zwhYCcA/A+3V1dbMCAQDEvcyibQ35AkzM6VdyoS93D6AHhLgXDMDxvTJ5XSEAMS46FYDXLPfQrAQQKzQuHjohWjEAQPxIT0wkcG5IgEqvOVRiFfcPFVIcNMBHyrMeBwDgaEaxhpmTWYpG7ZK9r3rOjb00TPnNMKVMj57eURsyXtVh/5/P2HX8o/2smtquEeO8bPaxgJX11kSyYIClbqteWN9+K2vR7lNf7OuJxbsLAtCTKftZPN4m9aRM6aY8mW1Zjq/TE+kN6+9sVkmWT8+tqtmatei2/QP2osvqjxYEYJjSkczjUDK1Lymb3AB9ysT+AABGYbN+820Zr+6Um7bezVpw5doz+ZVLPvlQ1nnhUIrqtfIi+Un13A9AT8qvftbqPjVsuTpqAN2Uw15v0YFM+RPP/Pb4/u7+I+s3XohMeXB64E+WYrSfd94grnlB+Cm/ofOOY7HtB94WHP+GRw6kh2d40C5SvYE84Q4nr7BxW55giqG8kSsA7eNpP+/yBO1t+ukNSyVW7x2V3ae/WNVmXftNqxKp8+s3mFb5myKANARezSdGG1r7pN47VjTljfwAMjmhJnbQWLrqcNFi3igWwIRUUImlw4r1sgMc4lUdMrFot1y66ogV612H3ltJHIXyRhEAsiQqRY0yQMht7rTygOZxBp5WAKDcXAYwyx6Q5RAiKSexWa5C8n8qo2IsAzDe8y+l8rqrrZJPFfpkP4Dj8lID7Do+6NtjCgvwVDlePiw1wJqmyzbA6saLuQNQf95xRgZ8RFYp5pHR8AibnccG5eqmS47433HwXe4AlhcA70fZKoGQR1UXaHZbxU/o44L6/WAqlO/p/e30kkdjK4QnWhE4Pqmu7RqJsvvG421WwlLMu8MmE2byOctXqMVNDdZSJrPhVD6ln5eNrBChFvdUQOi0ZlKeYMUQanFTl5jiMXLFTTlMYVOw5ctSFuYpfwGyNJNATmIOAgAAAABJRU5ErkJggg=="
            ></img>
            <span className="ms-1">
              {moment(props.deadline).format("DD MMM YY")}
            </span>
          </span>
        </div>
        <div className="btn-group d-flex flex-row flex-md-column flex-lg-row gap-3 align-items-md-stretch align-items-lg-center justify-content-center text-nowrap">
          <Button
            variant="none"
            className="rounded-2  btn btn-outline-dark"
            // onClick={EditPost}
            onClick={() => {
              navigate(`/editpost/${props.id}`);
            }}
            // style={{ width: "max-content" }}
          >
            Edit
            <i className="fas fa-edit ms-1"></i>
          </Button>
          <Button
            onClick={() => {
              navigate(`/posts/${props.id}`);
            }}
            className="rounded-2 text-light"
          >
            View
            <svg
              width="22px"
              height="22px"
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
                  d="M7 17L17 7M17 7H8M17 7V16"
                  stroke="#f8f9fa"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>{" "}
              </g>
            </svg>
          </Button>
        </div>
      </div>
      <div
        className="PostDetails text-dark d-flex align-items-center  justify-content-between mt-3 pt-2"
        style={{
          borderTop: "1px solid rgb(102 117 125 / 33%)  ",
        }}
      >
        <span className="text-muted views">
          Created at:
          <span className="text-dark ms-1">
            {moment(props.date).format("DD MMM YY")}
          </span>
        </span>
        <div className="d-flex align-items-center gap-3">
          {/* <span className="subject ">
            <img
              width="22"
              height="20"
              src="https://img.icons8.com/pulsar-color/150/000000/book.png"
              alt="book"
            />
            <span className="ms-1">{props.subject}</span>
          </span>
          <span className="deadline">
            <img
              width="22"
              height="20"
              className="img-fluid img"
              alt="deadline"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAECUlEQVR4nO2Zy2vUQBjApxXFm4q6+WbbskXFR8Wi1Gcf87W1VVB7ULEemuALfIGiKNiNeFBBRCuoFA+KXvSg4kHRv8KKiHeplwpifRyEYu068qXd7CSbpNlHthb3g2FhM8l8v++VmS+MBUisqrkeAG9qXLwBjp+B4ygADmlcDGgc+zjHZsZYBfsXJZHA2RqI78BRBg0LRmtpZ9MVAGwQvMHYnhnsX5LYeAid5bxli6ZtijHWMHN+TWM8FscO4NgPXPx0gIB4nivEwmpcAiDO0C8rtSxY0MI1Lp5leyK8AMcPE/d+iE5TWgjEFQ3ECP26LlVoXFx3QGiiLfRzeeY+FqVogL8s5QB/eVyuUD1Bia1WJwDxADimJs8lMUZVDjg+DW2EeHzzfAC8CtCyrxBLUTipOTFRYtm8eR1zwhYCcA/A+3V1dbMCAQDEvcyibQ35AkzM6VdyoS93D6AHhLgXDMDxvTJ5XSEAMS46FYDXLPfQrAQQKzQuHjohWjEAQPxIT0wkcG5IgEqvOVRiFfcPFVIcNMBHyrMeBwDgaEaxhpmTWYpG7ZK9r3rOjb00TPnNMKVMj57eURsyXtVh/5/P2HX8o/2smtquEeO8bPaxgJX11kSyYIClbqteWN9+K2vR7lNf7OuJxbsLAtCTKftZPN4m9aRM6aY8mW1Zjq/TE+kN6+9sVkmWT8+tqtmatei2/QP2osvqjxYEYJjSkczjUDK1Lymb3AB9ysT+AABGYbN+820Zr+6Um7bezVpw5doz+ZVLPvlQ1nnhUIrqtfIi+Un13A9AT8qvftbqPjVsuTpqAN2Uw15v0YFM+RPP/Pb4/u7+I+s3XohMeXB64E+WYrSfd94grnlB+Cm/ofOOY7HtB94WHP+GRw6kh2d40C5SvYE84Q4nr7BxW55giqG8kSsA7eNpP+/yBO1t+ukNSyVW7x2V3ae/WNVmXftNqxKp8+s3mFb5myKANARezSdGG1r7pN47VjTljfwAMjmhJnbQWLrqcNFi3igWwIRUUImlw4r1sgMc4lUdMrFot1y66ogV612H3ltJHIXyRhEAsiQqRY0yQMht7rTygOZxBp5WAKDcXAYwyx6Q5RAiKSexWa5C8n8qo2IsAzDe8y+l8rqrrZJPFfpkP4Dj8lID7Do+6NtjCgvwVDlePiw1wJqmyzbA6saLuQNQf95xRgZ8RFYp5pHR8AibnccG5eqmS47433HwXe4AlhcA70fZKoGQR1UXaHZbxU/o44L6/WAqlO/p/e30kkdjK4QnWhE4Pqmu7RqJsvvG421WwlLMu8MmE2byOctXqMVNDdZSJrPhVD6ln5eNrBChFvdUQOi0ZlKeYMUQanFTl5jiMXLFTTlMYVOw5ctSFuYpfwGyNJNATmIOAgAAAABJRU5ErkJggg=="
            ></img>
            <span className="ms-1">
              {moment(props.deadline).format("DD MMM YYYY")}
            </span>
          </span> */}

          <span className="price">
            <i className="fas fa-rupee-sign"></i>
            <span className="ms-1">{props.price}</span>
          </span>

          <span className="text-dark likes">
            <i className="fas fa-heart text-danger"></i>
            <span className="ms-1">{props.TotalLikes}</span>
          </span>
        </div>
      </div>
    </Container>
    // <div className="col-lg-3 col-md-4 col-6 my-2 ">
    // <Card className='my-2 ' style={{ height: "20rem", cursor: "pointer" }}>
    //   <Link className='text-decoration-none text-dark' to={`/posts/${props.id ? props.id : ''}`}>
    //     <div className="text-center w-25">
    //       <Image rounded src={props.photo} alt={props.title} fluid className='w-95 mx-auto my-2' style={{ height: "8rem" }}  ></Image>
    //     </div>
    //     <Card.Body className='h-75'>
    //       <Card.Title>{props.title.length < 23 ? props.title : limit(props.title, 23)}</Card.Title>
    //       <Card.Text className='lh-sm linesetter'>
    //         {props.body}
    //       </Card.Text>
    //       <span className="text-muted position-absolute" style={{ bottom: "5px" }}>{props.subject}</span>
    //     </Card.Body>
    //   </Link>
    // </Card>
    // </div>
  );
}

export default PostCard;
