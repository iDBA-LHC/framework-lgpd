import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Empresa } from 'src/app/models/empresa/empresa';
import { StatusIncidenteButtons } from 'src/app/models/incidente/buttons/status-incidente-buttons';
import { AuthService } from 'src/app/services/auth.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { IncidenteService } from 'src/app/services/incidente.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-incidente-list',
  templateUrl: './incidente-list.component.html',
  styleUrls: ['./incidente-list.component.css']
})
export class IncidenteListComponent implements OnInit {
  isLoading = false;
  usuarioAdmin:boolean = this.authService.getLoggedUserType() === environment.tipoUsuaruioAdmin;
  
  displayedColumns: string[] = ["numeroProtocolo","dataIncidente","statusIncidente","actions"];
  statusIncidenteButtons = new StatusIncidenteButtons();

  form: FormGroup;
  datas = {begin: new Date(1900, 1, 1), end: new Date(9999, 12, 31)};

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  listaEmpresas: Empresa[];
  listaEmpresasFiltradas: Observable<Empresa[]>;


  constructor(
      private service: IncidenteService,
      private snackBar: CustomSnackBarService,
      private dialog: MatDialog,
      private empresaService: EmpresaService,
      private authService: AuthService,
      private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
      this.pesquisaAmeacas();

      this.form = this.formBuilder.group({
        empresa: [,],
        codigoEmpresa: [0,],  
        datas: [{begin: new Date(), end: new Date()}],
        indStatus: [0,]
      });

      if (!this.usuarioAdmin)
      {
          this.form.controls.codigoEmpresa.setValue(this.authService.getLoggedEmpresaUser());
      }

      this.pesquisaEmpresas();
  }

  pesquisaAmeacas() {
      this.isLoading = true;
      /*this.service.listaTodosAmeaca().subscribe(
          (response) => {
              this.isLoading = false;
              this.dataSource = new MatTableDataSource<Ameaca>(response.body);

              setTimeout(() => {
                  this.dataSource.filterPredicate = (
                      data: {
                          nomeAmeaca: string
                      },
                      filterValue: string
                  ) => data.nomeAmeaca.toString().trim().toLowerCase().indexOf(filterValue) !== -1;
                  
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
              })
          },
          (err) => {
              if (err.status == 401) {
                  TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaAmeacas();}));
              } else {
                  this.isLoading = false;
                  TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
              }
          }
      )*/
      this.isLoading = false;
  }

private pesquisaEmpresas() {
    this.isLoading = true;
    this.empresaService.listaTodasEmpresas().subscribe(
    (retorno) => {
        this.isLoading = false;
        this.listaEmpresas = retorno.body;

        let codEmpresa = this.form.controls.codigoEmpresa.value;
        if (codEmpresa != 0) {
            let empresaSel: Empresa = <Empresa>this.listaEmpresas.filter(empresa => empresa.codigoEmpresa == codEmpresa)[0];
            if (empresaSel)
                this.form.controls.empresa.setValue(empresaSel);
        }

        this.listaEmpresasFiltradas = this.form.controls.empresa.valueChanges
            .pipe(
                startWith(''),
                map(value => typeof value === 'string' ? value : value.nomeEmpresa),
                map(name => {
                return name ? this.filtraEmpresa(name) : this.listaEmpresas.slice();
                }));      
    });
}

displayEmpresa(empresa: Empresa): string {
    return empresa ? empresa.nomeEmpresa : "";
  }

selecionaEmpresa(event) {
    let empresaSelecionada: Empresa = event.option.value;
    this.form.controls.empresa.setValue(empresaSelecionada);
    this.form.controls.codigoEmpresa.setValue(empresaSelecionada.codigoEmpresa);
}

private filtraEmpresa(value: string): Empresa[] {
    const filterValue = value.toLowerCase();
    return this.listaEmpresas.filter(item => item.nomeEmpresa.trim().toLowerCase().includes(filterValue));
  }

applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
}

}
