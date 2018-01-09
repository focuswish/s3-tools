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
        this.value = () => this.promise();
        this.text = () => this.promise()
            .then(value => value.Body.toString('ascii'));
        this.append = (text, args = {}) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.get(args).text();
            let stream = new stream_1.Readable;
            stream.push(data);
            stream.push((typeof text === 'string' ? text : text.join('\n')) + '\n');
            stream.push(null);
            this.streamUpload(stream, args);
            return this.upload.promise();
        });
        this.get = (...args) => this.promisify('getObject')(...args);
        this.remove = (...args) => this.promisify('deleteObject')(...args);
        this.getSignedUrl = (...args) => this.promisify('getSignedUrl')(...args);
        this.copy = (...args) => this.promisify('copyObject')(...args);
        this.wait = (...args) => this.promisify('waitFor')(...args);
        this.createTagSet = (data) => helpers_1.createTagSet(data);
    }
    promisify(method) {
        return (...args) => {
            if (!args.length)
                args.push({});
            args[args.length - 1] = helpers_1.capKeys(Object.assign({}, this.params, args[args.length - 1]));
            let promise = new Promise((...promise) => {
                args.push((err, data) => {
                    if (err)
                        promise[1](err);
                    else
                        promise[0](data);
                });
            });
            this.s3[method](...args);
            this.promise = () => promise;
            return this;
        };
    }
    streamUpload(stream, _a = {}) {
        var { tags = undefined } = _a, rest = __rest(_a, ["tags"]);
        const run = () => {
            let Body = new stream_1.PassThrough();
            AWS.config.update(this.AwsConfig);
            this.upload = new AWS.S3.ManagedUpload({
                tags,
                params: Object.assign({ Body }, helpers_1.capKeys(Object.assign({}, this.params, rest)))
            });
            this.upload.send();
            return Body;
        };
        stream.pipe(run());
        return this.upload;
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
exports.Tools = Tools;
//# sourceMappingURL=Tools.js.map