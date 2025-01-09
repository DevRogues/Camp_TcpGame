/**
 * 게임 인스턴스에는 유저들이 속해있고 각 유저들의 인터벌(핑)을 관리하는 매니저를 만들어 주기용
 * 각종 매니저들의 부모클래스
 */

class BaseManager {
  constructor() {
    if (new.target === BaseManager) {
      throw new TypeError('Cannot construct BaseManager instances directly');
    }
  }

  addPlayer(playerId, ...args) {
    throw new Error('Must implement addPlayer method');
  }

  removePlayer(playerId) {
    throw new Error('Must implement removePlayer method');
  }

  clearAll() {
    throw new Error('Must implement clearAll method');
  }
}

export default BaseManager;
