import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Risco } from 'src/app/models/risco/risco';
import { AuthService } from 'src/app/services/auth.service';
import { RiscoService } from 'src/app/services/risco.service';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-risco-list',
  templateUrl: './risco-list.component.html',
  styleUrls: ['./risco-list.component.css']
})
export class RiscoListComponent implements OnInit {

  isLoading = false;
  permiteExclusao = this.authService.getLoggedUserType() === environment.tipoUsuaruioAdmin;
  
  displayedColumns: string[] = ["nomeRisco", "actions"];

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private riscoService: RiscoService,
    private snackBar: CustomSnackBarService,
    private dialog: MatDialog,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.pesquisaRiscos();
  }

  pesquisaRiscos() {
    this.isLoading = true;
    this.riscoService.listaTodos().subscribe(
        (response) => {
            this.isLoading = false;
            this.dataSource = new MatTableDataSource<Risco>(response.body);

            setTimeout(() => {
                this.dataSource.filterPredicate = (
                    data: {
                        nomeRisco: string
                    },
                    filterValue: string
                ) => data.nomeRisco.toString().trim().toLowerCase().indexOf(filterValue) !== -1;
                
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            })
        },
        (err) => {
            if (err.status == 401) {
                TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaRiscos();}));
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

excluir(risco: Risco)
{
    const confirmRemoveDialog = this.dialog.open(ConfirmModalComponent, {
        data: {
          title: "Confirmar Exclusão de Risco",
          msg: `Tem certeza que deseja prosseguir com exclusão do Risco ${risco.nomeRisco}?`,
        },
      });

      confirmRemoveDialog.afterClosed().subscribe((result) => {
        if (result) {
          this.confirmaExclusao(risco);
          this.isLoading = true;
        }
      });  
}

confirmaExclusao(risco: Risco)
{
    this.riscoService.excluir(risco.codigoRisco).subscribe((response) => {
        this.snackBar.openSnackBar(
          `Risco ${risco.nomeRisco} foi excluído com Sucesso.`,
          null
        );
        this.pesquisaRiscos();
      },
      (err) => {
        if (err.status === 401)
        {
          TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.confirmaExclusao(risco);}));
        }
        else
        {
          TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
          this.isLoading = false;
        }
      });
}

}
