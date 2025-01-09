import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import protobuf from 'protobufjs';
import { packetNames } from '../protobuf/packetNames.js';

// 현재 파일의 절대 경로 추출
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 프로토파일이 있는 디렉토리 경로 설정
const protoDir = path.join(__dirname, '../protobuf');

// 주어진 디렉토리 내 모든 proto 파일을 재귀적으로 찾는 함수
const getAllProtoFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    //경로가 directory(folder)인지 확인한다.
    if (fs.statSync(filePath).isDirectory()) {
      getAllProtoFiles(filePath, fileList);
      // 확작장가 .proto인 경우
    } else if (path.extname(file) === '.proto') {
      fileList.push(filePath);
    }
  });
  return fileList;
};

// 모든 proto 파일 경로를 가져옴
const protoFiles = getAllProtoFiles(protoDir);

// 로드된 프로토 메시지들을 저장할 객체
const protoMessages = {};

// 모든 .proto 파일을 로드하여 프로토 메시지를 초기화합니다.
export const loadProtos = async () => {
  console.log('\n########## loadProtos() IN');

  try {
    const root = new protobuf.Root();

    // 비동기 병렬 처리로 프로토 파일 로드
    // load() : protobuf.js 라이브러리에서 제공하는 메서드로, .proto 파일에 정의된 Protocol Buffers 스키마를 로드하고 이를 JavaScript 객체로 변환하는 데 사용
    await Promise.all(protoFiles.map((file) => root.load(file)));

    // packetNames 에 정의된 패킷들을 등록
    /**
     * Object.entries : 객체의 {key : value} 형식을 배열 형태의 [key, value] 로 변환하여 준다.
     */
    for (const [packageName, types] of Object.entries(packetNames)) {
      console.log('packageName : ', packageName);
      console.log('types : ', types);

      /** 결과( packetNames의 객체 속성 값을 순차적으로 처리
       * packageName :  common
       * types :  { Packet: 'common.Packet' }
       */

      protoMessages[packageName] = {}; //빈 객체를 만든다.

      /**
       * 예) types :  { Packet: 'common.Packet' }
       * types 의 요소 만큼 처리
       * type : Packet , typeName : 'common.Packet'
       */
      for (const [type, typeName] of Object.entries(types)) {
        // console.log('=>(loadProtos.js:68) type', type);
        // console.log('=>(loadProtos.js:68) typeName', typeName);
        // lookupType() : Protocol Buffers 스키마 내에서 이미 정의된 메시지 타입을 검색하는 데 사용
        protoMessages[packageName][type] = root.lookupType(typeName);
        // protoMessages['common']['Packet']
      }
    }

    // console.log('protoMessages : ', protoMessages);
    console.log('Protobuf 파일이 로드되었습니다.');
  } catch (error) {
    console.error('Protobuf 파일 로드 중 오류가 발생했습니다:', error);
  }
};

// 로드된 프로토 메시지들의 얕은 복사본을 반환합니다.
export const getProtoMessages = () => {
  // console.log('protoMessages:', protoMessages); // 디버깅을 위해 추가
  return { ...protoMessages };
};
