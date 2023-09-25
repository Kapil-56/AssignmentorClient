import { useState, useContext } from "react";
import { Form, Button, Col, Row, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { useCookies } from "react-cookie";
import { IoMdLogIn } from "react-icons/io";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginGif from "../Images/LoginGif.gif";

function Login({ tabTitle }) {
  const [cookies, setCookie] = useCookies(["user"]);
  const { state, dispatch } = useContext(UserContext);
  let navigate = useNavigate();
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");
  const notify = (prompt) =>
    toast.error(prompt, {
      position: "top-center",
    });
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    document.title = tabTitle;
  }, []);

  // Fetch CSRF token from server on component mount
  useEffect(() => {
    fetch("https://assignmentorbackend.onrender.com/csrf-token")
      .then((response) => response.json())
      .then((data) => setCsrfToken(data.csrfToken))
      .catch((error) => console.error(error));
  }, []);

  const sendToDb = () => {
    if (!email || !pass) {
      return notify("Enter credentials");
    }
    fetch("https://assignmentorbackend.onrender.com/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password: pass,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          notify(data.error);
        } else {
          setCookie("jwt", data.token, {
            expires: new Date(Date.now() + 25982000000),
            path: "/",
            secure: false,
          });
          //also set header
          notify("Logged in successfully");
          console.log(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Row className="g-0">
      <Col xl={6} lg={6} md={6} className="d-none d-md-block">
        <img className="img-fluid" src={LoginGif} alt="" srcSet="" />
        <a className="d-none" href="https://storyset.com/work">
          Work illustrations by Storyset
        </a>
        {/* <spline-viewer
          loading-anim
          url="https://prod.spline.design/frsBOGNh4ffMUYA5/scene.splinecode"
        ></spline-viewer> */}
      </Col>
      <Col xl={6} lg={6} md={6} className="justify-content-center">
        <div className="d-flex flex-column flex-lg-row flex-md-row  justify-content-center my-4">
          <Form
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendToDb();
              }
            }}
            className=" d-flex flex-column p-3 bg-body rounded"
          >
            <h1 className="text-center fw-light my-3">
              Login <IoMdLogIn className="text-warning" />
            </h1>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label name="email">Email address</Form.Label>
              <Form.Control
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                name="email"
                type="email"
                placeholder="Enter email"
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label name="password">Password</Form.Label>
              <Form.Control
                onChange={(e) => setPass(e.target.value)}
                value={pass}
                name="password"
                type="password"
                autoComplete="on"
                placeholder="Password"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                label="Remember me"
                id="remember-me"
              />
            </Form.Group>
            <Button
              disabled={pass.length >= 1 && email.length > 1 ? false : true}
              onClick={sendToDb}
              variant="primary"
              type="button"
            >
              Submit
            </Button>
            <Form.Text className="text-muted text-center pt-3">
              Don't have an account?
              <Link className="mx-1" to={"/signup"}>
                Signup
              </Link>
              <ToastContainer />
            </Form.Text>
          </Form>
        </div>
      </Col>
    </Row>
  );
}

export default Login;
