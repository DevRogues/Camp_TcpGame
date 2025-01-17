import {createUserLastLocation, findUserLastLocationByUserId, updateUserLastLocation} from "../../db/user/user.db.js";
import {getUserBySocket, removeUser} from "../../session/user.session.js";
import {getAllGameSessions} from "../../session/game.session.js";
import CustomError from "../error/customError.js";
import {ErrorCodes} from "../error/errorCodes.js";

const saveUserLocation = async (socket) =>{
    try {
    // 해당 소켓으로 유저 정보 조회
    const userSession = getUserBySocket(socket);

    // DB에 유저의 마지막 위치 정보 조회
    const userDB = await findUserLastLocationByUserId(userSession.id);

    // 데이터가 없으면 생성, 있으면 수정

        if(!userDB) {
            await createUserLastLocation(userSession.id,userSession.x,userSession.y)
        }else{
            await updateUserLastLocation(userSession.id,userSession.x,userSession.y)
        }
    }catch (e) {
        throw new CustomError(ErrorCodes.DATABASE_ERROR, e.message);
    }


    // 유저 세션에서 해당 유저 삭제
    removeUser(socket);

    // 게임 세션에 유저 정보 삭제
    const gameSession = getAllGameSessions();
    gameSession[0].removeUser(userSession.id);
}

export default saveUserLocation;