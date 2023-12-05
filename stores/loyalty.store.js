import { makeAutoObservable } from 'mobx';

class LoyaltyStore {
  boa = {};
  kios = {};
  payment = {};

  constructor() {
    makeAutoObservable(this);
  }

  setBoa = (boa) => {
    this.boa = boa;
  };

  setKios = (kios) => {
    this.kios = kios;
  };

  setPayment = (payment) => {
    this.payment = payment;
  };
}

export default LoyaltyStore;
