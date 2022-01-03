import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { RiscoAssociado } from 'src/app/models/risco-associado/risco-associado';
import { Risco } from 'src/app/models/risco/risco';
import { AuthService } from 'src/app/services/auth.service';
import { RiscoAssociadoService } from 'src/app/services/risco-associado.service';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-risco-associado-list',
  templateUrl: './risco-associado-list.component.html',
  styleUrls: ['./risco-associado-list.component.css']
})
export class RiscoAssociadoListComponent implements OnInit {

  isLoading = false;
  permiteExclusao = this.authService.getLoggedUserType() === environment.tipoUsuaruioAdmin;
  
  displayedColumns: string[] = ["nomeRiscoAssociado", "actions"];

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;


  constructor(
      private riscoAssociadoService: RiscoAssociadoService,
      private snackBar: CustomSnackBarService,
      private dialog: MatDialog,
      private authService: AuthService
  ) { }

  ngOnInit(): void {
      this.pesquisaRiscoAssociados();
  }

  pesquisaRiscoAssociados() {
      this.isLoading = true;
      this.riscoAssociadoService.listaTodosRiscoAssociado().subscribe(
          (response) => {
              this.isLoading = false;
              this.dataSource = new MatTableDataSource<RiscoAssociado>(response.body);

              setTimeout(() => {
                  this.dataSource.filterPredicate = (
                      data: {
                          nomeRiscoAssociado: string
                      },
                      filterValue: string
                  ) => data.nomeRiscoAssociado.toString().trim().toLowerCase().indexOf(filterValue) !== -1;
                  
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
              })
          },
          (err) => {
              if (err.status == 401) {
                  TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaRiscoAssociados();}));
              } else {
                  this.isLoading = false;
                  TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
              }
          }
      )
  }

  applyFilter(value: string) {
      this.dataSource.filter = value.trim().toLowerCase();
  }

  excluir(riscoAssociado: RiscoAssociado)
  {
      const confirmRemoveDialog = this.dialog.open(ConfirmModalComponent, {
          data: {
            title: "Confirmar Exclusão de Risco Associado",
            msg: `Tem certeza que deseja prosseguir com exclusão do Risco Associado ${riscoAssociado.nomeRiscoAssociado}?`,
          },
        });

        confirmRemoveDialog.afterClosed().subscribe((result) => {
          if (result) {
            this.confirmaExclusao(riscoAssociado);
            this.isLoading = true;
          }
        });  
  }

  confirmaExclusao(riscoAssociado: RiscoAssociado)
  {
      this.riscoAssociadoService.excluirRiscoAssociado(riscoAssociado.codigoRiscoAssociado).subscribe((response) => {
          this.snackBar.openSnackBar(
            `Risco Associado ${riscoAssociado.nomeRiscoAssociado} foi excluído com Sucesso.`,
            null
          );
          this.pesquisaRiscoAssociados();
        },
        (err) => {
          if (err.status === 401)
          {
            TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.confirmaExclusao(riscoAssociado);}));
          }
          else
          {
            TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            this.isLoading = false;
          }
        });
  }

}
