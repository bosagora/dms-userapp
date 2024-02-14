import { makeAutoObservable } from 'mobx';

class SecretStore {
  pKey = '';
  address = '';
  mnemonic = '';

  showQRSheet = false;

  constructor() {
    makeAutoObservable(this);
  }
  reset(){
    this.pKey = '';
    this.address = '';
    this.mnemonic = '';

    this.showQRSheet = false;
  }
  setPKey = (key) => {
    this.pKey = key;
  };

  setAddress = (address) => {
    this.address = address;
  };

  setMnemonic = (mnemonic) => {
    this.mnemonic = mnemonic;
  };

  setShowQRSheet = (show) => {
    this.showQRSheet = show;
  };
}

export default SecretStore;
