import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { Room } from "rock_types";

import { RoomContext } from "../context/RoomContext";

type SelectRoomPropType = {
  create: boolean;
};

type ModalPropType = {
  show: boolean;
  msg: string;
};

const SelectRoom: React.FC<SelectRoomPropType> = ({
  create,
}: SelectRoomPropType) => {
  const navigate = useNavigate();

  const { room, setRoom, socket } = useContext(RoomContext);

  const [match, setMatch] = useState({
    nickname: "",
    roomId: "",
    rounds: "",
  });

  const [modal, setModal] = useState<ModalPropType>({
    show: false,
    msg: "",
  });

  useEffect(() => {
    socket.on("error", (error: any) =>
      setModal({
        show: true,
        msg: error.msg,
      })
    );

    socket.on("joined_room", (data: { msg: string; room: Room }) => {
      setRoom(data.room);

      setModal({
        show: true,
        msg: data.msg,
      });

      setRoom({
        ...room,
        ...data.room,
      });
    });

    return () => {
      socket.off("error");
      socket.off("joined_room");
    };
  }, [setRoom, socket]);

  const handleChange = (e: any): void => {
    e.preventDefault();
    setMatch({
      ...match,
      [e.target.name]: e.target.value,
    });
  };

  const handleHideModal = (): void => {
    setModal({
      msg: "",
      show: false,
    });
  };

  const handleAcceptModal = (): void => {
    handleHideModal();

    navigate("/room");
  };

  const submit = (e: any) => {
    e.preventDefault();
    socket.emit("join_room", {
      query: match,
    });
  };

  return (
    <Container>
      <Form onSubmit={submit}>
        <Form.Group className="my-3">
          <Form.Label>Nickname:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your nickname"
            name="nickname"
            onChange={handleChange}
          />
        </Form.Group>

        {!create && (
          <Form.Group className="my-3">
            <Form.Label>Game ID:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the room"
              name="roomId"
              onChange={handleChange}
            />
          </Form.Group>
        )}

        {create && (
          <Form.Group className="my-3">
            <Form.Label>Rounds:</Form.Label>
            <Form.Control
              type="number"
              placeholder="How many rounds?"
              name="rounds"
              onChange={handleChange}
            />
          </Form.Group>
        )}

        <div className="d-flex align-items-center justify-content-center mt-4">
          <Button type="submit" variant="primary">
            {!create ? "Join in the game!" : "Start the match!"}
          </Button>
        </div>
      </Form>

      <Modal show={modal.show} onHide={handleHideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>{modal.msg}</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={handleAcceptModal}>
            Accept
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SelectRoom;
