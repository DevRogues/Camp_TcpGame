import { userSessions } from './sessions.js';
import User from '../classes/models/user.class.js';

export const addUser = (uuid, socket) => {
  // const user = { socket, id: uuid, sequence: 0 };
  const user = new User(uuid, socket);
  userSessions.push(user);
  return user;
};

export const removeUser = (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);
  if (index !== -1) {
    return userSessions.splice(index, 1)[0];
  }
};

/**
 * 위에서 시퀀스에 대한 설명을 했는데요.
 * 서버는 클라이언트의 요청이 끝날때마다 시퀀스의 값에 1을 더하여 보내줍니다.
 * 클라이언트는 받은 시퀀스넘버를 다음 요청에서 사용하게됩니다.
 * user.session.js 파일에 시퀀스 관련 함수를 추가해봅시다.
 * 즉 다음 시퀀스 번호를 서버에서 클라에 전송하여 다음 요청 때 해당 시퀀스로 다시 보내받기 위한 용도
 */
export const getNextSequence = (id) => {
  const user = getUserById(id);
  if (user) {
    return user.getNextSequence();
  }
  return null;
};

export const getUserById = (id) => {
  return userSessions.find((user) => user.id === id);
};

export const getUserBySocket = (socket) => {
  return userSessions.find((user) => user.socket === socket);
};
