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
  countryPhoneCode = '82';
  country = 'KR';
  lang = 'ko';
  langTag = 'ko-KR';
  currency = 'KRW';

  enableBio = false;

  permissionsCount = 0;
  expoPushToken = '';

  constructor() {
    makeAutoObservable(this);
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
}

export default UserStore;
