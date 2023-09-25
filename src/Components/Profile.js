import InfoCard from "./InfoCard";
import PostCard from "./PostCard";
import logo1 from "../Images/logo1.png";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { Row } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";

import { useDispatch, useSelector } from "react-redux";
import { setUserPosts } from "../Reducers/UserPosts"; // Make sure to adjust the import path accordingly.

function Profile({ tabTitle }) {
  const { state } = useContext(UserContext);
  let navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const userPosts = useSelector((state) => state.userPosts);
  const location = useLocation();

  useEffect(() => {
    document.title = tabTitle;
  }, []);

  useEffect(() => {
    // Check if the query parameter 'editOccurred' is present
    const queryParams = new URLSearchParams(location.search);
    const editOccurred = queryParams.get("editOccurred");
    const postCreated = queryParams.get("postCreated");

    if (editOccurred === "true" || postCreated === "true") {
      // Remove the query parameter to prevent continuous reloading
      queryParams.delete("editOccurred");
      queryParams.delete("postCreated");
      

      // Build the new URL without the query parameter
      const newUrl = `${location.pathname}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      // Replace the current URL without the query parameter
      window.history.replaceState({}, document.title, newUrl);

      // Reload the page only once
      window.location.reload();
    }
  }, [location]);

  const fetchPosts = async () => {
    console.log("fetching posts");
    await fetch("/mypost", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          // alert(result.error)
          navigate("/");
        } else {
          // setData(result.mypost);
          setLoading(false);

          //dispatching action to save posts uploaded by user
          dispatch(setUserPosts(result.mypost));
        }
      });
  };

  useEffect(() => {
    console.log("userPosts", userPosts);
    if (userPosts.length === 0) {
      fetchPosts();
    }
    setLoading(false);
  }, [userPosts.length]);
  return (
    <Row className="m-auto" style={{ minHeight: "500px" }}>
      <div className="col-lg-2 col-md-4 col-12 my-3">
        <InfoCard
          avatar={state?.avatar || logo1}
          name={state ? state.name : "loading"}
          bio={"1234567890-=][poiuytrewqasdfghjkl;/.,mnbvcxz"}
        />
      </div>
      <div className="col-lg-9 mx-auto col-md-8 col-sm-8 my-3">
        <h2 className="fw-bold">Your Posts</h2>
        <div style={{ borderTop: "2px solid black " }}></div>
        <Row className="d-flex gap-4  my-4 container-fluid w-auto">
          {
            //if loading then show skeleton loader
            loading ? (
              <>
                <div className="d-flex justify-content-between border py-3">
                  <Skeleton height={150} width={150} />
                  <Skeleton height={150} width={700} />
                </div>
                <div className="d-flex justify-content-between border py-3">
                  <Skeleton height={150} width={150} />
                  <Skeleton height={150} width={700} />
                </div>
                <div className="d-flex justify-content-between border py-3">
                  <Skeleton height={150} width={150} />
                  <Skeleton height={150} width={700} />
                </div>
                <div className="d-flex justify-content-between border py-3">
                  <Skeleton height={150} width={150} />
                  <Skeleton height={150} width={700} />
                </div>
              </>
            ) : null
          }
          {userPosts
            ?.slice()
            ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            ?.map((item) => {
              return (
                <PostCard
                  TotalLikes={item.likes.length}
                  price={item.price}
                  deadline={item.deadline}
                  subject={item.subject}
                  date={item.createdAt}
                  key={item._id}
                  v
                  id={item._id}
                  photo={item.photo}
                  title={item.title}
                  body={item.body}
                />
              );
            })}
        </Row>
      </div>
    </Row>
  );
}

export default Profile;
