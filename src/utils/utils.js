import Cookies from "js-cookie";

export function transElIconName(iconName) {
  return 'i' + iconName.replace(/[A-Z]/g, (match) => '-' + match.toLowerCase())
}

export function getToken() {
  return Cookies.get("token")
}

export function getUser() {
  return JSON.parse(Cookies.get("user"));
}