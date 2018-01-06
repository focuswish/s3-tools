"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
class Base {
    constructor(params = {}, AwsConfig = {}) {
        this.AwsConfig = Object.assign({ region: process.env.AWS_S3_BUCKET_REGION || 'us-east-1' }, AwsConfig);
        this.params = params;
        this.s3 = new AWS.S3(this.AwsConfig);
    }
}
module.exports = Base;
exports.default = Base;
//# sourceMappingURL=Base.js.map