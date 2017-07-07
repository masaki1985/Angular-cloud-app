import { Component, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';

@Component({
  selector: 'detail-dialog',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent {

  @Input() tourData; //親コンポーネントから受け取るプロパティ
  @ViewChild("lgModal") modalRef:ModalDirective; //Modalダイアログへの参照

  constructor() { }

  //ダイアログを開く
  openDialog() {
    this.modalRef.show();
  }

}
