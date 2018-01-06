import Base from './Base';
declare class Tools extends Base {
    promisify(method: any): (params?: {}) => this;
    value(): any;
    text: () => Promise<any>;
    append: (text: any, args?: {}) => Promise<{}>;
    getSignedUrl(operation?: string, params?: {}): Promise<{}>;
    streamUpload(stream: any, {tags, ...rest}?: {
        tags?: any;
    }): Promise<{}>;
    streamObject(params?: {}): this;
    createTagSet: (data: any) => string;
    update(params?: {}, AwsConfig?: {}): this;
}
export default Tools;
