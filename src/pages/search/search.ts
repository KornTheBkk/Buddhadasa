import { SoundListenPage } from './../sound-listen/sound-listen';
import { Component, ViewChild, Inject } from '@angular/core';
import { NavController, NavParams, Searchbar } from 'ionic-angular';

import { SoundProvider } from '../../providers/sound/sound';
import { ISound } from '../../interface/sound';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  @ViewChild('searchbar') searchbar: Searchbar;

  shouldShowCancel: boolean = false;
  find: string = null;

  items: Array<any> = [];
  totalItem: number = 0;
  isLoading: boolean = false;

  //config pagination
  page: number = 1;
  totalPage: number = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public soundProvider: SoundProvider,
    @Inject('API_ASSETS') public apiAssets: string) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  ionViewWillEnter() {
    this.searchbar.setFocus();
  }

  onInput(event) {
    console.log('on input: ' + JSON.stringify(event));
    this.search();
  }

  onCancel(event) {
    console.log('on cancel: ' + JSON.stringify(event));

  }

  search() {
    this.isLoading = true;
    this.items = [];
    if (this.find.trim()) {
      this.soundProvider.search(this.find)
        .then((res: any) => {
          this.isLoading = false;
          //console.log((res));

          if (res.ok) {
            //this.items = res.data;
            //console.log(this.items);
            this.totalItem = res.total;
            //this.sounds = res.data;
            let data: Array<ISound> = res.data.data;
            data.forEach(s => {
              let item = {
                id: s.id,
                sound_category_id: s.sound_category_id,
                title: s.title,
                subtitle: s.subtitle,
                mp3_file: `${this.apiAssets}/${s.mp3_file}`
              };
              this.items.push(item);
            });

            this.page = res.data.current_page;
            this.totalPage = res.data.last_page;
            this.totalItem = res.data.total;

          } else {
            console.log('Retrive data failed');
          }

        })
        .catch(error => {
          this.isLoading = false;
          console.log('Error: ' + JSON.stringify(error));
        });
    } else {

    }
  }

  navigateToListen(sound: ISound) {
    this.navCtrl.push(SoundListenPage, sound);
  }

  doInfinite(infiniteScroll) {
    let nextPage = this.page + 1;

    setTimeout(() => {

      if (this.find.trim()) {

        this.soundProvider.search(this.find, nextPage)
          .then((res: any) => {
            this.isLoading = false;
            //console.log((res));

            if (res.ok) {

              this.totalItem = res.total;

              let data: Array<ISound> = res.data.data;
              data.forEach(s => {
                let item = {
                  id: s.id,
                  sound_category_id: s.sound_category_id,
                  title: s.title,
                  subtitle: s.subtitle,
                  mp3_file: `${this.apiAssets}/${s.mp3_file}`
                };
                this.items.push(item);
              });

              this.page = res.data.current_page;
              this.totalPage = res.data.last_page;
              this.totalItem = res.data.total;

            } else {
              console.log('Retrive data failed');
            }

          })
          .catch(error => {
            this.isLoading = false;
            console.log('Error: ' + JSON.stringify(error));
          });
      }

      infiniteScroll.complete();
    }, 1000);
  }

}
