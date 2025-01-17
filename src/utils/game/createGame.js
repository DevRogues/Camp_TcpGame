import {addGameSession} from "../../session/game.session.js";
import {v4 as uuidv4} from "uuid";

const createGame = () => {

    //게임ID 생성
    const gameId =uuidv4();
    //게임 인스턴스 생성
    addGameSession(gameId);

    return gameId;
}

export default createGame;