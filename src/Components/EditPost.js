import React, { useEffect, useReducer, useRef, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  Image,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { subDays } from "date-fns";
import CurrencyInput from "react-currency-input-field";
import moment, { invalid } from "moment/moment";
import Moodal from "./Moodal";
import demoimage from "../Images/chatBg2.png";
import editPostVector from "../Images/editPostVector.svg";
import { useNavigate, useParams } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setUserPosts } from "../Reducers/UserPosts"; // Make sure to adjust the import path accordingly.

function EditPost() {
  const [selectedOption, setSelectedOption] = useState(null);
  const today = subDays(new Date(), 0); // today's date
  const [step, setStep] = useState(1);
  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { postid } = useParams();
  const [attachment, setAttachment] = useState("");

  const [theImage, setTheImage] = useState("");

  const dispatch = useDispatch();

  // Fetch CSRF token from server on component mount
  useEffect(() => {
    //get edit post data from backend if the user is logged in and the post belongs to him

    fetch(`/editpost/${postid}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          // alert(data.error);
          navigate("/");
        }
        console.log(data, "data");
        setInput((prev) => ({
          ...prev,
          title: data.title,
          description: data.body,
          // url: data.pic,
          price: data.price,
          subject: data.subject,
          deadLine: data.deadline,
          location: data.address,
        }));
        setSelectedOption({ value: data.subject, label: data.subject });
        setAttachment(data.photo);
      })
      .catch((err) => {
        console.log(err);
      });

    fetch("/csrf-token")
      .then((response) => response.json())
      .then((data) => setCsrfToken(data.csrfToken))
      .catch((error) => console.error(error));
  }, []);

  const [UserLocation, setUserLocation] = useState(
    localStorage.getItem("location")
  );

  const options = [
    { value: "science", label: "Science" },
    { value: "maths", label: "Maths" },
    { value: "english", label: "English" },
    { value: "history", label: "History" },
    { value: "geography", label: "Geography" },
    { value: "art", label: "Art" },
    { value: "music", label: "Music" },
    { value: "business", label: "Business" },
    { value: "computer Science", label: "Computer Science" },
    { value: "economics", label: "Economics" },
  ];

  const [input, setInput] = useState({
    title: "",
    description: "",
    url: "",
    price: "",
    subject: "",
    deadLine: null,
    location: UserLocation,
  });

  const [inputValidator, setInputValidator] = useState({
    title: false,
    description: false,
    url: false,
    price: false,
    subject: false,
    deadLine: false,
    location: false,
  });

  let { title, description, url, price, subject, deadLine, location } = input;

  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    // console.log(image);
    fileInputRef.current.click();
    //set the image to the state after user selects it from the file dialog box and set url to the image
    fileInputRef.current.onchange = () => {
      const file = fileInputRef.current.files[0];
      //redner the image to the screen
      setTheImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setAttachment(e.target.result);
      };
      reader.readAsDataURL(file);
    };
  };

  const validateInput = (name, value, e) => {
    //if the input is not empty, set the input validator to true
    //use swithch statement to check which input is being changed
    switch (name) {
      case "title":
        setInputValidator((prev) => ({
          ...prev,
          title: value?.replace(/\s+/g, "").length < e.target.minLength,
        }));
        break;
      case "description":
        // console.log(e.target.minLength,'minlengt');
        setInputValidator((prev) => ({
          ...prev,
          description: value?.replace(/\s+/g, "").length < e.target.minLength,
        }));
        break;
      case "price":
        console.log(value);
        break;
      case "subject":
        setInputValidator((prev) => ({
          ...prev,
          subject: value.length > 0,
        }));
        break;
      case "location":
        setInputValidator((prev) => ({
          ...prev,
          location: value.length > 0,
        }));
        break;

      default:
        break;
    }
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    //set the input to the state
    console.log({ name, value }, "now here");

    //is title is focused then remove the bootstrap porperty form-control:focus

    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    //create a seperate function to validate the input
    validateInput(name, value, e);
  };

  const uploadImage = async () => {
    const data = new FormData();
    data.append("file", theImage);
    data.append("upload_preset", "AssignMentor");
    data.append("cloud_name", "AssignMentor");
    data.append("quality", "eco");

    fetch("https://api.cloudinary.com/v1_1/assignmentor/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.url, "data");
        setInput((prev) => ({
          ...prev,
          url: data.url,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleBtnClick = async (e) => {
    e.preventDefault();

    const isStep1Valid =
      step === 1 &&
      title?.length >= 10 &&
      description?.replace(/\s+/g, "").length >= 25 &&
      subject &&
      attachment;

    const isPriceZero = price === 0 || price === "0";
    const isStep2Valid = step === 2 && !isPriceZero && location;

    // const isStep2Valid =  step === 2 && price !== undefined && !isNaN(price) && location;

    if (isStep1Valid || isStep2Valid) {
      setStep(step + 1);
    } else if (step === 3) {
      //create an edit post function

      try {
        //only if the image is changed then upload the image to cloudinary
        if (theImage) {
          uploadImage();
        } else {
          setLoading(true);
          const response = await fetch(`/editpost/${postid}`, {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "CSRF-Token": csrfToken,
            },
            body: JSON.stringify({
              title: input.title,
              body: input.description,
              pic: attachment,
              price: input.price,
              subject: input.subject,
              deadline: input.deadLine,
              address: input.location,
            }),
          });

          const responseData = await response.json();
          setLoading(false);
          const updatedPosts = responseData.post;
          console.log(updatedPosts, "response data");
          // dispatching action to save posts uploaded by user
          // dispatch(setUserPosts(updatedPosts));
          // alert("Post edited successfully");
          navigate("/profile?editOccurred=true");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    // create an edit post function
    if (!input.url) return;
    const editPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/editpost/${postid}`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken,
          },
          body: JSON.stringify({
            title: input.title,
            body: input.description,
            pic: input.url,
            price: input.price,
            subject: input.subject,
            deadline: input.deadLine,
            address: input.location,
          }),
        });

        const responseData = await response.json();
        console.log(responseData, "response data");
        setLoading(false);
        // alert("Post edited successfully");
        navigate("/profile?editOccurred=true");
      } catch (err) {
        console.log(err);
      }
    };

    editPost();
  }, [input.url]);

  useEffect(() => {
    console.log(url, "url");
  }, [url]);

  const handleBackBtnClick = (e) => {
    e.preventDefault();
    //do not decrement after step 1
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const editLocation = (location) => {
    console.log(location);
    setUserLocation(location);
    setInput((prev) => ({
      ...prev,
      location: location,
    }));
  };

  return (
    <Container fluid>
      <Row className="mt-4">
        <Col md={4} className="px-4 d-none d-md-block">
          <div className="wrapper position-sticky" style={{ top: "70px" }}>
            <div className="title">
              <div className="fs-1 fw-bold">
                <span className="text-dark">
                  Make Sure Your Post is Perfect
                </span>
                <span className="text-primary mx-0">...</span>
              </div>
              <div className="text-muted my-2">
                Make sure your post is complete and accurate.
              </div>

              <Image src={editPostVector} className="w-75" />
              {/* <a href="https://storyset.com/imagination visually-hidden"></a> */}
              <a
                className="visually-hidden"
                href="https://storyset.com/education"
              >
                Education illustrations by Storyset
              </a>
            </div>
          </div>
        </Col>

        <Col md={6} className="px-4" style={{ overflowY: "auto" }}>
          {/* step 1 */}
          {step === 1 && (
            <div className="wrapper">
              <div className="form">
                <div className="text fs-5 my-1 fw-bold text-dark">
                  Give your project a brief title
                </div>
                <span className="text-muted my-1">
                  Keep it short and simple - this will help us match you to the
                  right category.
                </span>

                <InputGroup className="my-2 pe-5">
                  <Form.Control
                    placeholder="Create a 3D model for water cycle on a thermacol "
                    className={`border-end-0 my-placeholder bg-body BGC ${
                      inputValidator.title
                        ? "red"
                        : title?.replace(/\s+/g, "").length >= 10
                        ? "green"
                        : ""
                    }`}
                    aria-label="post title"
                    onChange={onInputChange}
                    name="title"
                    value={title}
                    // isInvalid={title.replace(/\s+/g, "").length < 10}
                    isInvalid={inputValidator.title}
                    isValid={title?.replace(/\s+/g, "").length >= 10}
                    required
                    minLength={10}
                    maxLength={25}
                    pattern="^[a-zA-Z0-9_ ]*$"
                  />
                  <InputGroup.Text
                    className={`bg-body border-start-0 ${
                      inputValidator.title
                        ? "border-danger"
                        : title?.replace(/\s+/g, "").length >= 10
                        ? "border-success"
                        : ""
                    }`}
                  >
                    {title?.length}/25
                  </InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    Write at least 10 characters
                  </Form.Control.Feedback>
                  <span className="valid-feedback ">Looks good!</span>
                </InputGroup>
              </div>
              <p style={{ fontSize: "14px" }}>
                <a
                  href="/createpost"
                  className="link-dark link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover my-2"
                >
                  Some title examples
                </a>
              </p>
              <div className="description my-5">
                <div className="text fs-5 my-1 fw-bold">
                  Describe your project
                </div>
                <span className="text-muted my-1">
                  Tell us more about your project. What is it about? What are
                  you trying to achieve? What are the deliverables?
                </span>
                <Form.Group
                  as={Col}
                  md="12"
                  controlId="validationTextarea"
                  className="my-2"
                >
                  <InputGroup hasValidation>
                    <FormControl
                      as="textarea"
                      placeholder="I need"
                      className={`bg-body ${
                        inputValidator.description
                          ? "red"
                          : description?.replace(/\s+/g, "").length >= 25
                          ? "green"
                          : ""
                      }`}
                      required
                      isInvalid={inputValidator.description}
                      isValid={description?.replace(/\s+/g, "").length >= 25}
                      onChange={onInputChange}
                      name="description"
                      value={description}
                      style={{ height: "120px", resize: "none" }}
                      minLength={25}
                      maxLength={150}
                    />
                    <Form.Control.Feedback type="invalid">
                      Add at least {description?.replace(/\s+/g, "").length}/25
                      characters for relevant matches.
                    </Form.Control.Feedback>
                    <span className="valid-feedback ">Looks good!</span>
                  </InputGroup>
                </Form.Group>
                <p style={{ fontSize: "14px" }}>
                  <a
                    href="/"
                    className="link-dark link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover my-2"
                  >
                    How does this matching thing work?
                  </a>
                </p>
                <Button
                  onClick={handleImageClick}
                  variant="none"
                  className="btn-outline-post px-4 py-2 "
                >
                  Edit Image
                </Button>

                {/* // if attachment is added show the image here */}
                <div className="attachment my-2">
                  <Form.Control
                    ref={fileInputRef}
                    // onChange={SelectImage}
                    type="file"
                    accept="image/png, image/jpg , image/jpeg "
                    className="visually-hidden"
                  />
                  <Image
                    // height={150}
                    // width={150}
                    src={attachment}
                    onClick={handleImageClick}
                    alt="attachment"
                    className={`img-fluid rounded w-50 ${
                      attachment ? "d-block" : "d-none"
                    }`}
                  />
                </div>
              </div>
              <div className="subject-choose my-5">
                <div className="span fs-5 fw-bold my-1">
                  Which subject best fits your project?
                </div>
                <Select
                  defaultValue={selectedOption}
                  name="subject"
                  onChange={(e) => {
                    console.log(e);
                    setSelectedOption(e);
                    setInput((prev) => ({
                      ...prev,
                      subject: e.value,
                    }));
                  }}
                  options={options}
                  placeholder={
                    input.subject ? input.subject : "Select a subject"
                  }
                  menuPlacement="top"
                  styles={{
                    control: (base) => ({
                      ...base,
                      border:
                        selectedOption !== null
                          ? "1px solid #198754"
                          : "1px solid #ced4da",
                      boxShadow: "none",
                      "&:hover": {
                        border:
                          selectedOption !== null
                            ? "1px solid #198754"
                            : "1px solid #ced4da",
                      },
                    }),
                  }}
                  //create a suitable menu placement
                  className={`${
                    selectedOption !== null ? "is-valid" : "is-invalid"
                  } my-1`}
                  classNamePrefix="select"
                />
                {console.log(inputValidator.subject, "here")}
                <Form.Control.Feedback type="invalid">
                  Select a subject
                </Form.Control.Feedback>
                <Form.Control.Feedback type="valid">
                  Looks good!
                </Form.Control.Feedback>
              </div>
            </div>

            //       className="is-invalid my-1"
            //     />
            //   </div>
            // </div>
          )}

          {/* step2 */}
          {step === 2 && (
            <div className="wrapper vh-100">
              <div className="form">
                <div className=" fs-5 my-2 fw-bold text-dark">
                  I'm looking to spend...
                </div>
                <InputGroup className="my-3 pe-5">
                  <CurrencyInput
                    prefix="₹"
                    name="price"
                    placeholder="₹"
                    inputMode="numeric"
                    value={price}
                    className={`form-control rounded ${
                      price ? "" : "is-invalid"
                    }`}
                    defaultValue={""}
                    onValueChange={(value, name) => {
                      // if price value is 0 then do not set the input
                      if (value == 0) {
                        return;
                      }
                      setInput((prev) => ({
                        ...prev,
                        price: value,
                      }));
                    }}
                    onChange={(e) => {
                      validateInput("price", price, e);
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    Enter a valid amount
                  </Form.Control.Feedback>
                </InputGroup>
                <div className="text-dark fs-5 my-2 fw-bold">
                  I need this done by...
                </div>
                <div className="d-flex pe-5">
                  <DatePicker
                    name="deadLine"
                    className=" form-control my-1 pointer border-end-0"
                    dateFormat="MMM d, yyyy"
                    minDate={today}
                    selected={moment(deadLine).toDate()}
                    onChange={(date) => {
                      setInput((prev) => ({
                        ...prev,
                        deadLine: date.toISOString(),
                      }));
                    }}
                  />

                  <InputGroup.Text
                    className="calendar-icon bg-body  my-1 border-start-0 justify-content-end"
                    style={{ borderRadius: "0px 0.375rem 0.375rem 0px" }}
                  >
                    <img
                      width="16"
                      height="16"
                      src="https://img.icons8.com/material-outlined/245/calendar--v1.png"
                      alt="calendar--v1"
                    />
                  </InputGroup.Text>
                </div>
                {/* //ask for location */}
                <div className="text-dark fs-5 mt-3 fw-bold">
                  I need this done at...
                </div>

                {/* //location is necessary so that nearby people can see your post and contact you if they are interested  */}
                <span className="text-muted my-1">
                  This will help us match you with the right people nearby.
                </span>

                <InputGroup className="my-2 pe-5">
                  <Form.Control
                    type="text"
                    placeholder="Enter your location"
                    name="location"
                    onChange={onInputChange}
                    required
                    value={location}
                    // isValid={location.length > 0}
                  />

                  <Moodal show={false} img={true} editLocation={editLocation} />

                  {/* <Button size="sm">
                  detect
                    <svg
                      width="16px"
                      height="16px"
                      viewBox="0 0 24 24"
                      className="ms-1"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        {" "}
                        <path
                          d="M19 12C19 15.866 15.866 19 12 19M19 12C19 8.13401 15.866 5 12 5M19 12H21M12 19C8.13401 19 5 15.866 5 12M12 19V21M5 12C5 8.13401 8.13401 5 12 5M5 12H3M12 5V3M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                          stroke="#ffffff"
                          stroke-width="1"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>{" "}
                      </g>
                    </svg>
                  </Button> */}
                </InputGroup>
              </div>
            </div>
          )}

          {/* step3 */}
          {step === 3 && (
            <div className="wrapper">
              <div className="text fs-3 my-1 fw-bold text-dark">
                Review your post
              </div>
              <span className="text-muted my-1">
                Make sure everything looks good before you post it.
              </span>
              <div className="review">
                <div className="title my-3">
                  <div className="fs-6 text-dark my-2 fw-bold">Title</div>
                  <div className="title text-muted">{title}</div>
                </div>
                <div className="description my-3">
                  <div className="fs-6 text-dark my-2 fw-bold">Description</div>
                  <div className="description text-muted text-break">
                    {description}
                  </div>
                </div>
                <div className="Attachment my-3">
                  <div className="fs-6 text-dark my-2 fw-bold">Attachment</div>
                  <Image
                    //set width and height of image to 100%
                    className="w-50"
                    src={attachment}
                  />

                  <div
                    className="text-muted mt-5"
                    style={{ borderTop: "1px solid #e4e5e7" }}
                  ></div>
                </div>
                <div className="Budget&Timeline my-3">
                  <div className="fs-5 text-dark my-2 fw-bold">
                    Budget, Deadline & Location
                  </div>
                  <div className="d-flex flex-wrap justify-content-between">
                    <div className="budget">
                      <div className="fs-6 text-dark my-2 fw-bold"> Budget</div>
                      <div className="title text-muted"> ₹{price} </div>
                    </div>
                    <div className="deadline">
                      <div className="fs-6 text-dark my-2 fw-bold">
                        Deadline
                      </div>
                      <div className="title text-muted">
                        {moment(deadLine).format("MMM DD, yyyy")}
                      </div>
                    </div>
                    <div className="location">
                      <div className="fs-6 text-dark my-2 fw-bold">
                        Location
                      </div>
                      <div className="title text-muted">{location}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Col>
        <div
          className={`border rounded d-flex flex-wrap p-3 justify-content-between sticky-bottom bg-body`}
        >
          {/* Back button */}
          <Button
            variant="none"
            onClick={handleBackBtnClick}
            className={`btn-outline-post px-4 py-2  ${
              step === 1 ? "invisible" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-right me-2"
              style={{ transform: "rotate(180deg)" }}
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
            {step === 1 && "Back"}
            {step === 2 && "Edit"}
            {step === 3 && "Edit"}
          </Button>

          {/* Next button */}
          <Button
            variant="none"
            //when i click on continue button it should go to next step and there are 3 steps, it should only go till 3rd step
            onClick={handleBtnClick}
            className="btn-dark px-4 py-2"
          >
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className={`me-2 ${loading ? "d-inline-block" : "d-none"}`}
            />

            {step === 1 && "Continue"}
            {step === 2 && "Review"}
            {step === 3 && !loading ? "Save" : ""}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-arrow-right ms-2"
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
          </Button>
        </div>
      </Row>
    </Container>
  );
}

export default EditPost;
