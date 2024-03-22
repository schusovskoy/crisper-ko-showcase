import { ViewModel } from "crisper.ko/annotations/ViewModel";
import { IObservable } from "crisper.ko/interceptors/observable/IObservable";
import { Observable } from "crisper.ko/interceptors/observable/Observable";

//noinspection JSAnnotator
@ViewModel("auth")
export class Auth implements IObservable {
	@Observable() public isShown: boolean = false;
    @Observable() public page: string = "SIGNIN";
	
	public show(): void { this.isShown = true; }
	
	public hide(): void { this.isShown = false; }
	
	implementsIObservable() {}
}