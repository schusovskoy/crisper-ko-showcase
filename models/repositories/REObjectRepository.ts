import { IREObjectRepository } from "./interfaces/IREObjectRepository";
import { User } from "../entities/User";
import { REObject } from "../entities/REObject";
import { AsyncRequest } from "crisper.ko/asyncrequest/AsyncRequest";
import { REObjectRequest } from "../entities/REObjectRequest";
import { IREObject } from "../entities/interfaces/IREObject";
import { IREObjectRequest } from "../entities/interfaces/IREObjectRequest";

export class REObjectRepository implements IREObjectRepository {
    private searchRequest: AsyncRequest = new AsyncRequest();
    private markersRequest: AsyncRequest = new AsyncRequest();
    
    public async save(object: REObject, profile: User): Promise<void> {
        const request: AsyncRequest = new AsyncRequest();
        request.open("POST", "/object");
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        if (profile.token) request.setRequestHeader("X-Auth-Token", profile.token);
        request.timeout = 10000;
        await request.send(object.serializeForSaving());
    }
    
    public async update(object: REObject, profile: User): Promise<void> {
        const request: AsyncRequest = new AsyncRequest();
        request.open("PUT", "/object");
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        if (profile.token) request.setRequestHeader("X-Auth-Token", profile.token);
        request.timeout = 10000;
        await request.send(object.serializeForSaving());
    }
    
    public async get(reRequest: REObjectRequest, page: number, size: number): Promise<[number, number, Array<IREObject>]> {
        this.searchRequest.abort();
        this.searchRequest.open("GET", `/object?${reRequest.serializeUrlEncoded(true, "polygon")}&page=${page}&size=${size}`);
        this.searchRequest.timeout = 10000;
        const result: Array<IREObject> = JSON.parse(await this.searchRequest.send());
        return <[number, number, Array<IREObject>]> [parseInt(this.searchRequest["xhr"].getResponseHeader("X-Pageable-Count")),
                                                     parseInt(this.searchRequest["xhr"].getResponseHeader("X-Pageable-Pages")),
                                                     result];
    }
    
    public async getById(id: string): Promise<IREObject> {
        const request: AsyncRequest = new AsyncRequest();
        request.open("GET", `/object/${id}`);
        const result: string = await request.send();
        return JSON.parse(result);
    }
    
    public async getMarkers(reRequest: REObjectRequest): Promise<Array<IREObject>> {
        this.markersRequest.abort();
        this.markersRequest.open("GET", `/object?${reRequest.serializeWithPolygon()}&page=0&size=100`);
        this.markersRequest.timeout = 10000;
        return JSON.parse(await this.markersRequest.send());
    }
    
    public async getMy(user: User): Promise<Array<IREObject>> {
        const request: AsyncRequest = new AsyncRequest();
        request.open("GET", "/user/object");
        request.setRequestHeader("X-Auth-Token", user.token);
        request.timeout = 10000;
        const result: Array<IREObject> = JSON.parse(await request.send());
        result.forEach(object => {
            if (object.files) {
                const file = object.files.find(file => file.avatar == true);
                object.files = [file];
            }
        });
        return result;
    }
    
    public async saveRequest(reRequest: REObjectRequest, user: User): Promise<void> {
        const request: AsyncRequest = new AsyncRequest();
        request.open("POST", "/request");
        request.setRequestHeader("X-Auth-Token", user.token);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.timeout = 10000;
        await request.send(reRequest.serializeUrlEncoded(true, "polygon"));
    }
    
    public async getRequests(user: User): Promise<Array<IREObjectRequest>> {
        const request: AsyncRequest = new AsyncRequest();
        request.open("GET", "/user/request");
        request.setRequestHeader("X-Auth-Token", user.token);
        request.timeout = 10000;
        return JSON.parse(await request.send());
    }
    
    public async remove(id: string, user: User): Promise<void> {
        const request: AsyncRequest = new AsyncRequest();
        request.open("DELETE", `/object/${id}`);
        request.setRequestHeader("X-Auth-Token", user.token);
        request.timeout = 10000;
        await request.send();
    }
    
    public async removeRequest(id: string, user: User): Promise<void> {
        const request: AsyncRequest = new AsyncRequest();
        request.open("DELETE", `/request/${id}`);
        request.setRequestHeader("X-Auth-Token", user.token);
        request.timeout = 10000;
        await request.send();
    }
    
    implementsIREObjectRepository() {}
}