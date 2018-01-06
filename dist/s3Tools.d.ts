import Base from './S3';
declare class s3Tools extends Base {
    promisify(method: any): (params?: {}) => this;
    text(): this;
    append: (text: any, args: any) => any;
    getSignedUrl(operation?: string, params?: {}): Promise<{}>;
    streamUpload(stream: any, args: any): this;
    streamObject(params?: {}): this;
    createTagSet: (data: any) => string;
    update(params?: {}, AwsConfig?: {}): this;
}
export default s3Tools;
