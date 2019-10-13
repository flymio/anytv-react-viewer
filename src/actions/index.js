export const REGISTER_USER = 'REGISTER_USER';
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';
export const REGISTER_USER_ERROR = 'REGISTER_USER_ERROR';

export const LOGIN_USER = 'LOGIN_USER';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_ERROR = 'LOGIN_USER_ERROR';


var platform = require('platform');

export const device_info = {
  device_type: 'pc',
  vendor: platform.manufacturer || 'no name',
  model: 'no name',
  version: platform.version,
  os_name: platform.os,
  os_version: 'no version',
};