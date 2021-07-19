import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'app-ciclo-de-vida-list',
    templateUrl: './ciclo-de-vida-list.component.html',
    styleUrls: ['./ciclo-de-vida-list.component.css']
})

export class CicloDeVidaListComponent implements OnInit {
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }

}