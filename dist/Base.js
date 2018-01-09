"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
class Base {
    constructor(params = {}, AwsConfig = {}) {
        this.AwsConfig = Object.assign({ region: 'us-east-1' }, AwsConfig);
        this.params = params;
        this.s3 = new AWS.S3(this.AwsConfig);
    }
}
exports.default = Base;
exports.Base = Base;
//# sourceMappingURL=Base.js.map