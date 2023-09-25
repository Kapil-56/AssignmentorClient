import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HomeCard from "./HomeCard";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Placeholder,
  Row,
  Spinner,
} from "react-bootstrap";
import HomeCardSkeleton from "./HomeCardSkeleton";

function FindBySubject() {
  const [posts, setPosts] = useState(null);
  const Subject = useParams();
  const [loading, setLoading] = useState(false);
  const [likedloading, setLikedLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [totalPosts, setTotalPosts] = useState(null);
  const [currentPosts, setCurrentPosts] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(8);
  const [btnHide, setBtnHide] = useState(null);
  const DropdownRef = useRef(null);

  // const [sort, setSort] = useState("createdAt");
  // const sortOptions = ["createdAt", "price", "likes"];

  //create a key and value pair for each sort option
  const sortOptions = [
    { key: "likes", sortotp: "likes", value: "Likes" },
    { key: "deadline", sortotp: "deadline", value: "Deadline" },
    { key: "createdAt", sortotp: "createdAt", value: "Date Published" },
    { key: "priceH2L", sortotp: "price", value: "Price: High to Low" },
    { key: "priceL2H", sortotp: "price", value: "Price: Low to High" },
  ];

  const [sort, setSort] = useState(sortOptions[2]);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchLikedIds() {
      try {
        setLikedLoading(true);

        const response = await fetch("/myliked", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch likedIds");
        }

        const likedIds = await response.json();
        setLiked(likedIds);
        setLikedLoading(false);

        console.log(likedIds);
        // if (likedIds.includes(props.id)) {
        //   setLiked(true);
        // }
      } catch (error) {
        console.error("Error fetching likedIds:", error);
      }
    }

    fetchLikedIds();
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        try {
          const response = await fetch(
            `https://assignmentorbackend.onrender.com/allpost?subject=${
              Subject.subject
            }&page=${currentPage}&per_page=${perPage}&sortBy=${
              sort.sortotp
            }&sortOrder=${
              sort.value === "Price: Low to High" || sort.value === "Deadline"
                ? "asc"
                : ""
            }`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch posts");
          }
          const data = await response.json();
          console.log(data, "data");
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setCurrentPosts(data.posts.length);

          if (data.totalPages === currentPage || data.totalPosts === 0) {
            // setCurrentPage(currentPage+1)
            setBtnHide(true);
          } else {
            setBtnHide(false);
          }

          setLoading(false);
        } catch (err) {
          console.log(err);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }

    fetchPosts();
  }, [sort]);

  const handleDropdownClick = () => {
    DropdownRef.current.click();
  };

  return (
    <>
      <Container fluid>
        <div className="breadcrumbContainer">
          <Breadcrumb className="text-muted text-decoration-none">
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
            <Breadcrumb.Item className="text-muted text-decoration-none" active>
              {Subject.subject}
            </Breadcrumb.Item>
            {/* <Breadcrumb.Item className="text-muted text-decoration-none" onClick={()=>{  navigate('/')}}>{address}</Breadcrumb.Item> */}
            {/* <Breadcrumb.Item active>{title}</Breadcrumb.Item> */}
          </Breadcrumb>
        </div>
        <div>
          <div className="d-flex justify-content-between align-items-center">
            <div className="results">
              <h4 className="text-dark fw-bold my-0 d-inline">
                {Subject.subject}
              </h4>
              <span className="text-muted fs-6 mob-font">
                {" "}
                (showing {currentPosts} of {totalPosts} results)
              </span>
            </div>
            <div className="sort text-dark fw-bold text-nowrap">
              sort by
              <span
                role="button"
                onClick={handleDropdownClick}
                id="dropdown-basic"
                className="text-primary mob-font fw-light dropdown-toggle for-mob-sort"
                style={{
                  cursor: "pointer",
                  width: "155px",
                  display: "inline-block",
                }}
              >
                {" "}
                : {sort.value}
              </span>
              <Dropdown drop="down">
                <Dropdown.Toggle
                  variant="success"
                  ref={DropdownRef}
                  className="visually-hidden"
                  id="dropdown-basic"
                >
                  Dropdown Button
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {sortOptions.map((item) => {
                    return (
                      <Dropdown.Item
                        key={item.key}
                        //if it is selected then add set background color to blue
                        style={{
                          backgroundColor:
                            item.value === sort.value ? "#e9ecef" : "",
                        }}
                        // className="text-dark"

                        onClick={() => {
                          setSort(item);
                        }}
                      >
                        {item.value}
                      </Dropdown.Item>
                    );
                  })}

                  {/* <Dropdown.Item className="">Price : low to high</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">
                   Price : high to low
                  </Dropdown.Item>
                  <Dropdown.Item href="#/action-3">
                    Date Published 
                  </Dropdown.Item> */}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <Row style={{ minHeight: "450px" }} className="mb-4">
            {posts?.length === 0 && (
              <div className="d-flex justify-content-center align-items-center flex-column">
                <h4 className="text-muted">No posts found</h4>
                <h6 className="text-muted">Try changing the sort option</h6>
              </div>
            )}
            {loading && likedloading ? (
              <div className="row" style={{ backgroundColor: "#fafafa" }}>
                <HomeCardSkeleton />
              </div>
            ) : (
              posts &&
              likedloading === false &&
              liked &&
              posts.map((item) => {
                return (
                  <HomeCard
                    key={item._id}
                    abc={liked.includes(item._id)}
                    data={item}
                    address={item.address}
                    avatar={item.postedBy.avatar}
                    deadline={item.deadline}
                    name={item.postedBy.name}
                    price={item.price}
                    subject={item.subject}
                    id={item._id}
                    // lg={3}
                    likes={item.likes}
                    photo={item.photo}
                    title={item.title}
                    body={item.body}
                  />
                );
              })
            )}
          </Row>
          {/* </Col> */}
          {/* </Row> */}
          <Button
            variant="none"
            className={`btn btn-dark d-flex justify-content-center align-items-center mx-auto my-4 px-4 py-2 mx-auto ${
              btnHide ? "d-none" : ""
            }`}
            onClick={() => {
              setPerPage(perPage + 8);
              fetch(
                `https://assignmentorbackend.onrender.com/allpost?subject=${Subject.subject}&per_page=${
                  perPage + 8
                }&sortBy=${sort.sortotp}&sortOrder=${
                  sort.value === "Price: Low to High" ? "asc" : ""
                }`
              )
                .then((res) => res.json())
                .then((data) => {
                  console.log(data, "clicked");
                  setPosts(data.posts);
                  setCurrentPosts(data.posts.length);
                  console.log(data.posts.length, "current posts");

                  if (data.totalPages === currentPage) {
                    // setCurrentPage(currentPage+1)
                    setBtnHide(true);
                  }
                });
            }}
          >
            Load More
            {"   >"}
          </Button>
        </div>
      </Container>
    </>
  );
}

export default FindBySubject;
