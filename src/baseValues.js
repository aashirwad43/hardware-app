export const BASE_URL = "https://satshree.pythonanywhere.com";
export const APP_KEY = "6117160db3031c067ae97f06a216ebb4c64f9a978956e63c75f19c824f8b59e8a92c038d2ec9e5b5c1d6ee023212b6f26a8ceb07954cec05e902d278a7b6cf1a";
export const EXPIRY = () => {
    let expiryTime = new Date(Date.now() + (15 * 60000)).getTime(); // 15 Minutes
    return expiryTime;
};