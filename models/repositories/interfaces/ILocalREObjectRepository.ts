import { IREObject } from "../../entities/interfaces/IREObject";

export interface ILocalREObjectRepository {
    save(objects: Array<IREObject>): void;
    get(): Array<IREObject>;
    implementsILocalREObjectRepository?();
}