import { Injectable } from '@angular/core';
import { RequestOptions, URLSearchParams, Jsonp, Response, RequestOptionsArgs} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/map";

@Injectable()
export class HttpService {

  WEB_API_URL: string = "https://webservice.recruit.co.jp/ab-road/tour/v1/";
  API_KEY = "";
  DEFAULT_SIZE = "30";
  SORT_RANKING = "5";
  CALLBACK = "JSONP_CALLBACK";

  constructor(private jsonp: Jsonp) {

  }

  //クラウドからツアー情報取得
  getTourData(areaCode: string): Observable<any> {
    //接続設定
    let option = this.setParam(areaCode);
    //データ取得
    return this.reqData(option);
  }

  //通信設定値作成
  setParam(areaCode: string): RequestOptions {
    //Urlパラメータオブジェクト作成
    let param = new URLSearchParams(); //検索のURLパラメータ作成クラス
    param.set("key", this.API_KEY);
    param.set("area", areaCode);
    param.set("order", this.SORT_RANKING);
    param.set("count", this.DEFAULT_SIZE);
    param.set("format", "jsonp");
    param.set("callback", this.CALLBACK);

    //通信設定オブジェクト作成
    let options: RequestOptionsArgs = {
      //指定したパラメータを元に通信条件設定
      method: "get",
      url: this.WEB_API_URL,
      search: param
    };
    return new RequestOptions(options);
  }

  //HTTPリクエストとレスポンス処理
  reqData(config: RequestOptions): Observable<any> {
    return this.jsonp.request(config.url, config)
      .map(response => {
        //レスポンスデータの加工
        let tourData;
        let obj = response.json();
        if(obj.results.error) {
          //Web APIリクエスト失敗
          let err = obj.results.error[0];
          tourData = {
            error: err.code,
            message: err.message
          };
        }
        else {
          //Web APIリクエスト成功
          let dataObj = obj.results.tour;
          tourData = {
            error:null,
            data: dataObj
          };
          console.dir(tourData);
          return tourData;
        }
      });
  }
}
