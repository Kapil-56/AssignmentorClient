import { useEffect, useState, useContext, useRef } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Image,
  Row,
  Spinner,
} from "react-bootstrap";
import HomeCard from "./HomeCard";
import InfiniteScroll from "react-infinite-scroller";
import HeroSection from "./HeroSection";
import { UserContext } from "../App";
import { useMemo } from "react";
import BelowHero from "./BelowHero";
import ThirdSection from "./ThirdSection";
import Science from "../Images/Science.png";
import Economics from "../Images/Science.png";
import English from "../Images/English.jpg";
import PoliticalScienceImage from "../Images/English.jpg";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { debounce } from "lodash";
import calenderIcon from "../Images/calenderIcon.svg";
import HomeCardSkeleton from "./HomeCardSkeleton";

function Home({ tabTitle }) {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const subjectImageMap = {
    //add url of images here
    science: "https://img.icons8.com/cotton/200/optical-microscope--v1.png",
    Economics: "https://img.icons8.com/cotton/200/positive-dynamic--v1.png",
    English: "https://img.icons8.com/cotton/200/abc.png",
    maths: "https://img.icons8.com/cotton/200/000000/trigonometry--v1.png",
    "computer Science": "https://img.icons8.com/cotton/200/laptop-coding.png",
    geography: "https://img.icons8.com/cotton/200/000000/earth-planet--v1.png",
    "Social Studies": "https://img.icons8.com/cotton/200/crowd--v1.png",
    Hindi: "https://img.icons8.com/ios/150/h.png",
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(8);
  const [hasMoreData, setHasMoreData] = useState(null);
  const [totalPosts, setTotalPosts] = useState(8);
  const [isLogged, setIsLogged] = useState(null);
  const [liked, setLiked] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [likedLoading, setLikedLoading] = useState(false);
  const navigate = useNavigate();

  const sliderRef = useRef(null); // Create a ref for the Slider component

  const settings = {
    infinite: true,
    autoplay: false,
    autoplaySpeed: 3000,
    speed: 500,
    slidesToShow: 2.5, // Show 3 cards at a time
    slidesToScroll: 1,
    initialSlide: 0,
    dots: true,
    arrows: false,
    adaptiveHeight: true,
    scrollable: true,
    mobileFirst: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleNextSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext(); // Slide to the next card
    }
  };

  const handlePrevSlide = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev(); // Slide to the previous card
    }
  };

  // const [myLiked, setMyLiked] = useState()

  useEffect(() => {
    document.title = tabTitle;
  }, []);

  useEffect(() => {
    setLoading(true);
    //create a fetch request to get all the subjects
    fetch("https://assignmentorbackend.onrender.com/subjects", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        // console.log(res);
        return res.json();
      })
      .then((result) => {
        setLoading(false);
        setSubjects(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (state) {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, [state]);

  useEffect(() => {
    updateAds();
  }, []);

  const updateAds = () => {
    setHasMoreData(true);
    fetch(
      `https://assignmentorbackend.onrender.com/allpost?page=${currentPage}&per_page=${perPage}&sortBy=createdAt
    `,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((result) => {
        setTotalPosts(result.totalPosts);
        setData(result.posts);
      });
  };

  const LoadMore = () => {
    fetch(
      `https://assignmentorbackend.onrender.com/allpost?page=${currentPage}&per_page=${perPage}&sortBy=createdAt
    `,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((result) => {
        setData(result.posts);
        console.log(result.posts);
        if (totalPosts >= perPage) {
          // console.log({ totalPosts, perPage });
          setPerPage(perPage + 12);
        } else {
          setHasMoreData(false);
        }
      });
  };
  const memoizedData = useMemo(() => data, [data]);

  useEffect(() => {
    if (isLogged) {
      // setIsLogged(true);
      setLikedLoading(true);

      fetch("/myliked", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((likedIds) => {
          setLiked(likedIds);
          console.log(likedIds);
          setLikedLoading(false);
          // if (likedIds.includes(props.id)) {
          //   setLiked(true)
          // }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [memoizedData]);

  const handleGesture = debounce((event) => {
    const delta = event.deltaX;

    if (delta > 0) {
      // Slide left gesture, move to previous slide
      sliderRef.current.slickNext();
    } else if (delta < 0) {
      // Slide right gesture, move to next slide
      sliderRef.current.slickPrev();
    }
  }, 200);

  const CapitalizeFirstletter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const [greet, setGreet] = useState("");

  //create an array of greetings
  const greetings = [
    "Hello",
    "Hi",
    "Hey",
    "Howdy",
    "Hola",
    "Bonjour",
    "Namaste",
    "Salaam",
    "Ciao",
    "Konnichiwa",
  ];

  useEffect(() => {
    //get a random greeting from the array
    const randomGreet = greetings[Math.floor(Math.random() * greetings.length)];
    setGreet(randomGreet);
  }, []);

  return (
    <>
      {!isLogged ? (
        <Container fluid className="fw-bolder">
          <HeroSection />
          {/* <BelowHero /> */}
          <ThirdSection />

          <p className="fs-4 mt-4 my-0">
            Explore by <span className="text-primary">Subjects!</span>
          </p>
          <div className="row container-fluid my-2 ">
            {loading && (
              <div className="text-center">
                <Spinner
                  variant="warning"
                  size="lg"
                  animation="border"
                  role="status"
                  style={{ width: "4rem", height: "4rem" }}
                />
              </div>
            )}
            {subjects.slice(0, 8).map((subject) => {
              return (
                <div
                  key={subject._id}
                  className="parent col-md-3 p-3 col-6 d-flex flex-column "
                >
                  <div className="wrapper d-flex flex-column">
                    <Link
                      //display login to view the content modal if not logged in
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/login");
                      }}
                      className="Link d-flex flex-column align-items-center gap-3 text-decoration-none text-dark text-nowrap m-auto p-2"
                    >
                      <img
                        width="64"
                        height="64"
                        //change src based on subject

                        src={subjectImageMap[subject._id]}
                        alt="icon"
                      />
                      <span className="bTop"></span>
                      <span>
                        {subject._id === "Political Science"
                          ? "Politics"
                          : subject._id}
                      </span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      ) : null}

      {isLogged ? (
        <Container fluid className="fw-bolder underSearch">
          <div className="intro-logged">
            <div className="fs-1 fw-bold my-4">
              {greet},{" "}
              <span className="text-primary">
                {CapitalizeFirstletter(state.name)}
              </span>
            </div>
            <div className="border  rounded-3 p-4">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-4">
                <div className="d-flex align-items-center flex-wrap gap-3">
                  <Image
                    src={calenderIcon}
                    height={30}
                    width={30}
                    alt="calenderIcon"
                    className=""
                  ></Image>
                  <div className="d-flex flex-column">
                    <span className="fs-5 fw-bold">
                      Get proposals from the nearby experts
                    </span>
                    <span className="fs-6 text-muted fw-light">
                      Simply create a project brief and let us do the searching
                      for you.
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => navigate("/createpost")}
                  variant="primary"
                >
                  Find a helper
                </Button>
              </div>
            </div>
          </div>
          <div className="subjects my-3">
            <div className="fs-4 mt-4">
              Explore by <span className="text-primary">subjects!</span>
            </div>
            {/* <div
              className="d-flex justify-content-between position-relative"
              style={{ top: "4rem" }}
            >
              <div
                className="prev-icon bg-warning px-2 rounded-circle fs-6"
                onClick={handlePrevSlide}
                style={{ cursor: "pointer", zIndex: "1" }}
              >
                {"<"}
              </div>
              <div
                className="next-icon bg-warning px-2 rounded-circle fs-6"
                onClick={handleNextSlide}
                style={{ cursor: "pointer", zIndex: "1" }}
              >
                {">"}
              </div>
            </div> */}
            <div className="row container-fluid my-2 ">
              {loading && (
                <div className="text-center">
                  <Spinner
                    variant="warning"
                    size="lg"
                    animation="border"
                    role="status"
                    style={{ width: "4rem", height: "4rem" }}
                  />
                </div>
              )}
              {/* <div onWheel={handleGesture}>
                <Slider {...settings} ref={sliderRef}>
                  {subjects.map((subject) => {
                    return (
                      <div
                        key={subject._id}
                        className="col-lg-5 col-md-4 col-xxl-3 col-6 "
                      >
                        <Link
                          to={`/category/${subject._id}`}
                          className="text-decoration-none text-dark"
                        >
                          <Card
                            className="border-0 shadow-sm  cardHome"
                            style={{
                              backgroundImage: `url(${
                                subjectImageMap[subject._id]
                              })`,
                              backgroundPosition: "center",
                              backgroundSize: "cover",
                              backgroundRepeat: "no-repeat",
                              opacity: "0.8",
                      
                            }}
                          >
                            <Card.Body>
                              <Card.Title className="text-center my-2 ">
                                <div className="fs-3 fw-bold filter text-dark">
                                  {" "}
                                  {subject._id === "Political Science"
                                    ? "Politics"
                                    : subject._id}
                                </div>
                              </Card.Title>
                            </Card.Body>
                          </Card>
                        </Link>
                      </div>
                    );
                  })}
                </Slider>
              </div> */}
              {subjects.slice(0, 8).map((subject) => {
                return (
                  <div
                    key={subject._id}
                    className="parent col-md-3 p-3 col-6 d-flex flex-column "
                  >
                    <div className="wrapper d-flex flex-column">
                      <Link
                        to={`/category/${subject._id}`}
                        className="Link d-flex flex-column align-items-center gap-3 text-decoration-none text-dark text-nowrap m-auto"
                      >
                        <img
                          width="64"
                          height="64"
                          //change src based on subject

                          src={subjectImageMap[subject._id]}
                          alt="icon"
                        />
                        <span className="bTop"></span>
                        <span>
                          {subject._id === "Political Science"
                            ? "Politics"
                            : subject._id}
                        </span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="Feed py-3">
            <h4 className=" fw-bold">Near You </h4>
            <InfiniteScroll
              pageStart={currentPage}
              loadMore={LoadMore}
              hasMore={hasMoreData}
              initialLoad={false}
              threshold={
                //make the threshold 100px less than the height of the window
                window.innerHeight * 0.5
              }
              loader={
                //create a skeleton loader in row
                <div
                  key={Math.random()}
                  className=""
                  style={{ backgroundColor: "#fafafa" }}
                  role="status"
                >
                  <HomeCardSkeleton />
                </div>
              }
            >
              {/* background color of row component */}
              <div className="row  py-2" style={{ backgroundColor: "#fafafa" }}>
                {/* {memoizedData.length !==0( */}
                {memoizedData.map(
                  (item) => {
                    return (
                      //wait for liked to be fetched
                      <HomeCard
                        abc={liked?.includes(item._id)}
                        key={item._id}
                        deadline={item.deadline}
                        avatar={item.postedBy.avatar}
                        address={item.address}
                        price={item.price}
                        subject={item.subject}
                        id={item._id}
                        likes={item.likes}
                        photo={item.photo}
                        title={item.title}
                        body={item.body}
                        name={item.postedBy.name}
                      />
                    );
                  }
                  // })
                )}
              </div>
            </InfiniteScroll>
          </div>

          {/* load more button */}
          {/* <div className="d-flex flex-row justify-content-center my-4">
          <Link role={"button"} onClick={() => setPerPage(perPage + 12)} style={{ backgroundColor: "#5271fd" }} className='btn text-light px-4 py-2 rounded-4 text-decoration-none'>Load more</Link>
        </div> */}
        </Container>
      ) : null}
    </>
  );
}

export default Home;
