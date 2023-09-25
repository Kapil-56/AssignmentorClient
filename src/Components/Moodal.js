import { useState, useReducer } from "react";
import { Form, Image, Navbar } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { IoMdArrowDropdown } from "react-icons/io";
import { CiGps } from "react-icons/ci";
import { useEffect } from "react";
import { locationReducer, initialState } from "../Reducers/UserLocation";

import logoMob from "../Images/logoMob.png";

function MyVerticallyCenteredModal(props) {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const UserLocation = localStorage.getItem("location");

  const locationIqAPI = process.env.REACT_APP_LOCATION_IQ_API;
  const GeoapifyKey = process.env.REACT_APP_GEOAPIFY_KEY;

  function throttle(func, limit) {
    let lastFunc;
    let lastRan;

    return function executedFunction(...args) {
      const context = this;

      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function () {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }
  const [results, setResults] = useState([]);

  function handleInputChange(event) {
    const query = event.target.value;
    const endpoint = `https://api.locationiq.com/v1/autocomplete?key=${locationIqAPI}&q=${query}&limit=5&dedupe=1&countrycodes=IN`;

    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        setResults(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const throttledHandleInputChange = throttle(handleInputChange, 500);

  useEffect(() => {
    // var requestOptions = {
    //   method: 'GET',
    // };
    try {
      if (location && location.latitude && location.longitude) {
        fetch(
          `https://api.geoapify.com/v1/geocode/reverse?lat=${location.latitude}&lon=${location.longitude}&apiKey=${GeoapifyKey}}`
        )
          .then((response) => response.json())
          .then(
            (result) =>
              props.onAddressChange(
                result["features"][0]["properties"]["formatted"]
              ),
            props.onHide(true)
          )
          .catch((error) => console.log("error", error));
      }
    } catch (error) {
      console.log(error);
    }
  }, [location]);

  const successHandler = (position) => {
    alert("start");
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
          alert("denied");
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

  useEffect(() => {
    const successHandler = (position) => {
      if (!UserLocation) {
        console.log("fetching location");
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      }
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

  const Detect = () => {
    alert("detect clicked");
    navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
  };
  const addSet = (result) => {
    const userAddress = result.display_name;
    props.onAddressChange(userAddress);
    props.onHide(true);
  };

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter" className="m-auto">
          Your location
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* <Image fluid src=''></Image> */}
        {/* <Modal.Title>
                    Enter location
                </Modal.Title> */}
        <div>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              onChange={throttledHandleInputChange}
            />
            <Button
              variant="outline-success d-flex  align-items-center gap-1"
              onClick={Detect}
            >
              <CiGps />
              Detect
            </Button>
          </Form>
          {results.length > 0 && (
            <ul>
              {results.map((result) => (
                <li
                  style={{ cursor: "pointer" }}
                  onClick={() => addSet(result)}
                  key={result.place_id}
                >
                  {result.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal.Body>
      {/* <Modal.Footer className='d-flex justify-content-center'>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer> */}
    </Modal>
  );
}

function Moodal(props) {
  const [state, dispatch] = useReducer(locationReducer, initialState);
  const [modalShow, setModalShow] = useState(false);
  const navigate = useNavigate();
  const UserLocation = localStorage.getItem("location");
  const [address, setAddress] = useState(
    UserLocation ? UserLocation : "Set location"
  ); // Define the `address` state
  const handleAddressChange = (address) => {
    if (props.editLocation) {
      props.editLocation(address);
    } else {
      setAddress(address);
      //if props.editLocation is present then run the function passed in props and pass the address as argument to it
      dispatch({ type: "SET_ADDRESS", payload: address });
      localStorage.setItem("location", address);
    }
  };

  const limit = (string, length, end = "...") => {
    return string.length < length ? string : string.substring(0, length) + end;
  };

  const Goto = (e) => {
    e.stopPropagation();
    navigate("/");
  };

  return (
    <>
      {/* <Link onClick={() => setModalShow(true)}>{props.BtnTitle}</Link> */}
      <Navbar.Text
        className={`for-mob-font ${
          props.show ? "" : "btn-primary btn px-2 py-2 text-light ps-3 border-0"
        }`}
        style={{ cursor: "pointer" }}
        onClick={() => setModalShow(true)}
      >
        <Image
          onClick={Goto}
          className={`mx-2 d-none for-mob-log`}
          width={"25px"}
          src={logoMob}
        ></Image>
       
        {props.show
          ? limit(address, 20)
          : props.isLocationThere
          ? "Change Location"
          : "Add location"}
        {/* {limit(address, 20)} */}

        {/* <IoMdArrowDropdown /> */}
        {props.img ? (
          <svg
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            className="ms-1"
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
                d="M19 12C19 15.866 15.866 19 12 19M19 12C19 8.13401 15.866 5 12 5M19 12H21M12 19C8.13401 19 5 15.866 5 12M12 19V21M5 12C5 8.13401 8.13401 5 12 5M5 12H3M12 5V3M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                stroke="#ffffff"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>{" "}
            </g>
          </svg>
        ) : (
          <IoMdArrowDropdown />
        )}
      </Navbar.Text>
      <MyVerticallyCenteredModal
        show={modalShow}
        // img={props.img}
        onHide={() => setModalShow(false)}
        onAddressChange={handleAddressChange} // Pass the callback function to `MyVerticallyCenteredModal`
      />
    </>
  );
}

export default Moodal;
