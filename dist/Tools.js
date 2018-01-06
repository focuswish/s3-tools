"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const Base_1 = require("./Base");
const AWS = require("aws-sdk");
class Tools extends Base_1.default {
    constructor() {
        super(...arguments);
        this.text = () => __awaiter(this, void 0, void 0, function* () {
            let value = yield this.value();
            return value.Body.toString('ascii');
        });
        this.append = (text, args = {}) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.promisify('getObject')(args).text();
            let stream = new stream_1.Readable;
            stream.push(data);
            stream.push((typeof text === 'string' ? text : text.join('\n')) + '\n');
            stream.push(null);
            return this.streamUpload(stream, args);
        });
        this.createTagSet = (data) => helpers_1.createTagSet(data);
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
    value() {
        return this.data;
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
    streamUpload(stream, _a = {}) {
        var { tags = undefined } = _a, rest = __rest(_a, ["tags"]);
        const run = (resolve, reject) => {
            let Body = new stream_1.PassThrough();
            AWS.config.update(this.AwsConfig);
            let upload = new AWS.S3.ManagedUpload({
                tags,
                params: Object.assign({ Body }, helpers_1.capKeys(Object.assign({}, this.params, rest)))
            });
            upload.send((err, data) => {
                if (err)
                    reject(err);
                else
                    resolve(data);
            });
            return Body;
        };
        return new Promise((resolve, reject) => stream.pipe(run(resolve, reject)));
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
exports.default = Tools;
//# sourceMappingURL=Tools.js.map