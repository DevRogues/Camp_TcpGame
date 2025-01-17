import IntervalManager from '../managers/interval.manager.js';
import {
  createLocationPacket,
} from '../../utils/notification/game.notification.js';

const MAX_PLAYERS = 4;

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.intervalManager = new IntervalManager();
  }

  addUser(user) {
    if (this.users.length >= MAX_PLAYERS) {
      throw new Error('Game session is full');
    }
    this.users.push(user);

    this.intervalManager.addPlayer(user.id, user.ping.bind(user), 1000);
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  removeUser(userId) {
    this.users = this.users.filter((user) => user.id !== userId);
    this.intervalManager.removePlayer(userId);
  }

  // 레이턴시 최대 값
  getMaxLatency() {
    let maxLatency = 0;
    this.users.forEach((user) => {
      maxLatency = Math.max(maxLatency, user.latency);
    });
    return maxLatency;
  }

  startGame() {
    this.state = 'inProgress';
    const startPacket = gameStartNotification(this.id, Date.now());
    console.log('## MaxLatency : ', this.getMaxLatency());

    this.users.forEach((user) => {
      user.socket.write(startPacket);
    });
  }

  getAllLocation(userId) {
    const maxLatency = this.getMaxLatency();
    const locationData = this.users.filter((user) => userId !== user.id).map((user) => {

      // const { x, y } = user.calculatePosition(maxLatency);
      // return { id: user.id, x, y };
      return { id: user.id, x : user.x, y : user.y };
    });
    return createLocationPacket(locationData);
  }
}

export default Game;
