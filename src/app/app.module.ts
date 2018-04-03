import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';

import { SoundPageModule } from '../pages/sound/sound.module';
import { BookPageModule } from '../pages/book/book.module';
import { SettingPageModule } from '../pages/setting/setting.module';
import { SoundCategoryPageModule } from '../pages/sound-category/sound-category.module';
import { SoundArchivePageModule } from '../pages/sound-archive/sound-archive.module';
import { SoundListenPageModule } from '../pages/sound-listen/sound-listen.module';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SoundProvider } from '../providers/sound/sound';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    SoundPageModule,
    BookPageModule,
    SettingPageModule,
    SoundCategoryPageModule,
    SoundArchivePageModule,
    SoundListenPageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    //{ provide: 'API_URL', useValue: 'http://localhost/buddha/services/api' },
    //{ provide: 'API_ASSETS', useValue: 'http://localhost/buddha/services' },
    { provide: 'API_URL', useValue: 'http://172.20.10.2/buddha/services/api' },
    { provide: 'API_ASSETS', useValue: 'http://172.20.10.2/buddha/services' },
    SoundProvider
  ]
})
export class AppModule {}
