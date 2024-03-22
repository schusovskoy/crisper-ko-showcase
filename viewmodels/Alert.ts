import { ViewModel } from "crisper.ko/annotations/ViewModel";
import { IObservable } from "crisper.ko/interceptors/observable/IObservable";
import { Observable } from "crisper.ko/interceptors/observable/Observable";

//noinspection JSAnnotator
@ViewModel("alert")
export class Alert implements IObservable {
    @Observable() public isShown: boolean = false;
    @Observable() public header: string = "";
    @Observable() public text: string = "";
    @Observable() public showCancel: boolean = false;
    private result: KnockoutObservable<boolean> = ko.observable(false).extend({ notify: "always" });
    
    public show(): Promise<boolean> {
        this.isShown = true;
        
        return new Promise((resolve: (result: any) => void) => {
            var subscription: KnockoutSubscription = this.result.subscribe((value: boolean) => {
                resolve(value);
                subscription.dispose();
            });
        });
    }
    
    public ok(): void {
        this.result(true);
        this.isShown = false;
    }
    
    public cancel(): void {
        this.result(false);
        this.isShown = false;
    }
    
    implementsIObservable() {}
}