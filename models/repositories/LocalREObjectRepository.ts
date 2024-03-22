import { ILocalREObjectRepository } from "./interfaces/ILocalREObjectRepository";
import { IREObject } from "../entities/interfaces/IREObject";

export class LocalREObjectRepository implements ILocalREObjectRepository {
    public save(objects: Array<IREObject>): void {
        localStorage.setItem("favorites", JSON.stringify(objects));
    }
    
    public get(): Array<IREObject> {
        const result: Array<IREObject> = JSON.parse(localStorage.getItem("favorites"));
        return result ? result : [];
    }
    
    implementsILocalREObjectRepository() {}
}