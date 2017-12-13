import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { SQLite } from '@ionic-native/sqlite';

import { MyApp } from './app.component';
import { ListPage } from '../pages/list/list';
import { ItemListPage } from '../pages/item-list/item-list';
import { AddItemListPage } from '../pages/add-item-list/add-item-list';
import { EditItemListPage } from '../pages/edit-item-list/edit-item-list';

import { ListsServiceProvider } from '../providers/lists-service/lists-service';

@NgModule({
  declarations: [
    MyApp,
    ListPage,    
    ItemListPage,
    AddItemListPage,
    EditItemListPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ListPage,    
    ItemListPage,
    AddItemListPage,
    EditItemListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ListsServiceProvider
  ]
})
export class AppModule {}
