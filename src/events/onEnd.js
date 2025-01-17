import { gameSessions, userSessions } from '../session/sessions.js';
import saveUserLocation from "../utils/game/saveUserLocation.js";

export const onEnd = (socket) => async (data) => {
  console.log('클라이언트 연결이 종료(END)되었습니다.');

  // 유저의 마지막 위치 정보 저장
  try{
    await saveUserLocation(socket);
  }catch (e) {
    console.error(e);
  }


  console.log(userSessions);
  console.log(gameSessions);
};
