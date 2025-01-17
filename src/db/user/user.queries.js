export const SQL_QUERIES = {
  FIND_USER_BY_DEVICE_ID: 'SELECT * FROM user WHERE device_id = ?',
  CREATE_USER: 'INSERT INTO user (id, device_id) VALUES (?, ?)',
  UPDATE_USER_LOGIN: 'UPDATE user SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
  CREATE_USER_LAST_LOCATION : 'INSERT INTO user_last_location (user_id,x,y) VALUES (?, ?, ?)',
  UPDATE_USER_LAST_LOCATION : 'UPDATE user_last_location SET x = ?, y = ? , update_time = CURRENT_TIMESTAMP WHERE user_id = ?',
  FIND_USER_LAST_LOCATION : 'SELECT user_id, x, y FROM user_last_location WHERE user_id = ?',
};
