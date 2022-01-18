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

export function getAddressStringByCode(arr){
  if(arr.length  === 0){
    return '---'
  }else{
    return arr.reduce((p,i) => p+=CodeToText[i],'');
  }
}