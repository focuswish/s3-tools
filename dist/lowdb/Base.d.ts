interface Base {
    source: any;
    defaultValue: any;
    serialize: any;
    deserialize: any;
}
declare class Base {
    constructor(params?: {}, AwsConfig?: {}, {defaultValue, serialize, deserialize}?: {
        defaultValue?: {};
        serialize?: any;
        deserialize?: (text: string, reviver?: (key: any, value: any) => any) => any;
    });
}
export default Base;
