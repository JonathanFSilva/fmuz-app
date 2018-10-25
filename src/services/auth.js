import decode from "jwt-decode";

import api from "./api.js";

class AuthService {

  login = async (username, password) => {
    await api.post('auth/authenticate/', {
      username: username,
      password: password
    })
      .then((res) => {
        this.setToken(res.data.token);
        return Promise.resolve(res);
      })
      .catch((err) => {
        return Promise.reject(err);
      });

    if (this.isAuthenticated()) {
      await this.setUserdata();
    }
  };

  setUserdata = async () => {
    const { uid } = decode(this.getToken());

    await api.get(`auth/user/${uid}`)
      .then((res) => {
        localStorage.setItem('@App:data', res.data.token);
        // return Promise.resolve(res);
      })
      .catch((err) => {
        // return Promise.reject(err);
      })
  };

  logout = async () => {
    localStorage.removeItem('@App:token');
    localStorage.removeItem('@App:data');
    localStorage.removeItem('@App:report');
  }

  isAdmin = () => {
    try {
      const { data } = decode(localStorage.getItem('@App:data'));

      return data.is_admin === 1;
    } catch (err) {
      return false;
    }
  };

  isAuthenticated = () => {
    const token = this.getToken();

    return !!token && !this.isExpired(token);
  };

  isExpired = (token) => {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        this.logout();
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  setToken = (token) => {
    localStorage.setItem('@App:token', token);
  };

  getToken = () => {
    return localStorage.getItem('@App:token');
  };

  getProfile = () => {
    try {
      const { data } = decode(localStorage.getItem('@App:data'));
      return data;
    } catch(err) {
      localStorage.removeItem('@App:data');
      localStorage.removeItem('@App:token');
      // console.log(err);
    }
  }

}

export default AuthService;
