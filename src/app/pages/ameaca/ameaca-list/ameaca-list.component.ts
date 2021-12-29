import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Ameaca } from 'src/app/models/ameaca/ameaca';
import { AmeacaService } from 'src/app/services/ameaca.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ameaca-list',
  templateUrl: './ameaca-list.component.html',
  styleUrls: ['./ameaca-list.component.css']
})
export class AmeacaListComponent implements OnInit {
  isLoading = false;
  permiteExclusao = this.authService.getLoggedUserType() === environment.tipoUsuaruioAdmin;
  
  displayedColumns: string[] = ["nomeAmeaca", "actions"];

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;


  constructor(
      private ameacaService: AmeacaService,
      private snackBar: CustomSnackBarService,
      private dialog: MatDialog,
      private authService: AuthService
  ) { }

  ngOnInit(): void {
      this.pesquisaAmeacas();
  }

  pesquisaAmeacas() {
      this.isLoading = true;
      this.ameacaService.listaTodosAmeaca().subscribe(
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
      )
  }

  applyFilter(value: string) {
      this.dataSource.filter = value.trim().toLowerCase();
  }

  excluir(ameaca: Ameaca)
  {
      const confirmRemoveDialog = this.dialog.open(ConfirmModalComponent, {
          data: {
            title: "Confirmar Exclusão de Ameaça",
            msg: `Tem certeza que deseja prosseguir com exclusão da Ameaça ${ameaca.nomeAmeaca}?`,
          },
        });

        confirmRemoveDialog.afterClosed().subscribe((result) => {
          if (result) {
            this.confirmaExclusao(ameaca);
            this.isLoading = true;
          }
        });  
  }

  confirmaExclusao(ameaca: Ameaca)
  {
      this.ameacaService.excluirAmeaca(ameaca.codigoAmeaca).subscribe((response) => {
          this.snackBar.openSnackBar(
            `Ameaça ${ameaca.nomeAmeaca} foi excluída com Sucesso.`,
            null
          );
          this.pesquisaAmeacas();
        },
        (err) => {
          if (err.status === 401)
          {
            TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.confirmaExclusao(ameaca);}));
          }
          else
          {
            TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            this.isLoading = false;
          }
        });
  }

}
