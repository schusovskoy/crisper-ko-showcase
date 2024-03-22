import { ViewModel } from "crisper.ko/annotations/ViewModel";
import { IObservable } from "crisper.ko/interceptors/observable/IObservable";
import { Observable } from "crisper.ko/interceptors/observable/Observable";
import { Required } from "crisper.di/annotations/Required";
import { User } from "../models/entities/User";
import { EditProfile } from "./EditProfile";

@ViewModel("profile-viewer")
export class ProfileViewer implements IObservable {
    @Observable() public isShown = false;
    @Required("profile")
    public profile: User;
    @Required()
    public editProfile: EditProfile;
    
    public show(): void { this.isShown = true; }
    
    public hide(): void { this.isShown = false; }
    
    public edit(): void { this.editProfile.show(); }
    
    implementsIObservable() {}
}