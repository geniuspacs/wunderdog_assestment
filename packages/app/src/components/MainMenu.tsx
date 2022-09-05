import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const MainMenu: React.FC = () => {
  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between">
        <Link className="btn btn-primary" to={"create-room"}>
          Create room
        </Link>
        <Link className="btn btn-primary" to={"join-room"}>
          Join room
        </Link>
      </div>
    </Container>
  );
};

export default MainMenu;
