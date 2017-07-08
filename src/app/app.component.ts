import { Component, OnInit, ViewContainerRef, ViewChild, HostListener } from '@angular/core';

import { HttpService } from './http.service';
import { DetailComponent } from './detail/detail.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  //ツアー明細ダイアログの参照取得
  @ViewChild("detailDialog") detailComponent:  DetailComponent;

  tourObj;                   //選択したツアー情報（１件分）
  selectedData;              //選択したエリアのツアー情報
  bookmarks;                 //ブックマーク
  isMobile = false;          //PCとモバイルの判定
  MOBILE_SCREEN_WIDTH = 768; //モバイル判定画面幅
  isCollapsed = false;       //エリア選択メニューの開閉
  areas = [
    {code: "BCH", name: "ビーチリゾート", data: null},
    {code: "EUR", name: "ヨーロッパ", data: null},
    {code: "DUS", name: "アメリカ", data: null},
    {code: "BOOKMARK", name: "お気に入り", data: null},
  ];
  viewContainerRef;          //modal表示用

  public constructor (private httpService: HttpService,
                      viewContainerRef: ViewContainerRef) {
    this.viewContainerRef = viewContainerRef;
  }

  //アプリ起動時の処理
  ngOnInit() {
    //クラウドからツアー情報取得
    this.getTour();
    //保存したブックマークの取得
    this.initBookmarks();
    //PCとモバイルデバイスの判定
    this.onScreenResize();
  }

  //3エリアの情報を一括受信
  getTour() {
    this.selectedData = null;
    for(let i = 0; i < this.areas.length; i++) {
      let areaCode = this.areas[i].code
      if(areaCode === "BOOKMARK") {
        continue;
      }
      this.httpService.getTourData(areaCode)
        .subscribe(
          result => this.setTour(result, i),
          error => alert("通信エラー¥n" + error)
        );
    }
  }

  //受信データの取得
  setTour(result, i) {
    if(result.error) {
      alert("Web APIエラー¥n" + result.message);
      return;
    }

    this.areas[i].data = result;
  }

  //保存したブックマーク情報の読み取り
  initBookmarks() {
    let storeData = localStorage.getItem("bookmarks");
    if(storeData) {
      this.bookmarks = JSON.parse(storeData);
    }
    else {
      this.bookmarks = {};
    }
  }

  //resizeイベント
  @HostListener("window:resize")
  onScreenResize() {
    this.isMobile = (innerWidth < this.MOBILE_SCREEN_WIDTH);
  }

  //エリアメニュー選択時
  onAreaChange(index) {
    let area = this.areas[index];
    //ブックマーク選択時
    if(area.code === "BOOKMARK") {
      if(Object.keys(this.bookmarks).length === 0) {
        alert("ブックマークが登録されていません");
        return;
      }
      this.selectedData = Object.keys(this.bookmarks)
        .map(key => this.bookmarks[key]);
    }
    //エリア名選択時
    else {
      this.selectedData = area.data.data;
    }
    //スクロール位置をリセット
    setTimeout(scroll(0 ,0), 1);
  }

  //ブックマークボタンのクリック時
  onBookmarkClick(tourID, index) {
    //登録がない場合がブックマーク情報に追加
    if(!this.isMarked(tourID)) {
      //登録件数の確認
      if(Object.keys(this.bookmarks).length === 10) {
        return alert("Bookmarkは最大10件です");
      }
      //登録
      this.bookmarks[tourID] = this.selectedData[index];
    }
    else {
      //登録済みの場合はブックマークから削除
      delete this.bookmarks[tourID];
    }
    //更新されたブックマーク情報の保存
    localStorage.setItem("bookmarks", JSON.stringify(this.bookmarks));
  }

  //ブックマーク登録済み確認
  isMarked(tourID) {
    return this.bookmarks[tourID];
  }

  //ツアー詳細ボタンクリック時
  onDetailClick(index) {
    this.tourObj = this.selectedData[index];
    this.detailComponent.openDialog();
  }

}
