export const BASE_URL = "https://bike-tracker-nepal.herokuapp.com";
export const APP_KEY = "18cb3006db036243b55133a99f8175f327e9e283aa9071aff17850523c81b2a6e814eb3d0a9989dcf728f4f0625fae29816fd4093a6b0de08087731510a1b02c";
export const EXPIRY = () => {
    let expiryTime = new Date(Date.now() + (15 * 60000)).getTime(); // 15 Minutes
    return expiryTime;
};