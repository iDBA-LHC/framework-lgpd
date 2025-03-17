import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.css']
})
export class InfoBoxComponent implements OnInit {

  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() isRed: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
