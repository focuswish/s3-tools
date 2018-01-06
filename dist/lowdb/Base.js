"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringify = require('lowdb/adapters/_stringify');
const s3Tools_1 = require("../s3Tools");
class Base {
    constructor(params = {}, AwsConfig = {}, { defaultValue = {}, serialize = stringify, deserialize = JSON.parse } = {}) {
        this.source = new s3Tools_1.default(params, AwsConfig);
        this.defaultValue = defaultValue;
        this.serialize = serialize;
        this.deserialize = deserialize;
    }
}
exports.default = Base;
//# sourceMappingURL=Base.js.map