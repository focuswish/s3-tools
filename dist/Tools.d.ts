import Base from './Base';
declare class Tools extends Base {
    promisify(method: any): (...args: any[]) => this;
    value: () => any;
    text: () => any;
    append: (text: any, args?: {}) => Promise<any>;
    get: (...args: any[]) => this;
    remove: (...args: any[]) => this;
    getSignedUrl: (...args: any[]) => this;
    copy: (...args: any[]) => this;
    wait: (...args: any[]) => this;
    streamUpload(stream: any, {tags, ...rest}?: {
        tags?: any;
    }): any;
    streamObject(params?: {}): this;
    createTagSet: (data: any) => string;
    update(params?: {}, AwsConfig?: {}): this;
}
export default Tools;
