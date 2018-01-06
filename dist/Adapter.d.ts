import Base from 'lowdb/adapters/Base';
interface Adapter {
    source: any;
    deserialize: any;
    defaultValue: any;
}
declare class Adapter extends Base {
    read(): any;
    write(): void;
}
export default Adapter;
