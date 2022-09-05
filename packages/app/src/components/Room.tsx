import React from "react";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { MovementEnum, MovementType } from "rock_types";
import { RoomContext } from "../context/RoomContext";

export const Room = () => {
  const { room, setRoom, socket } = useContext(RoomContext);

  const [paused, setPaused] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);

  const [movement, setMovement] = useState<MovementType | null>();

  const [winRounds, setWinRounds] = useState<number>(0);

  useEffect(() => {
    if (winRounds > parseInt(room.rounds) / 2) {
      socket.emit("game_end", {
        winnerId: socket.id,
        roomId: room.roomId,
      });
    }
  }, [winRounds]);

  useEffect(() => {
    socket.on("joined_room", ({ room }: any) => {
      setRoom(room);
    });

    socket.on("paused_game", (data: any) => {
      setPaused(data.paused);
    });

    socket.on("result", ({ msg, winnerId }: any) => {
      alert(msg);

      if (socket.id === winnerId) {
        setWinRounds(winRounds + 1);
      }

      setMovement(null);
      setRoom({
        ...room,
        currentRound: room.currentRound + 1,
      });
    });

    socket.on("game_ended", ({ msg }: any) => {
      alert(msg);

      setGameFinished(true);
    });

    return () => {
      socket.off("joined_room");
      socket.off("paused_game");
      socket.off("result");
      socket.off("game_ended");
    };
  }, [gameFinished, movement, room, socket]);

  const handlePause = (e: any) => {
    e.preventDefault();

    socket.emit("pause_game", {
      query: {
        roomId: room.roomId,
        paused: !paused,
      },
    });
  };

  const makeMovement = (e: any, movement: MovementType) => {
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
                    onClick={(e) => makeMovement(e, MovementEnum.ROCK)}
                    disabled={!!movement || paused || gameFinished}
                    variant="primary"
                  >
                    Rock
                  </Button>
                </Col>
                <Col>
                  <Button
                    onClick={(e) => makeMovement(e, MovementEnum.PAPER)}
                    disabled={!!movement || paused || gameFinished}
                    variant="warning"
                  >
                    Paper
                  </Button>
                </Col>
                <Col>
                  <Button
                    onClick={(e) => makeMovement(e, MovementEnum.SCISSORS)}
                    disabled={!!movement || paused || gameFinished}
                    variant="danger"
                  >
                    Scissors
                  </Button>
                </Col>
              </Row>

              <Row className="mt-5 d-flex justify-content-center align-items-center">
                {!gameFinished && (
                  <Button
                    onClick={handlePause}
                    variant={paused ? "warning" : "success"}
                  >
                    {paused ? "Play" : "Pause"}
                  </Button>
                )}

                {gameFinished && (
                  <Link className="btn btn-primary" to={"/"}>
                    Start new game
                  </Link>
                )}
              </Row>
            </Container>
          )}
        </Container>
      )}

      {!room && <Navigate to="/" />}
    </>
  );
};
