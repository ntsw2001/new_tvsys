const USER_KEY = "u_name";
const USER_ID = "u_ID";
const TOKEN_KEY = "token";
const AUTH_KEY = "u_auth";

class Auth {
  constructor() {
    this.uid = null;
    this.user = null;
    this.token = null;
    this.auth = null;
    this.user_local = localStorage.getItem(USER_KEY);
    this.token = localStorage.getItem(TOKEN_KEY);

    if (this.user_local) {
      this.user = this.user_local;
      this.auth = localStorage.getItem(AUTH_KEY);
      this.uid = localStorage.getItem(USER_ID);
    }
  }

  // 保证全局仅一个 Auth 对象，保证权限唯一。
  static getInstance() {
    if (!this._instance) {
      this._instance = new Auth();
    }
    return this._instance;
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem(TOKEN_KEY, token);
  }

  setUser(user, uid) {
    this.user = user;
    this.uid = uid;
    localStorage.setItem(USER_KEY, user);
    localStorage.setItem(USER_ID, uid);
  }

  setAuth(uauth) {
    this.auth = uauth;
    localStorage.setItem(AUTH_KEY, uauth);
  }

  rmAll() {
    this.user = null;
    this.token = null;
    this.auth = null;
    this.uid = null;
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(USER_ID);
  }

  get isLogged() {
    if (this.user && this.token && this.auth && this.uid) {
      return true;
    }
    return false;
  }

  get isAdmin() {
    if (this.auth == 6) {
      return true;
    }
    return false;
  }
}

export default Auth.getInstance();