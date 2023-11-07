import { makeAutoObservable } from 'mobx';

class SecretStore {
  pKey = '';
  address = '';
  mnemonic = '';

  constructor() {
    makeAutoObservable(this);
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
}

export default SecretStore;
