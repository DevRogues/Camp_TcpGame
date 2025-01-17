import {getAllGameSessions, getGameSession} from '../../session/game.session.js';
import { handleError } from '../../utils/error/errorHandler.js';
import CustomError from '../../utils/error/customError.js';
import { ErrorCodes } from '../../utils/error/errorCodes.js';
import {findUserByDeviceID} from "../../db/user/user.db.js";
import {getUserBySocket} from "../../session/user.session.js";

const updateLocationHandler = ({ socket, userId, payload }) => {
  // console.log("### updateLocationHandler")
  try {
    // const { gameId, x, y } = payload;
    const { x, y, speed } = payload;
    // const gameSession = getGameSession(gameId);
    const gameSession = getAllGameSessions();

    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다.');
    }

    // const user = gameSession.getUser(userId);
    //클라에서 deviceId를 받아오기에 유저 세션에서 userId를 조회
    const userSession = getUserBySocket(socket)
    const user = gameSession[0].getUser(userSession.id);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
    }

    //유저 Speed 정보 변경
    if(user.speed !== speed){
      user.updateSpeed(speed);
    }

    let directionX = null;
    let directionY = null;

    if(user.x !== x) {
      if (user.x < user.x - x) {
        user.updateDirectionX("LEFT");
      } else {
        user.updateDirectionX("RIGHT");
      }
    }else{
      user.updateDirectionX(null);
    }

    if(user.y !== y) {
      if (user.y < user.y - y) {
        user.updateDirectionY("DOWN");
      } else {
        user.updateDirectionY("UP");
      }
    }else{
      user.updateDirectionY(null);
    }

    // 유저의 위치 정보 변경
    user.updatePosition(x, y);
    // 유저들의 모든 위치정보를 조회
    // const packet = gameSession.getAllLocation();
    const packet = gameSession[0].getAllLocation(user.id);
    //
    socket.write(packet);
  } catch (error) {
    handleError(socket, error);
  }
};

export default updateLocationHandler;
