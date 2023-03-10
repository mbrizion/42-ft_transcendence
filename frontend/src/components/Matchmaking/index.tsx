import { useState, useEffect } from "react";
import { socket, handleTokenCorrupted } from "../../App";
import axios from "axios";
import OppenentsInterface from "../../interfaces/oppenents.interface";
import PlayerInterface from "../../interfaces/player.interface";
import { useCookies } from "react-cookie";
import { ListItem } from "@mui/material";

export default function GameHome() {
  // VARIABLES \\

  const [cookie] = useCookies(["displayName"]);
  const [matchingQueue, setMatchingQueue] = useState<string[]>([]);
  const [gameList, setGameList] = useState<string[]>([]);

  // FUNCTIONS \\

  const addToQueue = () => {
    if (!matchingQueue.includes(cookie.displayName)) {
      socket.emit("join matching queue");
    }
  };

  const watchMatch = (strGame: string) => {
    const playerNames = strGame.split(" ");
    playerNames.splice(1, 1);
    socket.emit("watch game", playerNames);
  };

  const MatchingQueue = matchingQueue.map((matchingQueue, index) => {
    return <ListItem key={index}>{matchingQueue} </ListItem>;
  });

  const GameInProgress = gameList.map((gameList, index) => (
    <ListItem onClick={() => watchMatch(gameList)} key={index}>
      {gameList}{" "}
    </ListItem>
  ));

  // USE_EFFECT \\

  useEffect(() => {
    axios
      .get("http://localhost:3001/game/queue")
      .then((res) => {
        setMatchingQueue(res.data);
      })
      .catch((err) => {
        handleTokenCorrupted(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3001/game/list")
      .then((res) => {
        setGameList(res.data);
      })
      .catch((err) => {
        handleTokenCorrupted(err);
      });
  }, []);

  useEffect(() => {
    socket.on("join matching queue", joinMatchingQueueListener);
    return () => {
      socket.off("join matching queue", joinMatchingQueueListener);
    };
  });

  useEffect(() => {
    socket.on("deleteOppenents", deleteOppenentsListener);
    return () => {
      socket.off("deleteOppenents", deleteOppenentsListener);
    };
  });

  useEffect(() => {
    socket.on("update game list", updateGameListListener);
    return () => {
      socket.off("update game list", updateGameListListener);
    };
  });

  useEffect(() => {
    socket.on("game over", gameOverListener);
    return () => {
      socket.off("game over", gameOverListener);
    };
  });

  useEffect(() => {
    socket.on("delete in matching", deleteInMatchingListener);
    return () => {
      socket.off("delete in matching", deleteInMatchingListener);
    };
  });

  // LISTENER \\

  const joinMatchingQueueListener = (displayName: string) => {
    setMatchingQueue([...matchingQueue, displayName]);
  };

  const deleteOppenentsListener = (oppenents: OppenentsInterface) => {
    let index = matchingQueue.indexOf(oppenents.one);
    if (index >= 0) matchingQueue.splice(index, 1);
    index = matchingQueue.indexOf(oppenents.two);
    if (index >= 0) matchingQueue.splice(index, 1);
    setMatchingQueue([...matchingQueue]);
  };

  const deleteInMatchingListener = (players: string[]) => {
    let i = 0;
    const lenP = players.length;
    let index;
    while (i < lenP) {
      index = matchingQueue.indexOf(players[i]);
      if (index >= 0) matchingQueue.splice(index, 1);
      ++i;
    }
    setMatchingQueue([...matchingQueue]);
  };

  const updateGameListListener = (players: PlayerInterface[]) => {
    let strGame = players[0].displayName.concat(" vs ");
    strGame = strGame.concat(players[1].displayName);
    setGameList([...gameList, strGame]);
  };

  const gameOverListener = (versus: string) => {
    let index = gameList.indexOf(versus);
    if (index >= 0) gameList.splice(index, 1);
    else console.log(versus);
    setGameList([...gameList]);
  };

  // RETURN \\

  return (
    <div className="matchmaking-container">
      {/* Left Side*/}
      <div className="game-container">
        {cookie.displayName && (
          <button className="pong_button" onClick={() => addToQueue()}>
            Join queue
            <span>(as {cookie.displayName}) </span>
          </button>
        )}
      </div>
      <div className="matching-container">
        <div className="matching-queue">
          Players in queue :<div>{MatchingQueue}</div>
        </div>
        <div className="game-progress">
          <h5>Watch game in progress</h5>
          <div>{GameInProgress}</div>
        </div>
      </div>
    </div>
  );
}
