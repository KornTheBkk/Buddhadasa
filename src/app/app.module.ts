import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// native plugins
import { Media } from '@ionic-native/media';
import { BackgroundMode } from '@ionic-native/background-mode';
import { SQLite } from '@ionic-native/sqlite';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { DocumentViewer } from '@ionic-native/document-viewer';

// providers
import { SoundProvider } from '../providers/sound/sound';
import { PipesModule } from '../pipes/pipes.module';
import { SearchProvider } from '../providers/search/search';
import { BookProvider } from '../providers/book/book';
import { BookSearchProvider } from '../providers/book-search/book-search';
import { BannerProvider } from '../providers/banner/banner';

import { MyApp } from './app.component';

// custom components
import { ComponentsModule } from '../components/components.module';

// my pages
import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { SoundPage } from '../pages/sound/sound';
import { BookPage } from '../pages/book/book';
import { BookCategoryPage } from '../pages/book-category/book-category';
import { SettingPage } from '../pages/setting/setting';
import { SoundCategoryPage } from '../pages/sound-category/sound-category';
import { SoundArchivePage } from '../pages/sound-archive/sound-archive';
import { SoundListenPage } from '../pages/sound-listen/sound-listen';
import { SearchPage } from '../pages/search/search';
import { BookSearchPage } from '../pages/book-search/book-search';
import { BookDetailPage } from '../pages/book-detail/book-detail';



@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    HomePage,
    SoundPage,
    BookPage,
    BookCategoryPage,
    SettingPage,
    SoundCategoryPage,
    SoundArchivePage,
    SoundListenPage,
    SearchPage,
    BookSearchPage,
    BookDetailPage,
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
    BookCategoryPage,
    SettingPage,
    SoundCategoryPage,
    SoundArchivePage,
    SoundListenPage,
    SearchPage,
    BookSearchPage,
    BookDetailPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Media,
    BackgroundMode,
    SQLite,
    File,
    FileTransfer,
    DocumentViewer,
    SoundProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    //{ provide: 'API_URL', useValue: 'http://localhost/buddha/services/api' },
    { provide: 'API_URL', useValue: 'http://172.20.10.2/buddhadasa/api' },
    SearchProvider,
    BookProvider,
    BookSearchProvider,
    BookSearchProvider,
    BannerProvider,
    BannerProvider
  ]
})
export class AppModule {}
