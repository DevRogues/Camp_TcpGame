import { config } from '../config/config.js';
import { PACKET_TYPE, TOTAL_LENGTH } from '../constants/header.js';
import { packetParser } from '../utils/parser/packetParser.js';
import { getHandlerById } from '../handler/index.js';
import { getUserById, getUserBySocket } from '../session/user.session.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import { handleError } from '../utils/error/errorHandler.js';
import { getProtoMessages } from '../init/loadProtos.js';

export const onData = (socket) => async (data) => {
  // console.log('\n ##### onData IN');
  /**
   * console.log() 결과
   * data : <Buffer 00 00 00 17 01 08 02 12 03 78 79 7a 1a 05 31 2e 30 2e 30 20 00 2a 00>
   * socket.buffer : <Buffer >
   */

  // 기존 버퍼에 새로 수신된 데이터를 추가
  // 소켓의 버퍼에 수신된 데이터를 합침.
  socket.buffer = Buffer.concat([socket.buffer, data]);

  // 패킷의 총 헤더 길이 (패킷 길이 정보 + 타입 정보)
  // 4 + 1 = 5
  const totalHeaderLength = config.packet.totalLength + config.packet.typeLength;

  /**
   * 데이터는 스트림을 통해 청크단위로 조금씩 전송받게 되는데 우리가 원하는 데이터가 들어올때까지 계속 대기하다가 원하는 데이터가 도착하면 처리하는 형태
   */

  // 버퍼에 최소한 전체 헤더가 있을 때만 패킷을 처리
  while (socket.buffer.length >= totalHeaderLength) {
    // console.log(
    //   '\n#### While문 socket.buffer.length : ',
    //   socket.buffer.length,
    //   ', totalHeaderLength : ',
    //   totalHeaderLength,
    // );

    // 1. 패킷 길이 정보 수신 (4바이트)
    // 패킷의 총 길이 값
    const length = socket.buffer.readUInt32BE(0);
    // 2. 패킷 타입 정보 수신 (1바이트)
    const packetType = socket.buffer.readUInt8(config.packet.totalLength);

    // console.log(
    //   `#### length: ${length}, packetType: ${packetType} , socket.buffer.length : ${socket.buffer.length}`,
    // );
    // 3. 패킷 전체 길이 확인 후 데이터 수신
    // 현재 전송된 패킷 길이와 총 패킷의 길이를 비교
    if (socket.buffer.length >= length) {
      // 패킷 데이터를 자르고 버퍼에서 제거
      const packet = socket.buffer.slice(totalHeaderLength, length);
      socket.buffer = socket.buffer.slice(length);

      // console.log(`length: ${length}, packetType: ${packetType}`);
      // console.log(`packet: ${packet}`);
      // console.log(packet);
      /** 로그 결과
       *
       * length: 23, packetType: 1
       * packet:xyz⸮1.0.0 *
       * <Buffer 08 02 12 03 78 79 7a 1a 05 31 2e 30 2e 30 20 00 2a 00>
       */

      try {
        switch (packetType) {
          case PACKET_TYPE.PING:
            {
              const protoMessages = getProtoMessages();
              const Ping = protoMessages.common.Ping;
              const pingMessage = Ping.decode(packet);
              const user = getUserBySocket(socket);
              if (!user) {
                throw new CustomError(ErrorCodes.USER_NOT_FOUND, '유저를 찾을 수 없습니다.');
              }
              user.handlePong(pingMessage);
            }
            break;
          case PACKET_TYPE.NORMAL:
            // const { handlerId, sequence, payload, userId } = packetParser(packet);
            const { handlerId, payload, userId } = packetParser(packet);
            /**
             * onData.js sequence 검증 추가.
             * 여기서 사용하는 시퀀스는 이전에 잠깐 언급한 것 처럼 호출 횟수를 가르키는데 여러가지 용도로 사용할 수 있습니다.
             * 패킷의 중복 방지, 순서 보장, 재전송 요청, 어뷰징 감지 등의 용도가 있습니다.
             */
            const user = getUserById(userId);

            // 유저가 접속해 있는 상황에서 시퀀스 검증
            // if (user && user.sequence !== sequence) {
            //   throw new CustomError(ErrorCodes.INVALID_SEQUENCE, '잘못된 호출 값입니다. ');
            // }

            const handler = getHandlerById(handlerId);
            await handler({
              socket,
              userId,
              payload,
            });
        }
      } catch (e) {
        handleError(socket, e);
      }
    } else {
      // 아직 전체 패킷이 도착하지 않음
      break;
    }
  }
};
