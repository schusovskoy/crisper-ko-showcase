import { Router } from "crisper.ko/annotations/Router";
import { Url } from "crisper.ko/annotations/Url";
import { Required } from "crisper.di/annotations/Required";
import { Navigation as NavigationVM } from "../viewmodels/Navigation";

@Router()
export class Navigation {
    @Required()
    private navigation: NavigationVM;
    
    @Url("/")
    public root(): void {
        this.navigation.switchPage("START");
    }
    
    @Url("/add")
    public add(): void {
        this.navigation.switchPage("ADD_OBJECT");
    }
    
    @Url("/find")
    public find(): void {
        this.navigation.switchPage("OBJECTS_LIST");
    }
    
    @Url("/find/my")
    public myObjects(): void {
        this.navigation.switchPage("MY_OBJECTS");
    }
    
    @Url("/find/my/:id")
    public myView(context: Sammy.EventContext): void {
        this.navigation.switchPage("MY_OBJECT_VIEWER", context.params.id);
    }
    
    @Url("/find/:id")
    public view(context: Sammy.EventContext): void {
        this.navigation.switchPage("OBJECT_VIEWER", context.params.id);
    }
    
    @Url("/edit/:id")
    public edit(context: Sammy.EventContext): void {
        this.navigation.switchPage("EDIT", context.params.id);
    }
    
    @Url("/favorites")
    public favorites(): void {
        this.navigation.switchPage("FAVORITES");
    }
    
    @Url("/favorites/:id")
    public favView(context: Sammy.EventContext): void {
        this.navigation.switchPage("FAV_OBJECT", context.params.id);
    }
}