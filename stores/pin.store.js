import { makeAutoObservable } from 'mobx';

class PinStore {
  mode = 'enter';
  code = '1112';
  visible = true;
  nextScreen = '';
  needPinCode = false;
  successEnter = false;

  constructor() {
    makeAutoObservable(this);
  }

  setMode = (mode) => {
    this.mode = mode;
  };

  setCode = (code) => {
    this.code = code;
  };

  setVisible = (visible) => {
    this.visible = visible;
  };
  setNextScreen = (screen) => {
    this.nextScreen = screen;
  };

  setNeedPinCode = (needPinCode) => {
    this.needPinCode = needPinCode;
  };
  setSuccessEnter = (success) => {
    this.successEnter = success;
  };
}

export default PinStore;
