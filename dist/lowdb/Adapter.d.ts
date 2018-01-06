import Base from './Base';
declare class Adapter extends Base {
    read(): Promise<any>;
    write(data: any): Promise<any>;
}
export default Adapter;
