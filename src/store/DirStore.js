import { makeAutoObservable } from "mobx"

export default class DirStore {
    constructor() {
        
        this._dir = '/uploads/'
        makeAutoObservable(this)
    }

    

    setDir(dir) {
        this._dir = dir
    }


    get Dir() {
        return this._dir
    }


}