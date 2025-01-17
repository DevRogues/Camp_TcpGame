import { addUser, getUserById } from '../../session/user.session.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handleError } from '../../utils/error/errorHandler.js';
import {
  createUser,
  findUserByDeviceID,
  findUserLastLocationByUserId,
  updateUserLogin
} from '../../db/user/user.db.js';
import {getAllGameSessions} from "../../session/game.session.js";
import CustomError from "../../utils/error/customError.js";
import {ErrorCodes} from "../../utils/error/errorCodes.js";
import {userSessions} from "../../session/sessions.js";

const initialHandler = async ({ socket, userId, payload }) => {
  try {
    const { deviceId , latency , speed } = payload;
    let user = await findUserByDeviceID(deviceId);

    if (!user) {
      user = await createUser(deviceId);
    } else {
      await updateUserLogin(user.id);
    }

    const userSessions = getUserById(user.id);
    if(userSessions){
      throw new CustomError(ErrorCodes.ALREADY_LOGIN, '로그인한 상태입니다.');
    }

    //userSession에 해당 유저 추가추가
    user = addUser(user.id, socket,speed, latency , deviceId);

    //유저의 마지막 위치 정보 조회
    const userLocation = await findUserLastLocationByUserId(user.id);

    //게임 세션 참여
    const gameSession = getAllGameSessions();

    if (!gameSession) {
      throw new CustomError(ErrorCodes.GAME_NOT_FOUND, '게임 세션을 찾을 수 없습니다.');
    }
    // 게임 세션참여
    gameSession[0].addUser(user, socket);
    // 유저 정보 응답 생성
    const initialResponse = createResponse(
      HANDLER_IDS.INITIAL,
      RESPONSE_SUCCESS_CODE,
      { userId: deviceId , x : (userLocation) ? userLocation.x : 0, y : (userLocation) ? userLocation.y :0},
      deviceId,
    );

    console.log('=>(initial.handler.js:28) initialResponse', initialResponse);

    // 소켓을 통해 클라이언트에게 응답 메시지 전송
    socket.write(initialResponse);
  } catch (error) {
    handleError(socket, error);
  }
};

export default initialHandler;
