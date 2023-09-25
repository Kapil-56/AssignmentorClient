import { useContext, useEffect } from "react";
import {
  Navbar,
  Image,
  Dropdown,
  Form,
  Button,
  Container,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../App";

import Alogo from "../Images/Alogo2.png";

import { useCookies } from "react-cookie";
import Cookies from "js-cookie";
import avatar from "../Images/avatar.jpg";
// import { BiMessageSquareDots } from 'react-icons/bi';
// import { TbCurrentLocation } from 'react-icons/tb';
// import { MdPostAdd } from 'react-icons/md';
import { useState } from "react";
import Moodal from "./Moodal";
import { escapeRegExp } from "lodash"; // Import escapeRegExp from lodash

function Header() {
  const [cookies, setCookie] = useCookies(["user"]);
  const navigate = useNavigate();
  const location = useLocation();

  const { state, dispatch } = useContext(UserContext);
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [expand, setExpand] = useState(false);

  const renderList = () => {
    if (state) {
      console.log("statehai");
      return [];
    } else {
      console.log("nahihai");
      return [
        // <NavLink className='nav-link' to={state ? '/' : 'login'}>Login</NavLink>,
        // <NavLink className='nav-link' to={'/signup'}>Signup</NavLink>
      ];
    }
  };

  useEffect(() => {
    // Create a variable to hold the timer ID
    let timerId;

    const debounceFetch = () => {
      clearTimeout(timerId); // Clear the previous timer
      timerId = setTimeout(fetchSearchResults, 300); // Set a new timer
    };

    const fetchSearchResults = async () => {
      if (searchValue.length >= 1) {
        const escapedSearchValue = encodeURIComponent(
          searchValue.replace(/\./g, "%2E")
        );
        setIsLoading(true);
        try {
          console.log("searching for ", searchValue);
          const response = await fetch(
            `/search?query=${encodeURIComponent(searchValue)}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();
          setSearchResult(data);
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoading(false); // Update loading state
        }

        // Remove the fetchSearchResults() call from here
      } else {
        setSearchResult(null);
      }
    };
    debounceFetch(); // Initial call to debounceFetch()

    // Clean up the timer when the component unmounts or when searchValue changes
    return () => clearTimeout(timerId);
  }, [searchValue]);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const getSearchResult = async (e) => {
    const inputValue = e.target.value; // Store the input value in a variable
    setSearchValue(inputValue); // Update the stat
  };

  document.body.addEventListener("click", (e) => {
    let searchDiv = document.querySelector(".search-bar");
    if (searchDiv) {
      if (!searchDiv.contains(e.target)) {
        setExpand(false);
      }
    }

    // if (!e.target.className.includes("search-bar")) {
    //   return setExpand(false);
    // }
  });

  return (
    <Navbar
      variant=""
      data-bs-theme="dark"
      expand="md"
      // make the navbar sticky if user is logged in
      // className={`bg-body ${state?.email? ' position-sticky top-0': ''}`}
      className={`bg-body py-3 ${state?.email ? "sticky-top" : ""}`}
      style={{ zIndex: 99 }}
    >
      <div className="container-fluid gap-3">
        <div className="d-flex">
          <Navbar.Brand className="ms-3 for-mob-nav">
            <Link className="nav-link text-primary" to={"/"}>
              <picture>
                <source
                  srcSet={`${Alogo} 15000w`}
                  sizes="(max-width: 600px) 480px, (max-width: 900px) 768px, 1200px"
                />
                <Image
                  draggable={false}
                  fluid
                  height={"auto"}
                  alt="logo"
                  src={Alogo}
                />
              </picture>

              <span
                style={{ fontSize: ".5rem", color: "#6f89fd" }}
                className="fw-bolder"
              >
                BETA
              </span>
            </Link>
          </Navbar.Brand>
          <Moodal show={true} />
        </div>

        {location.pathname === "/chat" || state == null ? null : (
          <div
            className="w-50  order-last on-mob-width
          order-md-0 
          "
          >
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder={"Find the help you need"}
                className=" border-end-0  rounded-start search-bar"
                aria-label="Search"
                value={searchValue}
                onChange={getSearchResult}
                onClick={() => {
                  setExpand(true);
                }}
                style={{ borderRadius: "8px 0px 0px 8px" }}
              />
              <Button
                variant="dark border-start-0 rounded-end px-3 "
                style={{ borderRadius: "0px 8px 8px 0px" }}
              >
                {/* //search icon */}
                <svg
                  viewBox="0 0 24 24"
                  width={"1em"}
                  height={"1em"}
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
                      d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                      stroke="#ffffff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>{" "}
                  </g>
                </svg>
              </Button>
            </Form>
            {expand && (
              <div
                className="position-absolute bg-white shadow-sm rounded-3 mob-full-screen-res border p-3"
                style={{
                  width: "49%",
                  zIndex: "100",
                  top: "100%",
                  // left: "0",
                }}
              >
                {searchResult !== null && !isLoading ? (
                  searchResult.length >= 1 ? (
                    searchResult.map((item) => {
                      // Find the index of the searchValue in title
                      const titleIndex = item.title
                        .toLowerCase()
                        .indexOf(searchValue.toLowerCase());

                      // Highlight matching text within title
                      const highlightedTitle =
                        titleIndex !== -1 ? (
                          <>
                            {item.title.substring(0, titleIndex)}
                            {/* add highlighted-text to make yellow bg */}
                            <span className="fw-bold">
                              {item.title.substring(
                                titleIndex,
                                titleIndex + searchValue.length
                              )}
                            </span>
                            {item.title.substring(
                              titleIndex + searchValue.length
                            )}
                          </>
                        ) : (
                          item.title
                        );

                      // Highlight matching text within subject
                      // const subjectIndex = item.subject.toLowerCase().indexOf(searchValue.toLowerCase());

                      // const highlightedSubject =
                      //   subjectIndex !== -1 ? (
                      //     <>
                      //       {item.subject.substring(0, subjectIndex)}
                      //       <span className="highlighted-text">
                      //         {item.subject.substring(subjectIndex, subjectIndex + searchValue.length)}
                      //       </span>
                      //       {item.subject.substring(subjectIndex + searchValue.length)}
                      //     </>
                      //   ) : (
                      //     item.subject
                      //   );

                      return (
                        <div
                          key={item._id}
                          onClick={() => {
                            navigate(`/posts/${item._id}`);
                            setSearchValue("");
                            setExpand(false);
                          }}
                          className="search-result rounded d-flex justify-content-between align-items-center text-decoration-none p-3 border-bottom"
                          style={{ cursor: "pointer" }}
                        >
                          <div className="d-flex align-items-center gap-3">
                            <div className="d-flex align-items-center justify-content-center">
                              <Image
                                src={item.photo}
                                alt="profile"
                                roundedCircle
                                style={{ width: "40px", height: "40px" }}
                              />
                            </div>
                            <div className="d-flex flex-column">
                              <div className="fw-light text-dark">
                                {highlightedTitle}
                              </div>
                            </div>
                          </div>
                          <div className="subject px-2">
                            <span className="text-muted">{item.subject}</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-dark">No result to display</div>
                  )
                ) : // <div className="text-dark">No result to display</div>
                isLoading ? (
                  <div className="text-dark">Loading...</div>
                ) : (
                  <div className="wrapper">
                    <div className="d-flex gap-3 align-items-center">
                      <img
                        width="30"
                        height="30"
                        src="https://img.icons8.com/pastel-glyph/150/chart-arrow-rise.png"
                        alt="chart-arrow-rise"
                      />
                      <div className="visually-hidden">
                        <a href="https://icons8.com/icon/tJS2vK4H9r0u/chart-arrow-rise"></a>{" "}
                        icon by <a href="https://icons8.com">Icons8</a>
                      </div>
                      <div className="fw-bold fs-6">Near You</div>
                    </div>
                    <Container className="d-flex flex-row gap-3 flex-wrap mt-3">
                      <div className="span bg-secondary rounded-4 fs-6 text-muted px-3 py-2">
                        english
                      </div>
                    </Container>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="d-flex flex-row ustify-content-end align-items-center gap-2">
          {/* <a className='text-decoration-none text-dark for-mob' aria-label='Chat with us' href='/chat'>
            <BiMessageSquareDots className='fs-2' />
          </a> */}
          {state ? (
            <div className="d-flex align-items-center gap-3">
              <Link
                className="text-decoration-none text-dark "
                aria-label="Chat with us"
                to={"/chat"}
              >
                {/* <BiMessageSquareDots className='fs-2' /> */}
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth={"0"}
                  viewBox="0 0 24 24"
                  className="fs-2"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16 2H8C4.691 2 2 4.691 2 8v12a1 1 0 0 0 1 1h13c3.309 0 6-2.691 6-6V8c0-3.309-2.691-6-6-6zm4 13c0 2.206-1.794 4-4 4H4V8c0-2.206 1.794-4 4-4h8c2.206 0 4 1.794 4 4v7z"></path>
                  <circle cx="9.5" cy="11.5" r="1.5"></circle>
                  <circle cx="14.5" cy="11.5" r="1.5"></circle>
                </svg>
              </Link>
              <Link
                className="text-decoration-none text-dark "
                aria-label="Create a post"
                to={"/createpost"}
              >
                {/* <MdPostAdd className='fs-2' /> */}
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth={"0"}
                  viewBox="0 0 24 24"
                  className="fs-2"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path fill="none" d="M0 0h24v24H0z"></path>

                  <path d="M17 19.22H5V7h7V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-7h-2v7.22z"></path>

                  <path d="M19 2h-2v3h-3c.01.01 0 2 0 2h3v2.99c.01.01 2 0 2 0V7h3V5h-3V2zM7 9h8v2H7zM7 12v2h8v-2h-3zM7 15h8v2H7z"></path>
                </svg>
              </Link>
              <Image
                onClick={handleDropdownToggle}
                fluid
                alt="avatar"
                style={{ width: "2rem" }}
                className="for-mobf"
                src={
                  state?.avatar
                    ? `data:image/svg+xml;base64,${state?.avatar}`
                    : avatar
                }
              ></Image>
              <Dropdown
                autoClose={true}
                id="dropdown-button-drop-start"
                drop="start"
                show={dropdownOpen}
                onToggle={handleDropdownToggle}
              >
                <Dropdown.Menu
                  variant="dark"
                  data-bs-theme="dark"
                  style={{ marginTop: "25px", right: "25px" }}
                >
                  <Dropdown.Item onClick={() => navigate("/profile")}>
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate("/favourites")}>
                    {" "}
                    Favourites
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      Cookies.remove("jwt");
                      localStorage.clear();
                      dispatch({ type: "CLEAR" });
                      navigate("/");
                      window.location.reload();
                    }}
                  >
                    Logout{" "}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          ) : (
            <div className="d-flex gap-4 align-items-center for-mob-font">
              <Link
                className="text-dark text-decoration-none fw-bold"
                to={"/signup"}
              >
                Signup
              </Link>
              <Link
                className=" text-decoration-none rounded px-3 py-1 fw-bold hover-change"
                style={{ border: "1px solid #5271fd" }}
                to={"/login"}
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </Navbar>
  );
}

export default Header;
