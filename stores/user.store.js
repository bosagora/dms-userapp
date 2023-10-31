
import { makeAutoObservable, action } from "mobx";

class UserStore {
    name = "";

    constructor() {
        makeAutoObservable(this);
    }

    setUserName = (name) => {
        this.name = name;
    };
}

export default UserStore;