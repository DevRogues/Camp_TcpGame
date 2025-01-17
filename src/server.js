import net from 'net';
import initServer from './init/index.js';
import { config } from './config/config.js';
import { onConnection } from './events/onConnection.js';
import { gameSessions, userSessions } from './session/sessions.js';
import createGame from "./utils/game/createGame.js";

const server = net.createServer(onConnection);

initServer()
  .then(() => {
    server.listen(config.server.port, config.server.host, () => {
      console.log(`서버가 ${config.server.host}:${config.server.port}에서 실행 중입니다.`);
      console.log(server.address());

      //게임 인스턴스 생성
      const gameId = createGame();

      // console.log('\n#### Session 정보 조회');
      console.log('userSessions : ', userSessions);
      console.log('gameSessions : ', gameSessions);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1); // 오류 발생 시 프로세스 종료
  });
