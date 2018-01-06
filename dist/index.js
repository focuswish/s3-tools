"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const AWS = require("aws-sdk");
const helpers_1 = require("./helpers");
var concat = require('concat-stream');
Base.prototype.promisify = function (method) {
    return (params = {}) => {
        this.data = new Promise((resolve, reject) => {
            this.s3[method](helpers_1.capitalize(Object.assign({}, this.params, params)), (err, data) => {
                if (err)
                    reject(err);
                else
                    resolve(data);
            });
        });
        return this;
    };
};
Base.prototype.text = function () {
    this.data = this.data.then(resp => resp.Body.toString('ascii'));
    return this;
};
Base.prototype.append = function (text, args) {
    return this.promisify('getObject')(args).text().data
        .then(data => {
        let stream = new stream_1.Readable;
        stream.push(data);
        stream.push(typeof text === 'string' ? text += '\n' :
            text.join('\n'));
        stream.push(null);
        return this.streamUpload(stream, args).data;
    });
};
Base.prototype.getSignedUrl = function (operation = 'getObject', params = {}) {
    return new Promise((resolve, reject) => {
        return this.s3.getSignedUrl(operation, helpers_1.capitalize(Object.assign({}, this.params, params)), (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
};
Base.prototype.streamUpload = function (stream, args) {
    let { tags } = args, rest = __rest(args, ["tags"]);
    const run = (resolve, reject) => {
        const Body = new stream_1.PassThrough();
        let params = {
            params: Object.assign({ Body }, helpers_1.capitalize(Object.assign({}, this.params, rest))),
            tags: tags ?
                tags : undefined
        };
        AWS.config.update(this.AwsConfig);
        let upload = new AWS.S3.ManagedUpload(params);
        upload.send((err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
        return Body;
    };
    this.data = new Promise((resolve, reject) => stream.pipe(run(resolve, reject)));
    return this;
};
Base.prototype.streamObject = function (params = {}) {
    this.stream = this.s3.getObject(helpers_1.capitalize(Object.assign({}, this.params, params)))
        .createReadStream();
    return this;
};
Base.prototype.createTagSet = function (data) {
    const tags = Object.keys(data).map(key => `<Tag><Key>${key}</Key><Value>${data[key]}</Value></Tag>`);
    return `<Tagging><TagSet>${tags.join('')}</TagSet></Tagging>`;
};
Base.prototype.update = function (params = {}, AwsConfig = {}) {
    this.params = Object.assign({}, this.params, { params });
    this.AwsConfig = Object.assign({}, this.AwsConfig, { AwsConfig });
    return this;
};
function Base(params = {}, AwsConfig = {}) {
    this.AwsConfig = Object.assign({ region: process.env.AWS_S3_BUCKET_REGION || 'us-east-1' }, AwsConfig);
    this.params = params;
    this.s3 = new AWS.S3(this.AwsConfig);
}
module.exports = (a, b) => new Base(a, b);
exports.default = (a, b) => new Base(a, b);
//# sourceMappingURL=index.js.map