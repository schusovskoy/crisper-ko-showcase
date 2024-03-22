import { REObject } from "../../entities/REObject";
import { User } from "../../entities/User";
import { REObjectRequest } from "../../entities/REObjectRequest";
import { IREObject } from "../../entities/interfaces/IREObject";
import { IREObjectRequest } from "../../entities/interfaces/IREObjectRequest";

export interface IREObjectsService {
    save(object: REObject, profile: User): Promise<void>;
    update(object: REObject, profile: User): Promise<void>;
    get(reRequest: REObjectRequest, page: number, size: number,
        reObjectsCollection: KnockoutObservableArray<IREObject>): Promise<[number, number]>;
    getById(id: string): Promise<IREObject>;
    getForEdit(id: string): Promise<IREObject>;
    getMarkers(reRequest: REObjectRequest): Promise<Array<IREObject>>;
    getMy(user: User): Promise<Array<IREObject>>;
    saveFavorites(favorites: Array<IREObject>): void;
    getFavorites(): Array<IREObject>;
    saveRequest(request: REObjectRequest, user: User): Promise<void>;
    getRequests(user: User): Promise<Array<IREObjectRequest>>;
    remove(id: string, user: User): Promise<void>;
    removeRequest(id: string, user: User): Promise<void>;
    implementsIREObjectsService?();
}