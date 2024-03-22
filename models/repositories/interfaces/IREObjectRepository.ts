import { REObject } from "../../entities/REObject";
import { User } from "../../entities/User";
import { IREObject } from "../../entities/interfaces/IREObject";
import { REObjectRequest } from "../../entities/REObjectRequest";
import { IREObjectRequest } from "../../entities/interfaces/IREObjectRequest";

export interface IREObjectRepository {
    save(object: REObject, profile: User): Promise<void>;
    update(object: REObject, profile: User): Promise<void>;
    get(reRequest: REObjectRequest, page: number, size: number): Promise<[number, number, Array<IREObject>]>;
    getById(id: string): Promise<IREObject>
    getMarkers(reRequest: REObjectRequest): Promise<Array<IREObject>>;
    getMy(user: User): Promise<Array<IREObject>>;
    saveRequest(request: REObjectRequest, user: User): Promise<void>;
    getRequests(user: User): Promise<Array<IREObjectRequest>>;
    remove(id: string, user: User): Promise<void>;
    removeRequest(id: string, user: User): Promise<void>;
    implementsIREObjectRepository?();
}