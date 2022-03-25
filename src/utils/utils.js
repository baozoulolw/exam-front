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

export function getObjByType(list, key, value,deep=true) {
  let obj = '';
  list.some(i => {
    if (i[key] === value) {
      obj = deep ? deepCloneObj(i):i;
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

export function dateFormat (date, format) {
  /*date = new Date(date);
  date.setHours(date.getHours()-14);
  let o = {
    'M+' : date.getMonth() + 1, //month
    'd+' : date.getDate(), //day
    'H+' : date.getHours(), //hour
    'm+' : date.getMinutes(), //minute
    's+' : date.getSeconds(), //second
    'q+' : Math.floor((date.getMonth() + 3) / 3), //quarter
    'S' : date.getMilliseconds() //millisecond
  };

  if (/(y+)/.test(format))
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));

  for (let k in o)
    if (new RegExp('(' + k + ')').test(format)){
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  return format;*/
  var date = new Date(date);
  var YY = date.getFullYear() + '-';
  var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return YY + MM + DD +" "+hh + mm + ss;
}