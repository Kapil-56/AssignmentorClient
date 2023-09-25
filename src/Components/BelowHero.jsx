import React from "react";
import { Col, Row } from "react-bootstrap";

function BelowHero() {
  return (
    <Row className="container-fluid d-flex m-auto gy-4">
      <Col md={4} lg={4}>
        {/* the svg should be on left side and tilte and subtile on right and subtitle should be below title */}
        <div className="item d-flex">
          <div
            className="icon"
            style={{
              borderWidth: "1px",
              backgroundColor: "rgb(82, 113, 253)",
              width: "64px",
              height: "64px",
              maxWidth: "64px",
              marginRight: "16px",
              padding: "14px",
              minWidth: "64px",
              borderRadius: "16px",
              flexGrow: "1",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
              filter="invert(1)"
              viewBox="0 0 512 512"
            >
              <title>ionicons-v5-q</title>
              <path d="M104,496H72a24,24,0,0,1-24-24V328a24,24,0,0,1,24-24h32a24,24,0,0,1,24,24V472A24,24,0,0,1,104,496Z" />
              <path d="M328,496H296a24,24,0,0,1-24-24V232a24,24,0,0,1,24-24h32a24,24,0,0,1,24,24V472A24,24,0,0,1,328,496Z" />
              <path d="M440,496H408a24,24,0,0,1-24-24V120a24,24,0,0,1,24-24h32a24,24,0,0,1,24,24V472A24,24,0,0,1,440,496Z" />
              <path d="M216,496H184a24,24,0,0,1-24-24V40a24,24,0,0,1,24-24h32a24,24,0,0,1,24,24V472A24,24,0,0,1,216,496Z" />
            </svg>
          </div>
          <div className="container d-flex flex-wrap">
            <h3 className="fw-semibold fs-5 title">Easy to use</h3>
            <div className="subtitle text-muted">
              Our app has a user-friendly interface that makes it easy for
              students to post their assignments and for other students to
              complete them.
            </div>
          </div>
        </div>
      </Col>
      <Col md={4} lg={4}>
        <div className="item d-flex">
          <div
            className="icon"
            style={{
              borderWidth: "1px",
              backgroundColor: "rgb(82, 113, 253)",
              width: "64px",
              height: "64px",
              maxWidth: "64px",
              marginRight: "16px",
              padding: "14px",
              minWidth: "64px",
              borderRadius: "16px",
              flexGrow: "1",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              filter="invert(1)"
              height="35"
              viewBox="0 0 512 512"
            >
              <title>ionicons-v5-l</title>
              <path d="M256,428C203.65,428,144.61,416.39,98.07,397,81,389.81,66.38,378.18,54.43,369A4,4,0,0,0,48,372.18v12.58c0,28.07,23.49,53.22,66.14,70.82C152.29,471.33,202.67,480,256,480s103.7-8.67,141.86-24.42C440.51,438,464,412.83,464,384.76V372.18a4,4,0,0,0-6.43-3.18C445.62,378.17,431,389.81,413.92,397,367.38,416.39,308.35,428,256,428Z" />
              <path d="M464,126.51c-.81-27.65-24.18-52.4-66-69.85C359.74,40.76,309.34,32,256,32S152.26,40.76,114.09,56.66c-41.78,17.41-65.15,42.11-66,69.69L48,144c0,6.41,5.2,16.48,14.63,24.73,11.13,9.73,27.65,19.33,47.78,27.73C153.24,214.36,207.67,225,256,225s102.76-10.68,145.59-28.58c20.13-8.4,36.65-18,47.78-27.73C458.8,160.49,464,150.42,464,144Z" />
              <path d="M413.92,226C367.39,245.43,308.35,257,256,257S144.61,245.43,98.07,226C81,218.85,66.38,207.21,54.43,198A4,4,0,0,0,48,201.22V232c0,6.41,5.2,14.48,14.63,22.73,11.13,9.74,27.65,19.33,47.78,27.74C153.24,300.34,207.67,311,256,311s102.76-10.68,145.59-28.57c20.13-8.41,36.65-18,47.78-27.74C458.8,246.47,464,238.41,464,232V201.22a4,4,0,0,0-6.43-3.18C445.62,207.21,431,218.85,413.92,226Z" />
              <path d="M413.92,312C367.38,331.41,308.35,343,256,343S144.61,331.41,98.07,312C81,304.83,66.38,293.19,54.43,284A4,4,0,0,0,48,287.2V317c0,6.41,5.2,14.47,14.62,22.71,11.13,9.74,27.66,19.33,47.79,27.74C153.24,385.32,207.66,396,256,396s102.76-10.68,145.59-28.57c20.13-8.41,36.65-18,47.78-27.74C458.8,331.44,464,323.37,464,317V287.2a4,4,0,0,0-6.43-3.18C445.62,293.19,431,304.83,413.92,312Z" />
            </svg>
          </div>
          <div className="container d-flex flex-wrap">
            <h3 className="fw-semibold fs-5 title">Secure Payments</h3>
            <div className="subtitle text-muted">
              Our app has a user-friendly interface that makes it easy for
              students to post their assignments and for other students to
              complete them.
            </div>
          </div>
        </div>
      </Col>
      <Col md={4} lg={4}>
        <div className="item d-flex">
          <div
            className="icon"
            style={{
              borderWidth: "1px",
              backgroundColor: "rgb(82, 113, 253)",
              width: "64px",
              height: "64px",
              maxWidth: "64px",
              marginRight: "16px",
              padding: "14px",
              minWidth: "64px",
              borderRadius: "16px",
              flexGrow: "1",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
              filter="invert(1)"
              viewBox="0 0 512 512"
            >
              <title>ionicons-v5-a</title>
              <path d="M186.62,464H160a16,16,0,0,1-14.57-22.6l64.46-142.25L113.1,297,77.8,339.77C71.07,348.23,65.7,352,52,352H34.08a17.66,17.66,0,0,1-14.7-7.06c-2.38-3.21-4.72-8.65-2.44-16.41l19.82-71c.15-.53.33-1.06.53-1.58a.38.38,0,0,0,0-.15,14.82,14.82,0,0,1-.53-1.59L16.92,182.76c-2.15-7.61.2-12.93,2.56-16.06a16.83,16.83,0,0,1,13.6-6.7H52c10.23,0,20.16,4.59,26,12l34.57,42.05,97.32-1.44-64.44-142A16,16,0,0,1,160,48h26.91a25,25,0,0,1,19.35,9.8l125.05,152,57.77-1.52c4.23-.23,15.95-.31,18.66-.31C463,208,496,225.94,496,256c0,9.46-3.78,27-29.07,38.16-14.93,6.6-34.85,9.94-59.21,9.94-2.68,0-14.37-.08-18.66-.31l-57.76-1.54-125.36,152A25,25,0,0,1,186.62,464Z" />
            </svg>
          </div>
          <div className="container d-flex flex-wrap">
            <h3 className="fw-semibold fs-5 title">Same day delivery</h3>
            <div className="subtitle text-muted">
              Our app has a user-friendly interface that makes it easy for
              students to post their assignments and for other students to
              complete them.
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default BelowHero;
