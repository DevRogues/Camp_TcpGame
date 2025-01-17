import Game from './game.class.js';
import { createPingPacket } from '../../utils/notification/game.notification.js';

class User {
  constructor(id, socket , speed, latency , deviceId ) {
    this.id = id;
    this.deviceId = deviceId;
    this.socket = socket;
    this.x = 0;
    this.y = 0;
    this.sequence = 0;
    this.lastUpdateTime = Date.now();
    this.speed = speed;
    this.latency = latency;
    this.directionY = null;
    this.directionX = null;
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;
    this.lastUpdateTime = Date.now();
  }

  updateSpeed(speed) {
    this.speed = speed;
  }

  updateLatency(latency) {
    this.latency = latency;
  }

  updateDirectionX(direction) {
    this.directionX = direction;
  }

  updateDirectionY(direction) {
    this.directionY = direction;
  }

  getNextSequence() {
    return ++this.sequence;
  }

  ping() {
    const now = Date.now();

    this.socket.write(createPingPacket(now));
  }

  handlePong(data) {
    const now = Date.now();
    // this.latency = (now - data.timestamp) / 2;
    console.log(`Received pong from user ${this.id} at ${now} with latency ${this.latency}ms`);
  }

  // 추측항법을 사용하여 위치를 추정하는 메서드
  calculatePosition(latency) {

    const timeDiff = latency / 1000; // 레이턴시를 초 단위로 계산
    const distance = this.speed * timeDiff;
    if(this.id === "217d2a48-a48c-4324-8557-ee153e3bb638"){
      console.log('x : ' , this.x, ' distance : ' , distance);
    }

    let x = this.x;
    let y = this.y;

    if(this.directionX === "LEFT"){
      x = this.x - distance;
    }else if(this.directionX === "RIGHT"){
      x = this.x + distance;
    }

    if(this.directionY === "UP"){
      y = this.y + distance;
    }else if(this.directionY === "DOWN"){
      y = this.y - distance;
    }

    // x, y 축에서 이동한 거리 계산
    // return {x,y};
    return {x : this.x + 10,y : this.y+10};
  }
}

export default User;
