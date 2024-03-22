import { ViewModel } from "crisper.ko/annotations/ViewModel";
import { IObservable } from "crisper.ko/interceptors/observable/IObservable";
import { Observable } from "crisper.ko/interceptors/observable/Observable";

@ViewModel("photo-viewer")
export class PhotoViewer implements IObservable {
    @Observable() public isShown: boolean = false;
    @Observable() public photos: Array<string> = [];
    @Observable() public selected: string;
    
    public show(photos: Array<string>, selected: string): void {
        this.isShown = true;
        this.photos = photos;
        this.selected = selected;
    }
    
    public close(): void {
        this.isShown = false;
    }
    
    public left(): void {
        if (this.photos.indexOf(this.selected) != 0) this.selected = this.photos[this.photos.indexOf(this.selected) - 1];
    }
    
    public right(): void {
        if (this.photos.indexOf(this.selected) != this.photos.length - 1)
            this.selected = this.photos[this.photos.indexOf(this.selected) + 1];
    }
    
    public getObservableFor<T extends KnockoutSubscribable<any>>(key: string): T { return null; }
    
    implementsIObservable() {}
}