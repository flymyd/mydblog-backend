import {makeAutoObservable} from 'mobx'
import App from "@/App";

class AppState {
  constructor() {
    makeAutoObservable(this)
  }

  token = localStorage.getItem("token") ? localStorage.getItem("token") : "";

  setToken = (token: string) => {
    this.token = token;
    localStorage.setItem("token", token);
  }
}

export default new AppState()