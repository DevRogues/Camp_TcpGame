import { handleError } from '../utils/error/errorHandler.js';
import {getUserBySocket, removeUser} from '../session/user.session.js';
import CustomError from '../utils/error/customError.js';
import { onEnd } from './onEnd.js';
import {findUserLastLocationByUserId} from "../db/user/user.db.js";
import saveUserLocation from "../utils/game/saveUserLocation.js";

export const onError = (socket) => async (err) => {

  handleError(socket, new CustomError(500, `소켓 오류: ${err.message}`));

  // 유저의 마지막 위치 정보 저장
  // await saveUserLocation(socket);

};
