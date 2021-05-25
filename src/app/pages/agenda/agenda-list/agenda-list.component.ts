import { Component, OnInit, ViewChild } from '@angular/core';
import { Tecnico } from 'src/app/models/tecnico/tecnico';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';

@Component({
  selector: 'app-agenda-list',
  templateUrl: './agenda-list.component.html',
  styleUrls: ['./agenda-list.component.css']
})
export class AgendaListComponent implements OnInit {

  isLoading = false;

  displayedColumns: string[] = ["nomeTecnico", "actions"];

  dataSource = new MatTableDataSource<Tecnico>([{
    codigoTecnico: "marcelo",
    nomeTecnico: "Marcelo Brazil",
    codigoUsuario: "MB",
    rowid: "X1"
  },
  {
    codigoTecnico: "helder",
    nomeTecnico: "Helder Breda",
    codigoUsuario: "HB",
    rowid: "X2"
  },
  {
    codigoTecnico: "andre",
    nomeTecnico: "André",
    codigoUsuario: "AF",
    rowid: "X3"
  },
  {
    codigoTecnico: "cleiton",
    nomeTecnico: "Cleiton",
    codigoUsuario: "CP",
    rowid: "X4"
  }]);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  ngOnInit() {
    this.isLoading = true;
  }

  constructor(
    private snackBar: CustomSnackBarService,
  ) { }
}
