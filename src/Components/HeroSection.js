import React, { memo } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

// import hero3 from '../Images/hero3.png'
import hero3 from "../Images/Ladder.png";

function HeroSection() {
  return (
    <Container fluid className="">
      <Row className=" flex-direction-sm-column-reverse">
        <Col
          md={6}
          lg={8}
          className=" d-flex flex-column align-items-start justify-content-center "
        >
          <h1 className="fw-bold lh-sm">
            Find <span style={{ color: "#5271fd" }}>someone</span> to write
            those assignments.
          </h1>

          <p className="my-1 ">
            <span style={{ color: "#BA3232" }}>Academic Unity:</span> Connect
            with Peers{" "}
          </p>
          <Link
            to={"/signup"}
            role={"button"}
            className="rounded-3 px-3 py-2 text-light my-3 text-decoration-none shadow-sm"
            style={{ backgroundColor: "#5271fd" }}
          >
            Get started
          </Link>
        </Col>

        <Col
          md={6}
          lg={4}
          className=" d-flex flex-column align-items-center justify-content-center"
        >
          <picture>
            <source
              srcSet={`${hero3}?w=500&h=500&f=webp&q=80`}
              type="image/webp"
            />
            <Image
              alt="heroVector"
              fluid
              className="my-2"
              style={{ width: "100%", height: "auto" }}
              src={`${hero3}?w=500&h=500&f=webp&q=80`}
            />
          </picture>
          <p className="text-dark text-center my-0">
            Say goodbye to all-nighters 🌙
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default memo(HeroSection);
