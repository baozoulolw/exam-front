import Cookies from "js-cookie";
import {CodeToText} from 'element-china-area-data'

export function transElIconName(iconName) {
  return 'i' + iconName.replace(/[A-Z]/g, (match) => '-' + match.toLowerCase())
}

export function getToken() {
  return Cookies.get("token")
}

export function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

export function getAddressStringByCode(arr) {
  if (arr.length === 0) {
    return '---'
  } else {
    return arr.reduce((p, i) => p += CodeToText[i], '');
  }
}

export function getObjByType(list, key, value) {
  let obj = '';
  list.some(i => {
    if (i[key] === value) {
      obj = deepCloneObj(i)
      return true;
    }
  })
  return obj;
}

export function deepCloneObj(obj) {
  let objClone = Array.isArray(obj) ? [] : {};
  if (obj && typeof obj === 'object') {
    for (let key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        objClone[key] = deepCloneObj(obj[key]);
      } else {
        objClone[key] = obj[key]
      }
    }
  }
  return objClone;
}