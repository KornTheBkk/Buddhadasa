import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { SoundPage } from '../sound/sound';
import { BookPage } from '../book/book';
import { SettingPage } from '../setting/setting';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tabHome = HomePage;
  tabSound = SoundPage;
  tabBook = BookPage;
  tabSetting = SettingPage;

  constructor() {

  }
}
