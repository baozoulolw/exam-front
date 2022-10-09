import Cookies from "js-cookie";
import $store from '../store/index'
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
  var date = new Date(date);
  var YY = date.getFullYear() + '-';
  var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return YY + MM + DD +" "+hh + mm + ss;
}

export function stringToDate (s) {
  let d = new Date();
  d.setFullYear(parseInt(s.substring(0,4),10));
  d.setMonth(parseInt(s.substring(5,7)-1,10));
  d.setDate(parseInt(s.substring(8,10),10));
  d.setHours(parseInt(s.substring(11,13),10));
  d.setMinutes(parseInt(s.substring(14,16),10));
  d.setSeconds(parseInt(s.substring(17,19),10));
  return d;
}

export function checkHasRole(keys) {
  let plat = Cookies.get('platform');
  let key = keys[plat];
  let roleTree = $store.state.roleTree;
  let check = function (tree,key){
    if(tree && tree.length > 0){
      return tree.some(i => {
        if(i.onlyKey === key){
          return true;
        }else{
          return check(i.children,key)
        }
      })
    }else{
      return false;
    }
  }
  return check(roleTree, key);
}