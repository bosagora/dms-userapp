import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';

export class SampleStore {
    someProperty = [];

    constructor() {
        makeAutoObservable(this);

        makePersistable(this, { name: 'SampleStore', properties: ['someProperty'], storage: window.localStorage });
    }
}