import { IObservable } from "crisper.ko/interceptors/observable/IObservable";
import { Observable } from "crisper.ko/interceptors/observable/Observable";
import { IFileObject } from "./interfaces/IFileObject";
import { IUpdatable } from "crisper.ko/interceptors/updatable/IUpdatable";

//noinspection JSAnnotator
export class FileObject implements IFileObject, IObservable, IUpdatable<IFileObject> {
    @Observable() public progress: number = 0;
    @Observable() public avatar: boolean = true;
    @Observable() public tmpPath: string = null;
    @Observable() public path: string = null;
    
    public clear(): void {
        this.update({ progress: 0, avatar: true, tmpPath: null, path: null });
    }
    
    public update(instance: IFileObject): void {}
    
    implementsIUpdatable() {}
    implementsIFileObject() {}
    implementsIObservable() {}
}