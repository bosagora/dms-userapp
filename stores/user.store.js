import { makeAutoObservable } from 'mobx';

export const AUTH_STATE = {
  INIT: 'INIT',
  PERMISSIONS: 'PERMISSIONS',
  TERM: 'TERM',
  PIN: 'PIN',
  SECRET: 'SECRET',
  PHONE: 'PHONE',
  DONE: 'DONE',
};

class UserStore {
  state = '';
  name = '';
  email = '';
  phone = '';
  countryPhoneCode = '';
  country = '';
  lang = '';
  langTag = '';
  currency = '';

  phoneFormatted = '';

  enableBio = false;

  permissionsCount = 0;
  expoPushToken = '';

  loading = false;

  walletInterval = 0;

  constructor() {
    makeAutoObservable(this);
  }

  reset(){
    this.state = '';
    this.name = '';
    this.email = '';
    this.phone = '';
    this.countryPhoneCode = '';
    this.country = '';
    this.lang = '';
    this.langTag = '';
    this.currency = '';
    this.phoneFormatted = '';
    this.enableBio = false;
    this.permissionsCount = 0;
    this.expoPushToken = '';
    this.loading = false;
    this.walletInterval =0;
  }

  setAuthState = (state) => {
    this.state = state;
  };
  setUserName = (name) => {
    this.name = name;
  };

  setEmail = (email) => {
    this.email = email;
  };

  setPhone = (phone) => {
    this.phone = phone;
  };
  setCountryPhoneCode = (code) => {
    this.countryPhoneCode = code;
  };
  setCountry = (country) => {
    this.country = country;
  };

  setCurrency = (currency) => {
    this.currency = currency;
  };
  setLang = (lang) => {
    this.lang = lang;
  };
  setLangTag = (langTag) => {
    this.langTag = langTag;
  };
  setEnableBio = (enableBio) => {
    this.enableBio = enableBio;
  };

  setPermissionsCount = () => {
    this.permissionsCount = this.permissionsCount + 1;
  };

  setExpoPushToken = (token) => {
    this.expoPushToken = token;
  };
  setLoading = (loading) => {
    this.loading = loading;
  };

  setPhoneFormatted = (pf) => {
    this.phoneFormatted = pf;
  }
  setWalletInterval = (intv) => {
    this.walletInterval = intv;
  }
}

export default UserStore;
