import { v4 as uuidv4 } from 'uuid';
import pools from '../database.js';
import { SQL_QUERIES } from './user.queries.js';
import { toCamelCase } from '../../utils/transformCase.js';

export const findUserByDeviceID = async (deviceId) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_DEVICE_ID, [deviceId]);
  return toCamelCase(rows[0]);
};

export const createUser = async (deviceId) => {
  const id = uuidv4();
  await pools.USER_DB.query(SQL_QUERIES.CREATE_USER, [id, deviceId]);
  return { id, deviceId };
};

export const updateUserLogin = async (id) => {
  await pools.USER_DB.query(SQL_QUERIES.UPDATE_USER_LOGIN, [id]);
};

export const createUserLastLocation = async (id,x,y) =>{
  await pools.USER_DB.query(SQL_QUERIES.CREATE_USER_LAST_LOCATION, [id,x,y]);
}

export const updateUserLastLocation = async (id,x,y) =>{
  await pools.USER_DB.query(SQL_QUERIES.UPDATE_USER_LAST_LOCATION, [x,y,id]);
}

export const findUserLastLocationByUserId = async (userId) => {
  const [rows] = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_LAST_LOCATION, [userId]);
  return toCamelCase(rows[0]);
}

