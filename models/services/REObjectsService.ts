import { IREObjectsService } from "./interfaces/IREObjectsService";
import { User } from "../entities/User";
import { REObject } from "../entities/REObject";
import { Required } from "crisper.di/annotations/Required";
import { Interface } from "crisper.std/Interface";
import { IREObjectRepository } from "../repositories/interfaces/IREObjectRepository";
import { REObjectRequest } from "../entities/REObjectRequest";
import { IREObject } from "../entities/interfaces/IREObject";
import { IFileObject } from "../entities/interfaces/IFileObject";
import { Crisper } from "crisper.di/Crisper";
import { FileObject } from "../entities/FileObject";
import { ILocalREObjectRepository } from "../repositories/interfaces/ILocalREObjectRepository";
import { IREObjectRequest } from "../entities/interfaces/IREObjectRequest";

export class REObjectsService implements IREObjectsService {
    @Required(new Interface<IREObjectRepository>("IREObjectRepository"))
    private reObjectRepository: IREObjectRepository;
    @Required(new Interface<ILocalREObjectRepository>("ILocalREObjectRepository"))
    private localREObjectRepository: ILocalREObjectRepository;
    @Required()
    private container: Crisper;
    
    public save(object: REObject, profile: User): Promise<void> {
        return this.reObjectRepository.save(object, profile);
    }
    
    public update(object: REObject, profile: User): Promise<void> {
        return this.reObjectRepository.update(object, profile);
    }
    
    public async get(reRequest: REObjectRequest, page: number, size: number,
               reObjectsCollection: KnockoutObservableArray<IREObject>): Promise<[number, number]> {
        const [count, pages, objects] = await this.reObjectRepository.get(reRequest, page, size);
        reObjectsCollection.push.apply(reObjectsCollection, objects);
        return <[number, number]> [count, pages];
    }
    
    public getMarkers(reRequest: REObjectRequest): Promise<Array<IREObject>> {
        return this.reObjectRepository.getMarkers(reRequest);
    }
    
    public getById(id: string): Promise<IREObject> {
        return this.reObjectRepository.getById(id);
    }
    
    public async getForEdit(id: string): Promise<IREObject> {
        const object: IREObject = await this.reObjectRepository.getById(id);
        const files: Array<FileObject> = [];
        
        object.files.forEach((file: IFileObject) => {
            file.tmpPath = `${file.path}/s.jpg`;
            file.progress = 1;
            const fileObject: FileObject = this.container.get(FileObject);
            fileObject.update(file);
            files.push(fileObject);
        });
        for (let key in object) {
            if (object[key] == null) object[key] = "";
        }
        object.files = files;
        return object;
    }
    
    public getMy(user: User): Promise<Array<IREObject>> {
        return this.reObjectRepository.getMy(user);
    }
    
    public saveFavorites(favorites: Array<IREObject>): void {
        this.localREObjectRepository.save(favorites);
    }
    
    public getFavorites(): Array<IREObject> {
        return this.localREObjectRepository.get();
    }
    
    public saveRequest(request: REObjectRequest, user: User): Promise<void> {
        return this.reObjectRepository.saveRequest(request, user);
    }
    
    public getRequests(user: User): Promise<Array<IREObjectRequest>> {
        return this.reObjectRepository.getRequests(user);
    }
    
    public remove(id: string, user: User): Promise<void> {
        return this.reObjectRepository.remove(id, user);
    }
    
    public removeRequest(id: string, user: User): Promise<void> {
        return this.reObjectRepository.removeRequest(id, user);
    }
    
    implementsIREObjectsService() {}
}