import { useState, useEffect } from "react";
import { Form, Button, Container, Spinner, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { IoMdLogIn } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import SignUp.svg image from images folder
import SignUp from "../Images/Creativity.gif";

function Signup({ tabTitle }) {
  let navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [csrfToken, setCsrfToken] = useState("");
  const ApiString = process.env.REACT_APP_API_STRING;
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const multiAvatarApi = process.env.REACT_APP_MULTIAVATAR_API;
  const notify = (prompt) =>
    toast.error(prompt, {
      position: "top-center",
    });

  useEffect(() => {
    document.title = tabTitle;
  }, []);

  // const { state, dispatch } = useContext(UserContext)

  // Fetch CSRF token from server on component mount
  // useEffect(() => {
  //   fetch("https://assignmentorbackend.onrender.com/csrf-token")
  //     .then((response) => response.json())
  //     .then((data) => setCsrfToken(data.csrfToken))
  //     .catch((error) => console.error(error));
  // }, []);

  const sendToDb = async () => {
    const { name, email, password, cpass } = input;
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      return notify("Please fill all the fields");
    }
    if (password === cpass) {
      const csrfToken = await fetch(
        "https://assignmentorbackend.onrender.com/csrf-token"
      )
        .then((response) => response.json())
        .then((data) => data.csrfToken);
        console.log(csrfToken);
      fetch("https://assignmentorbackend.onrender.com/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken, // Add CSRF token to headers
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.error) {
            return notify(data.error);
          }
          setStep(2);
          // else {
          //   console.log(data);
          //   alert(data.message)
          //   setStep(2)
          //   // navigate('/setAvatar')
          // }
        });
    } else {
      notify("Passwords do not match");
    }
  };

  const setProfilePic = async () => {
    const { name, email, password } = input;
    if (selectedAvatar === null) {
      alert("please select an Avatar to continue");
      console.log(selectedAvatar);
      console.log(input);
    } else {
      console.log(avatars[selectedAvatar]);
      fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken, // Add CSRF token to headers
        },
        body: JSON.stringify({
          name,
          email,
          password,
          avatar: avatars[selectedAvatar],
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            console.log(data);
            alert(data.message);
            navigate("/login");
          }
        });
    }
  };
  useEffect(() => {
    const fetchAvatars = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const image = await fetch(
          `${ApiString}${Math.round(
            Math.random() * 1000
          )}?apikey=${multiAvatarApi}`
        );
        const buffer = await image.arrayBuffer();
        const base64 = btoa(
          new Uint8Array(buffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        data.push(base64);
      }
      setAvatars(data);
      setIsLoading(false);
    };
    fetchAvatars();
  }, []);

  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    cpass: "",
  });

  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
    cpass: "",
  });

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateInput(e);
  };

  const validateInput = (e) => {
    let { name, value } = e.target;
    setError((prev) => {
      const stateObj = { ...prev, [name]: "" };

      switch (name) {
        case "cpass":
          if (!value) {
            stateObj[name] = "Please enter confirm password.";
          } else if (input.password && value !== input.password) {
            stateObj[name] = "Password does not match.";
          }
          break;

        default:
          break;
      }
      return stateObj;
    });
  };

  return (
    <>
      {step === 1 ? (
        <Container fluid>
          <Row>
            <Col xl={6} lg={6} md={6} className="d-none d-md-block text-center">
              <img src={SignUp} alt="" srcSet="" />
              <a className="d-none" href="https://storyset.com/idea">
                Idea illustrations by Storyset
              </a>
            </Col>

            <Col xl={6} lg={6} md={6} className="d-md-block">
              <div className="d-flex flex-column flex-lg-row flex-md-row  justify-content-center my-4">
                <Form
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendToDb();
                    }
                  }}
                  className="d-flex flex-column p-3 bg-body rounded"
                >
                  <h1 className="text-center">
                    Sign up <IoMdLogIn className="text-warning" />
                  </h1>
                  <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label name="name">Name</Form.Label>
                    <Form.Control
                      name="name"
                      onBlur={validateInput}
                      onChange={onInputChange}
                      type="text"
                      placeholder="Enter your Name"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label name="email">Email address</Form.Label>
                    <Form.Control
                      name="email"
                      onBlur={validateInput}
                      onChange={onInputChange}
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
                      name="password"
                      onBlur={validateInput}
                      onChange={onInputChange}
                      type="password"
                      placeholder="Password"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicCPassword">
                    <Form.Label name="cpassword">Confirm Password</Form.Label>
                    <Form.Control
                      name="cpass"
                      onBlur={validateInput}
                      onChange={onInputChange}
                      type="password"
                      placeholder="Confirm Password"
                    />
                    {error.cpass && (
                      <Form.Text className="text-muted">
                        {error.cpass}
                      </Form.Text>
                    )}
                  </Form.Group>
                  <Button onClick={sendToDb} variant="primary" type="button">
                    Next
                  </Button>
                  <Form.Text className="text-muted text-center pt-3">
                    Already have an account?
                    <Link className="mx-1" to={"/login"}>
                      Login
                    </Link>
                  </Form.Text>
                  <ToastContainer />
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      ) : isLoading ? (
        <Container className="vh-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border"></Spinner>
        </Container>
      ) : (
        <Container className="vh-100 d-flex flex-column justify-content-center align-items-center gap-5">
          <div className="title">
            <h1>Select an avatar as your profile picture</h1>
          </div>
          <div className="avatars d-flex gap-5 for-mob-gap">
            {avatars.map((avatar, index) => {
              return (
                <div
                  key={index}
                  style={{
                    transition: "0.3s ease-in-out",
                    border: "2px solid transparent",
                  }}
                  className={`avatar avatar-hover p-1 rounded-pill d-flex justify-content-center align-items-center ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    className="for-mob-avatar"
                    style={{ height: "6rem" }}
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <Button
            variant="none"
            className="btn-outline-dark w-50"
            onClick={setProfilePic}
          >
            Select Avatar
          </Button>
        </Container>
      )}
    </>
  );
}

export default Signup;
