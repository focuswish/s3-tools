"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringify = require('lowdb/adapters/_stringify');
class Base {
    constructor(source, { defaultValue = {}, serialize = stringify, deserialize = JSON.parse } = {}) {
        this.source = source;
        this.defaultValue = defaultValue;
        this.serialize = serialize;
        this.deserialize = deserialize;
    }
}
class Adapter extends Base {
    read() {
        let data = this.source.promisify('getObject')().text().data;
        return data ? this.deserialize(data) : this.defaultValue;
    }
    write() {
    }
}
exports.default = Adapter;
//# sourceMappingURL=Adapter.js.map