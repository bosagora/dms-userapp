import { makeAutoObservable } from 'mobx';

class LoyaltyStore {
  boa = {};
  kios = {};

  constructor() {
    makeAutoObservable(this);
  }

  setBoa = (boa) => {
    this.boa = boa;
  };

  setKios = (kios) => {
    this.kios = kios;
  };
}

export default LoyaltyStore;
