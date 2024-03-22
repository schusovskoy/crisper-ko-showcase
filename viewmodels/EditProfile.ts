import { ViewModel } from "crisper.ko/annotations/ViewModel";
import { IObservable } from "crisper.ko/interceptors/observable/IObservable";
import { Observable } from "crisper.ko/interceptors/observable/Observable";
import { Required } from "crisper.di/annotations/Required";
import { User } from "../models/entities/User";
import { Interface } from "crisper.std/Interface";
import { IFilesService } from "../models/services/interfaces/IFilesService";
import { IProfileService } from "../models/services/interfaces/IProfileService";
import { Exception } from "crisper.std/Exception";
import { Catch } from "crisper.ko/interceptors/exceptionshandler/Catch";
import { RequestException } from "crisper.ko/asyncrequest/exceptions/RequestException";
import { Throws } from "crisper.ko/interceptors/exceptionshandler/Throws";
import { IExceptionsHandler } from "crisper.ko/interceptors/exceptionshandler/IExceptionsHandler";

//noinspection JSAnnotator
@ViewModel("edit-profile")
export class EditProfile implements IObservable, IExceptionsHandler {
    @Observable() public isShown: boolean = false;
    @Observable() public active: boolean = false;
    @Required("editableUser")
    public editableUser: User;
    @Required("profileErrors")
    public profileErrors: User;
    @Required("profile")
    private profile: User;
    @Required(new Interface<IFilesService>("IFilesService"))
    private filesService: IFilesService;
    @Required(new Interface<IProfileService>("IProfileService"))
    private profileService: IProfileService;
    
    public show(): void {
        this.profileErrors.update({ fio: "", phone: "", password: "" });
        this.editableUser.updateData(this.profile);
        this.editableUser.photo.tmpPath = this.profile.photo.path ? `${this.profile.photo.path}/s.jpg` : "/resources/images/default_avatar.jpg";
        this.editableUser.photo.progress = 1;
        this.editableUser.password = "";
        this.editableUser.second = "";
        this.isShown = true;
    }
    
    public hide(): void { this.isShown = false; }
    
    @Throws()
    public async upload(vm: EditProfile, event: JQueryEventObject): Promise<void> {
        this.active = true;
        this.editableUser.photo.progress = 0;
        this.editableUser.photo.tmpPath = URL.createObjectURL((<HTMLInputElement> event.target).files[0]);
        this.editableUser.photo.path = await this.filesService.upload((<HTMLInputElement> event.target).files[0],
                                                                      progress => this.editableUser.photo.progress = progress);
        this.active = false;
    }
    
    public clearError(vm: EditProfile, event: JQueryEventObject): void {
        this.profileErrors[event.target.getAttribute("name")] = "";
    }
    
    @Throws()
    public async save(): Promise<void> {
        if (this.active) return;
        this.active = true;
        this.profileErrors.update({ fio: "", phone: "", password: "" });
        await this.profileService.update(this.editableUser, this.profile);
        this.active = false;
        this.hide();
    }
    
    @Catch([RequestException])
    private catchValidationErrors(exception: RequestException): boolean {
        if (exception.getStatus() != 400) return false;
        this.active = false;
        this.profileErrors.update(JSON.parse(exception.getMessage()));
        return true;
    }
    
    @Catch([Exception])
    private catchException(): boolean {
        this.active = false;
        return false;
    }
    
    implementsIObservable() {}
    implementsIExceptionsHandler() {}
}