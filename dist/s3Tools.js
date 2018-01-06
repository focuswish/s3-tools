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
const helpers_1 = require("./helpers");
const S3_1 = require("./S3");
const AWS = require("aws-sdk");
class s3Tools extends S3_1.default {
    constructor() {
        super(...arguments);
        this.append = (text, args) => {
            return this.promisify('getObject')(args).text().data
                .then(data => {
                let stream = new stream_1.Readable;
                stream.push(data);
                stream.push((typeof text === 'string' ? text : text.join('\n')) + '\n');
                stream.push(null);
                return this.streamUpload(stream, args).data;
            });
        };
        this.createTagSet = (data) => {
            const tags = Object.keys(data).map(key => `<Tag><Key>${key}</Key><Value>${data[key]}</Value></Tag>`);
            return `<Tagging><TagSet>${tags.join('')}</TagSet></Tagging>`;
        };
    }
    promisify(method) {
        return (params = {}) => {
            this.data = new Promise((resolve, reject) => {
                this.s3[method](helpers_1.capKeys(Object.assign({}, this.params, params)), (err, data) => {
                    if (err)
                        reject(err);
                    else
                        resolve(data);
                });
            });
            return this;
        };
    }
    text() {
        this.data = this.data.then(resp => resp.Body.toString('ascii'));
        return this;
    }
    getSignedUrl(operation = 'getObject', params = {}) {
        return new Promise((resolve, reject) => {
            return this.s3.getSignedUrl(operation, helpers_1.capKeys(Object.assign({}, this.params, params)), (err, data) => {
                if (err)
                    reject(err);
                else
                    resolve(data);
            });
        });
    }
    streamUpload(stream, args) {
        let { tags } = args, rest = __rest(args, ["tags"]);
        const run = (resolve, reject) => {
            let Body = new stream_1.PassThrough();
            let params = {
                params: Object.assign({ Body }, helpers_1.capKeys(Object.assign({}, this.params, rest))),
                tags: tags ?
                    tags : undefined
            };
            AWS.config.update(this.AwsConfig);
            console.log('params', params);
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
    }
    streamObject(params = {}) {
        this.stream = this.s3.getObject(helpers_1.capKeys(Object.assign({}, this.params, params)))
            .createReadStream();
        return this;
    }
    update(params = {}, AwsConfig = {}) {
        this.params = Object.assign({}, this.params, { params });
        this.AwsConfig = Object.assign({}, this.AwsConfig, { AwsConfig });
        return this;
    }
}
exports.default = s3Tools;
//# sourceMappingURL=s3Tools.js.map