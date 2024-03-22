import "./vendors";
import { Config } from "./configuration/Config";
import { Crisper } from "crisper.di/Crisper";
import { ApplicationInitializer } from "crisper.ko/ApplicationInitializer";
import { Interface } from "crisper.std/Interface";
import { IUpdatable } from "crisper.ko/interceptors/updatable/IUpdatable";
import { UpdatableHandler } from "crisper.ko/interceptors/updatable/UpdatableHandler";
import { ISerializable } from "crisper.ko/interceptors/serializable/ISerializable";
import { SerializableHandler } from "crisper.ko/interceptors/serializable/SerializableHandler";
import { IObservable } from "crisper.ko/interceptors/observable/IObservable";
import { ObservableHandler } from "crisper.ko/interceptors/observable/ObservableHandler";
import { IExceptionsHandler } from "crisper.ko/interceptors/exceptionshandler/IExceptionsHandler";
import { ExceptionsHandler } from "crisper.ko/interceptors/exceptionshandler/ExceptionsHandler";

export class MlistingInitializer extends ApplicationInitializer {
    public onStartup(): void {
        var context: Crisper = new Crisper();
        
        context.addInterceptor(new Interface<IObservable>("IObservable"), new ObservableHandler());
        context.addInterceptor(new Interface<IExceptionsHandler>("IExceptionsHandler"), new ExceptionsHandler());
        context.addInterceptor(new Interface<IUpdatable<any>>("IUpdatable"), new UpdatableHandler());
        context.addInterceptor(new Interface<ISerializable>("ISerializable"), new SerializableHandler());
        
        context.register(Config);
        context.refresh();
        
        this.setContext(context);
        this.activateKnockout();
    }
}

$(window).on("keydown", e => { if (e.keyCode == 9) e.preventDefault(); });
var initializer: MlistingInitializer = new MlistingInitializer();
initializer.onStartup();