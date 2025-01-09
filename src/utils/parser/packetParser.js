import { getProtoMessages } from '../../init/loadProtos.js';
import { getProtoTypeNameByHandlerId } from '../../handler/index.js';
import { config } from '../../config/config.js';
import CustomError from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';

export const packetParser = (data) => {
  console.log('\n#### packetParser IN');
  const protoMessages = getProtoMessages();

  // 공통 패킷 구조를 디코딩
  const Packet = protoMessages.common.Packet;
  // console.log('=>(packetParser.js:10) Packet', Packet);
  /**
   * lookupType과 동일
   */

  let packet;
  try {
    packet = Packet.decode(data);
    console.log('## packet decode', packet);
    /**
     * Packet {
     *   handlerId: 2,
     *   userId: 'xyz',
     *   clientVersion: '1.0.0',
     *   sequence: 0,
     *   payload: <Buffer >
     * }
     */
  } catch (error) {
    throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, '패킷 디코딩 중 오류가 발생했습니다.');
  }

  const handlerId = packet.handlerId;
  const userId = packet.userId;
  const clientVersion = packet.clientVersion;
  const sequence = packet.sequence;

  // clientVersion 검증
  if (clientVersion !== config.client.version) {
    throw new CustomError(
      ErrorCodes.CLIENT_VERSION_MISMATCH,
      '클라이언트 버전이 일치하지 않습니다.',
    );
  }

  /**
   * payload에 대한 파싱
   */
  // 핸들러 ID에 따라 적절한 payload 구조를 디코딩
  const protoTypeName = getProtoTypeNameByHandlerId(handlerId);
  console.log('## protoTypeName', protoTypeName);
  if (!protoTypeName) {
    throw new CustomError(ErrorCodes.UNKNOWN_HANDLER_ID, `알 수 없는 핸들러 ID: ${handlerId}`);
  }

  /**
   * protoTypeName.split('.') - initial.InitialPacket
   * initial: {
   *     InitialPacket: 'initial.InitialPacket',
   *   },
   */
  const [namespace, typeName] = protoTypeName.split('.');
  const PayloadType = protoMessages[namespace][typeName];
  // console.log('## PayloadType', PayloadType);
  let payload;

  try {
    //역질렬화
    payload = PayloadType.decode(packet.payload);
    console.log('## payload', payload);
  } catch (error) {
    throw new CustomError(ErrorCodes.PACKET_STRUCTURE_MISMATCH, '패킷 구조가 일치하지 않습니다.');
  }
  /**
   * 핸들러들마다 payload 필드 상이하니 필드에 대한 검증이 필요합니다. 패킷의 구조가 일치하지 않을 경우 발생하는 에러입니다.
   * decode 하는 과정에서 verify하는 과정이 포함되어 있음. 혹시
   */
  // 필드 검증 추가
  const errorMessage = PayloadType.verify(payload);
  if (errorMessage) {
    console.error(`패킷 구조가 일치하지 않습니다: ${errorMessage}`);
  }

  // 필드가 비어 있거나, 필수 필드가 누락된 경우 처리
  const expectedFields = Object.keys(PayloadType.fields); //필수 필드
  const actualFields = Object.keys(payload); //실제 필드 (현재 실제 값 데이터 존재 여부 체크)
  const missingFields = expectedFields.filter((field) => !actualFields.includes(field));

  /** deviceId를 안보내주고 있는 경우
   * =>(packetParser.js:83) expectedFields [ 'deviceId' ]
   * =>(packetParser.js:84) actualFields []
   * =>(packetParser.js:85) missingFields [ 'deviceId' ]
   */
  if (missingFields.length > 0) {
    throw new CustomError(
      ErrorCodes.MISSING_FIELDS,
      `필수 필드가 누락되었습니다: ${missingFields.join(', ')}`,
    );
  }

  return { handlerId, userId, payload, sequence };
};
