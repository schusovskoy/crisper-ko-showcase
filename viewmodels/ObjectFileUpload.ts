import { ViewModel } from "crisper.ko/annotations/ViewModel";
import { Required } from "crisper.di/annotations/Required";
import { FileObject } from "../models/entities/FileObject";
import { Interface } from "crisper.std/Interface";
import { IFilesService } from "../models/services/interfaces/IFilesService";
import { Alert } from "./Alert";
import { REObject } from "../models/entities/REObject";
import { Crisper } from "crisper.di/Crisper";
import { Throws } from "crisper.ko/interceptors/exceptionshandler/Throws";
import { IExceptionsHandler } from "crisper.ko/interceptors/exceptionshandler/IExceptionsHandler";
import { Catch } from "crisper.ko/interceptors/exceptionshandler/Catch";
import { Exception } from "crisper.std/Exception";

@ViewModel("object-file-upload")
export class ObjectFileUpload implements IExceptionsHandler {
    @Required("reObject")
    public reObject: REObject;
    @Required(new Interface<IFilesService>("IFilesService"))
    private filesService: IFilesService;
    @Required()
    private alert: Alert;
    @Required()
    private context: Crisper;
    
    public delete(index: number): void {
        const files: KnockoutObservableArray<FileObject> =
            this.reObject.getObservableFor<KnockoutObservableArray<FileObject>>("files");
        if (files.splice(index, 1)[0].avatar && files().length)
            files()[0].avatar = true;
    }
    
    public check(index: number): void {
        const files: KnockoutObservableArray<FileObject> =
            this.reObject.getObservableFor<KnockoutObservableArray<FileObject>>("files");
        files().forEach((file: FileObject) => file.avatar = false);
        files()[index].avatar = true;
    }
    
    @Throws()
    public async upload(vm: ObjectFileUpload, event: JQueryEventObject): Promise<void> {
        const files: KnockoutObservableArray<FileObject> =
            this.reObject.getObservableFor<KnockoutObservableArray<FileObject>>("files");
        const file: FileObject = this.context.get(FileObject);
        file.tmpPath = URL.createObjectURL((<HTMLInputElement> event.target).files[0]);
        
        files().forEach((file: FileObject) => file.avatar = false);
        files.push(file);
        file.path = await this.filesService.upload((<HTMLInputElement> event.target).files[0],
                                                   progress => file.progress = progress);
    }
    
    @Catch([Exception])
    private catchFileUploadErrors(): boolean {
        const files: KnockoutObservableArray<FileObject> =
            this.reObject.getObservableFor<KnockoutObservableArray<FileObject>>("files");
        this.alert.header = "Загрузка файла";
        this.alert.showCancel = false;
        this.alert.text = "Ошибка загрузки фото";
        this.alert.show();
        files.pop();
        return true;
    }
    
    implementsIExceptionsHandler() {}
}