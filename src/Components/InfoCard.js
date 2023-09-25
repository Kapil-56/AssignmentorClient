import { Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

function InfoCard(props) {
  return (
    <Card
      className=" position-sticky flex-column flex-md-column  gap-3 gap-md-1"
      style={{ border: "none", top: "15%" }}
    >
      <div
        className="d-flex flex-row align-items-center flex-md-column
      "
      >
        <Card.Img
          alt="avatar"
          style={{ width: "100px", height: "100px" }}
          src={
            props.avatar.endsWith(".png")
              ? props.avatar
              : `data:image/svg+xml;base64,${props.avatar}`
          }
        />
        {/* {console.log(props.avatar.endsWith('.png'))} */}
        <Card.Body>
          <Card.Title>{props.name}</Card.Title>
        </Card.Body>
      </div>
      <ListGroup className="list-group-flush flex-row flex-md-column">
        <ListGroup.Item className="text-muted border-0">
          Followers: 0
        </ListGroup.Item>
        <ListGroup.Item className="text-muted border-0">
          Following: 0
        </ListGroup.Item>
      </ListGroup>
      <Card.Body>
        {/* <Button variant="none" className="btn-outline-dark w-100">
          Edit Profile
        <i className="fas fa-edit ms-2"></i>
        </Button> */}
      </Card.Body>
    </Card>
  );
}

export default InfoCard;
