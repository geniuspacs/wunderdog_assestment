import React from "react";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";

export const Room = () => {
  const { room, setRoom, socket } = useContext(RoomContext);

  const [paused, setPaused] = useState<boolean>(false);

  const [movement, setMovement] = useState<string | null>();

  const [winRounds, setWinRounds] = useState({ rounds: 0 });

  useEffect(() => {
    if (winRounds.rounds > (room?.rounds || 0) / 2) {
      socket.emit("game_end", {
        winnerId: socket.id,
      });
    }
  }, [winRounds, setWinRounds]);

  useEffect(() => {
    socket.on("joined_room", ({ room }: any) => {
      setRoom(room);
    });

    socket.on("paused_game", (data: any) => {
      setPaused(data.paused);
    });

    socket.on("result", ({ msg, winnerId }: any) => {
      alert(msg);
      console.log(socket.id, winnerId);

      if (socket.id === winnerId) {
        setWinRounds((prevState) => ({ rounds: prevState.rounds + 1 }));
      }

      setMovement(null);
    });

    return () => {
      socket.off("joined_room");
      socket.off("paused_game");
      socket.off("result");
    };
  }, []);

  const handlePause = (e: any) => {
    e.preventDefault();

    socket.emit("pause_game", {
      query: {
        roomId: room.roomId,
        paused: !paused,
      },
    });
  };

  const makeMovement = (e: any, movement: string) => {
    e.preventDefault();

    setMovement(movement);

    socket.emit("make_movement", {
      query: {
        roomId: room.roomId,
        movement,
      },
    });
  };

  return (
    <>
      {room && (
        <Container>
          <h1>Welcome to room {room.roomId}</h1>

          {!room.isFull && <h4>Waiting for new players...</h4>}

          {room.isFull && (
            <Container className="mt-5">
              <Row className="d-flex flex-row justify-content-center align-items-center">
                <Col>
                  <Button
                    onClick={(e) => makeMovement(e, "R")}
                    disabled={!!movement || paused}
                    variant="primary"
                  >
                    Rock
                  </Button>
                </Col>
                <Col>
                  <Button
                    onClick={(e) => makeMovement(e, "P")}
                    disabled={!!movement || paused}
                    variant="warning"
                  >
                    Paper
                  </Button>
                </Col>
                <Col>
                  <Button
                    onClick={(e) => makeMovement(e, "S")}
                    disabled={!!movement || paused}
                    variant="danger"
                  >
                    Scissors
                  </Button>
                </Col>
              </Row>

              <Row className="mt-5 d-flex justify-content-center align-items-center">
                <Button
                  onClick={handlePause}
                  variant={paused ? "warning" : "success"}
                >
                  {paused ? "Play" : "Pause"}
                </Button>
              </Row>
            </Container>
          )}
        </Container>
      )}

      {!room && <Navigate to="/" />}
    </>
  );
};
