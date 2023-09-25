import React, { useEffect, useState, useRef } from "react";
import { Button, FloatingLabel, Form, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CurrencyInput from "react-currency-input-field";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { subDays } from "date-fns";
import demoImage from "../Images/demoImage.png";
import LoadingBar from "react-top-loading-bar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CreatePost({ tabTitle }) {
  let navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const notify = (prompt) =>
    toast.error(prompt, {
      position: "top-center",
    });

  useEffect(() => {
    document.title = tabTitle;
  }, []);

  const LocationApi = process.env.REACT_LOCATION_API_KEY

  
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const [address, setAddress] = useState(null);
  const [deadLine, setDeadLine] = useState(new Date());
  const today = subDays(new Date(), 0); // today's date
  const [generating, setGenerating] = useState(false);

  const [csrfToken, setCsrfToken] = useState("");

  // Fetch CSRF token from server on component mount
  useEffect(() => {
    fetch("/csrf-token")
      .then((response) => response.json())
      .then((data) => setCsrfToken(data.csrfToken))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const successHandler = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    };
    const errorHandler = (error) => {
      if (error.code === 1) {
        // Permission denied
        navigator.permissions.query({ name: "geolocation" }).then((result) => {
          if (result.state === "denied") {
            console.log(result.state);
            result.onchange = () => {
              if (result.state === "granted") {
                navigator.geolocation.getCurrentPosition(
                  successHandler,
                  errorHandler
                );
              }
            };
          } else {
            navigator.geolocation.getCurrentPosition(
              successHandler,
              errorHandler
            );
          }
        });
      } else {
        console.log(error);
      }
    };

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
  }, []);

  useEffect(() => {
    try {
      if (location.latitude && location.longitude) {
        fetch(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${location.latitude}&lon=${location.longitude}&apiKey=${LocationApi}}`
        )
          .then((response) => response.json())
          .then((result) =>
            setAddress(result["features"][0]["properties"]["city"])
          )
          .catch((error) => console.log("error", error));
      }
    } catch (error) {
      console.log(error);
    }
  }, [location]);

  const [input, setInput] = useState({
    title: "",
    body: "",
    url: "",
    price: "",
    subject: "",
  });

  let { title, body, url, subject, price } = input;

  const [image, setImage] = useState("");
  const [showImage, setShowImage] = useState(demoImage);
  // const [title, setTitle] = useState('')
  // const [body, setBody] = useState('')
  // const [url, setUrl] = useState('')
  // const [subject, setSubject] = useState("")

  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    // console.log(image);
    fileInputRef.current.click();
  };

  // useEffect(() => {
  //   if (url) {
  //     console.log(csrfToken);
  //     fetch("/createpost", {
  //       method: 'POST',
  //       credentials: "include",
  //       headers: {
  //         "Content-Type": "application/json",
  //         // "CSRF-Token": csrfToken // Add CSRF token to headers
  //       },
  //       body: JSON.stringify({
  //         title,
  //         body,
  //         pic: url,
  //         price,
  //         subject,
  //         address,
  //         deadline: deadLine
  //       })
  //     }).then(res => res.json())
  //       .then(data => {
  //         if (data.error) {
  //           alert(data.error)
  //         }
  //         else {
  //           alert('Post Created Sucess')
  //           navigate('/profile')
  //         }
  //       }).catch(err => console.log(err))
  //   }
  // }, [url])

  useEffect(() => {
    if (url) {
      console.log(csrfToken);
      setProgress(70);
      fetch("/createpost", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken, // Add CSRF token to headers
        },
        body: JSON.stringify({
          title,
          body,
          pic: url,
          price,
          subject,
          address,
          deadline: deadLine,
        }),
      })
        .then((res) => {
          if (res.status === 403) {
            // CSRF token error
            throw new Error("CSRF token error");
          }
          return res.json();
        })
        .then((data) => {
          if (data.error) {
            notify(data.error);
          } else {
            setProgress(100);

            // alert("Post Created Sucess");
            navigate("/profile");
          }
        })
        .catch((err) => {
          if (err.message === "CSRF token error") {
            notify("CSRF token error. Please refresh the page and try again.");
          } else {
            console.log(err);
          }
        });
    }
  }, [url, csrfToken]);

  const sendToDb = () => {
    // console.log({ title, body, subject, image })

    if (
      title.replace(/ /g, "").length >= 10 &&
      body.replace(/ /g, "").length >= 10 &&
      subject
    ) {
      if (!image) {
        notify("Please insert image");
      }
      if (!address) {
        return notify("Please allow location access");
      } else {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "AssignMentor");
        data.append("cloud_name", "AssignMentor");
        data.append("quality", "eco");
        fetch("https://api.cloudinary.com/v1_1/AssignMentor/image/upload", {
          method: "POST",
          body: data,
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data.secure_url);
            setInput((prevInput) => ({
              ...prevInput,
              url: data.secure_url,
            }));
          })
          .catch((err) => console.log(err));
      }
    } else {
      notify("Please fill all the fields");
    }
  };
  const onInputChange = (e) => {
    const { name, value } = e.target;
    // console.log({ name, value });
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateInput(e);
  };

  const validateInput = (e) => {
    let { name, value, classList } = e.target;
    // console.log({name,value});
    if (name === "subject") {
      if (value === "") {
        classList.remove("is-valid");
        classList.add("is-invalid");
      } else {
        classList.remove("is-invalid");
        classList.add("is-valid");
      }
    }
    if (name === "price") {
      if (
        /[a-zA-Z]/.test(value) ||
        value === "₹" ||
        value === "" ||
        value === " "
      ) {
        // console.log(value);
        classList.add("is-invalid");
        // classList.remove('is-invalid')
      } else {
        // console.log(value);
        classList.remove("is-invalid");
        classList.add("is-valid");
        // classList.remove('is-invalid')
      }
    }
    if (name === "title" || name === "body") {
      if (value.replace(/ /g, "").length >= 10) {
        classList.remove("is-invalid");
        classList.add("is-valid");
      } else if (value.replace(/ /g, "").length <= 10) {
        classList.remove("is-valid");
        classList.add("is-invalid");
      }
    }
    // console.log(value.length);
  };

  // const handleFormClick = (e) => {
  //   setTitle(e.target.value)

  // }

  const SelectImage = (e) => {
    let object = e.target.files[0];
    // console.log('ss');

    setShowImage(URL.createObjectURL(object));
    setImage(object);
    console.log(URL.createObjectURL(object));

    if (object) {
      setShowImage(URL.createObjectURL(object));
      console.log(image);
    } else {
      console.log("object");
    }
  };
  // const SelectImage = async (e) => {
  //   let object = e.target.files[0];
  //   console.log('originalFile instanceof Blob', object instanceof Blob); // true
  //   console.log(`originalFile size ${object.size / 1024 / 1024} MB`);
  //   setShowImage(URL.createObjectURL(object));
  //   setImage(object);

  //   const options = {
  //     maxSizeMB: 1,
  //     maxWidthOrHeight: 720,
  //     useWebWorker: false,
  //     fileType: 'png'
  //   };

  //   if (object) {
  //     try {
  //       let compressedImage = await imageCompression(object, options);
  //       setShowImage(URL.createObjectURL(compressedImage));
  //       setImage(compressedImage);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   } else {
  //     console.log("object is null");
  //   }
  // };

  const GenerateOne = () => {
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state === "denied") {
        return notify("please allow location access");
      }

      if (title.replace(/ /g, "").length < 10 || !title) {
        notify("Enter title to generate an Image");
      } else {
        setGenerating(true);
        fetch("/generateimage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken, // Add CSRF token to headers
          },
          body: JSON.stringify({
            prompt: title,
          }),
        })
          .then((res) => res.json())
          .then((result) => {
            console.log(result);
            setShowImage(result.data);
            setImage(result.data);
            setGenerating(false);
          });
      }
    });
  };

  return (
    <>
      <LoadingBar
        color={"red"}
        height={3}
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="row container-fluid mx-auto">
        <div className="col-lg-6 col-md-5 m-auto my-5">
          <h4 className="text-uppercase fw-bold">Create post</h4>
          <div className="m-4 text-center position-relative">
            <Image
              fluid
              className="w-40 imgMob imgTab shadow-sm"
              style={{ height: "9rem" }}
              role="button"
              rounded
              src={showImage}
              onClick={handleImageClick}
              alt="addImage"
            />

            <span
              onClick={handleImageClick}
              className="position-absolute top-0 start-70 translate-middle badge rounded-pill bg-primary"
              role="button"
            >
              <i className="fa-solid fa-plus" />
            </span>
            <Form.Control
              ref={fileInputRef}
              onChange={SelectImage}
              type="file"
              accept="image/png, image/jpeg"
              className="visually-hidden"
            />
          </div>
          <div
            className="d-inline-block w-25 position-relative "
            style={{ borderTop: "1.5px solid rgba(34,34,34,.4)", left: "20%" }}
          ></div>
          <div
            className="position-relative d-inline-block text-center"
            style={{ left: "24%", verticalAlign: "sub" }}
          >
            OR
          </div>
          <div
            className="d-inline-block w-25 position-relative "
            style={{ borderTop: "1.5px solid rgba(34,34,34,.4)", left: "28%" }}
          ></div>

          <div className="d-flex flex-wrap align-content-center my-1 flex-column justify-content-center">
            <Button
              onClick={GenerateOne}
              className=" px-4 py-2 btn-sm bg-body  my-3"
              variant="warning "
            >
              <i
                className={`fa-solid fa-arrows-spin me-2 ${
                  generating ? "rotate" : ""
                }`}
              ></i>
              Generate Image
            </Button>
          </div>

          <FloatingLabel
            className="my-3"
            controlId="floatingInputGrid"
            label="Title"
          >
            <Form.Control
              maxLength={50}
              value={title}
              onBlur={validateInput}
              onChange={onInputChange}
              name="title"
              type="text"
              placeholder="Title"
            />

            {title === "" ? (
              <Form.Text className="text-muted d-block">
                Eg: 3D volcano model
              </Form.Text>
            ) : (
              <Form.Control.Feedback type="invalid">
                Minimum character length must be 10
              </Form.Control.Feedback>
            )}

            {title.replace(/ /g, "").length >= 10 ? (
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            ) : (
              ""
            )}

            <div className="text-end me-2 font-monospace ">
              {title.replace(/ /g, "").length + "/50"}
            </div>
          </FloatingLabel>

          <textarea
            label="Explain a little about the project"
            value={body}
            onBlur={validateInput}
            onChange={onInputChange}
            name="body"
            placeholder="Explain a little about the project"
            rows={4}
            className="form-control"
          ></textarea>
          {body === "" ? (
            <Form.Text className="text-muted d-block">
              Eg: Working 3D model
            </Form.Text>
          ) : (
            <Form.Control.Feedback type="invalid">
              Minimum character length must be 10
            </Form.Control.Feedback>
          )}

          {body.replace(/ /g, "").length >= 10 ? (
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          ) : (
            ""
          )}

          <div className="text-end me-2 font-monospace">
            {body.replace(/ /g, "").length + "/80"}
          </div>

          <div className="par d-inline-block mt-4">
            <Form.Label>Subject</Form.Label>
          </div>

          <Form.Select
            name="subject"
            value={subject}
            onBlur={validateInput}
            onChange={onInputChange}
          >
            <option defaultChecked disabled value={""}>
              Select
            </option>
            <option value={"English"}>English</option>
            <option value={"Science"}>Science</option>
            <option value={"Hindi"}>Hindi</option>
            <option value={"Maths"}>Maths</option>
            <option value={"Social Studies"}>Social Studies</option>
            <option value={"Political Science"}>Political Science</option>
            <option value={"Economics"}>Economics</option>
            <option value={"Sociology"}>Sociology</option>
          </Form.Select>

          <div className="d-flex justify-content-between">
            <div style={{ width: "45%" }} className="par d-inline-block mt-4">
              <Form.Label>Deadline</Form.Label>
              {/* <DatePicker dateFormat="dd/MM/yyyy" minDate={today} selected={startDate} onChange={(date) => setStartDate(date)} /> */}
            </div>
            <div style={{ width: "45%" }} className="par d-inline-block mt-4">
              <Form.Label>Price</Form.Label>
            </div>
          </div>

          <div className="par d-flex justify-content-between">
            <DatePicker
              name="Deadline"
              className="w-100 form-control"
              dateFormat="dd/MM/yyyy"
              minDate={today}
              selected={deadLine}
              onChange={(date) => setDeadLine(date)}
            />
            {/* </div> */}

            <CurrencyInput
              prefix="₹"
              id="input-example"
              name="price"
              placeholder="₹"
              value={price}
              className=" form-control "
              style={{ width: "45%" }}
              defaultValue={""}
              decimalsLimit={2}
              onValueChange={(value, name) => {
                setInput((prevInput) => ({
                  ...prevInput,
                  price: value,
                }));
              }}
              onChange={validateInput}
              onBlur={validateInput}
            />
          </div>

          {/*         
        <Form.Group controlId="formFile" className="my-3">
          <Form.Label>Upload image/</Form.Label>
          <Moodal query={title} BtnTitle={"Generate Image"} />

          <Form.Control onChange={(e) => setImage(e.target.files[0])} type="file" accept='image/png, image/jpeg' />
          {image === ""?console.log("mt"):console.log("2rlu")}
        </Form.Group> */}

          <div className="text-center mt-4">
            <Button
              onClick={sendToDb}
              style={{ backgroundColor: "#5271fd" }}
              className="btn px-4 py-2 border-0"
            >
              Post
            </Button>
            <ToastContainer />
          </div>
        </div>
      </div>
    </>
  );
}

export default CreatePost;
