import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// native plugins
import { Media } from '@ionic-native/media';
import { BackgroundMode } from '@ionic-native/background-mode';

import { MyApp } from './app.component';

// custom components
import { ComponentsModule } from '../components/components.module';

// my pages
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { SoundPage } from '../pages/sound/sound';
import { BookPage } from '../pages/book/book';
import { SettingPage } from '../pages/setting/setting';
import { SoundCategoryPage } from '../pages/sound-category/sound-category';
import { SoundArchivePage } from '../pages/sound-archive/sound-archive';
import { SoundListenPage } from '../pages/sound-listen/sound-listen';
import { SearchPage } from '../pages/search/search';

// providers
import { SoundProvider } from '../providers/sound/sound';

import { PipesModule } from '../pipes/pipes.module';


@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    HomePage,
    SoundPage,
    BookPage,
    SettingPage,
    SoundCategoryPage,
    SoundArchivePage,
    SoundListenPage,
    SearchPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    ComponentsModule,
    PipesModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    HomePage,
    SoundPage,
    BookPage,
    SettingPage,
    SoundCategoryPage,
    SoundArchivePage,
    SoundListenPage,
    SearchPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Media,
    BackgroundMode,
    SoundProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    //{ provide: 'API_URL', useValue: 'http://localhost/buddha/services/api' },
    { provide: 'API_URL', useValue: 'http://172.20.10.3/buddhadasa/api' }
  ]
})
export class AppModule {}
