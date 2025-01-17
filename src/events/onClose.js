import { gameSessions, userSessions } from '../session/sessions.js';
import saveUserLocation from "../utils/game/saveUserLocation.js";

export const onClose= (socket) => async (data) => {
  console.log('클라이언트 연결이 종료(CLOSE)되었습니다.');

  // 유저의 마지막 위치 정보 저장
  await saveUserLocation(socket);

  console.log(userSessions);
  console.log(gameSessions);
};
