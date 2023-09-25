import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Container, Image, Spinner } from "react-bootstrap";
import HomeCard from "./HomeCard";
import noFav from "../Images/noFavs.png";
import HomeCardSkeleton from "./HomeCardSkeleton";
function Favourites({ tabTitle }) {
  const [likedPosts, setLikedPosts] = useState([]);
  //add loading state
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    document.title = tabTitle;
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchLiked = async () => {
      try {
        const response = await fetch(`/likedposts`);
        const data = await response.json();
        setLikedPosts(data.posts);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLiked();
  }, []);

  return (
    <Container fluid>
      <h1 className="my-3 text-warning">My Favourites</h1>

      <div className="d-flex row" style={{ minHeight: "475px" }}>
        {loading ? (
          <div className="row" style={{ backgroundColor: "#fafafa" }}>
            <HomeCardSkeleton />
          </div>
        ) : //if likedPosts is empty then show no posts to show
        likedPosts.length === 0 ? (
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ height: "500px" }}
          >
            <h2>No posts to show</h2>
            <Image src={noFav} className="w-25"></Image>
          </div>
        ) : (
          likedPosts.map((item) => (
            <HomeCard
              key={item._id}
              photo={item.photo}
              deadline={item.deadline}
              name={item.postedBy.name}
              avatar={item.postedBy.avatar}
              id={item._id}
              subject={item.subject}
              title={item.title}
              body={item.body}
              address={item.address}
              price={item.price}
              abc={true}
            />
          ))
        )}
      </div>
    </Container>
  );
}

export default Favourites;
