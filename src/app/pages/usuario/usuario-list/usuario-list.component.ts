import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { ExportPdfService } from 'src/app/services/export-pdf.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario/usuario';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { AuthService } from 'src/app/services/auth.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css'],
  
})
export class UsuarioListComponent implements OnInit {

  isLoading = false;
  mostraInativos = false;

  displayedColumns: string[] = ["nomeUsuario", "nomeEmpresa","nomeArea","actions"];

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private usuarioService: UsuarioService,
    private snackBar: CustomSnackBarService,
    private dialog: MatDialog,
    private exportPdfService: ExportPdfService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.pesquisaUsuarios();
  }

  pesquisaUsuarios() {
    this.isLoading = true;
    this.usuarioService.listaTodosUsuarios(this.mostraInativos).subscribe(
      (response) => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource<Usuario>(response.body);
        setTimeout(() => {
          this.dataSource.filterPredicate = (
            data: { nomeUsuario: string,
                    nomeEmpresa: string,
                    nomeArea:string },
            filterValue: string
          ) => data.nomeUsuario.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
               data.nomeEmpresa.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
               data.nomeArea.toString().trim().toLowerCase().indexOf(filterValue) !== - 1 ;
    
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;          
        });
      },
      (err) =>{
        if (err.status === 401)
        {
          TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaUsuarios();}));
        }
        else
        {
          this.isLoading = false;
          TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
        }
      }
    );    
  }

  gerarSenha(usuario: Usuario)
  {
    const confirmRemoveDialog = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: "Confirmar Geração de Senha",
        msg: `Tem certeza que deseja prosseguir com a geração de senha do usuário ${usuario.nomeUsuario}?`,
      },
    });

    confirmRemoveDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        this.usuarioService.gerarSenha(usuario).subscribe(
          () => {
            this.snackBar.openSnackBar(
              `Senha foi gerada com sucesso. O Usuário Irá Receber um E-mail Com as Instruções Para Acesso`,
              null);
            this.isLoading = false;  
          },
          (err) => {
            this.isLoading = false;  
            this.snackBar.openSnackBar(err.error, null, "Error");
          }
        );
      }
    });
  }

  inativarUsuario(usuario: Usuario)
  {
    const confirmRemoveDialog = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: "Confirmar Inativação do Usuário",
        msg: `Tem certeza que deseja prosseguir com a inativação do usuário ${usuario.nomeUsuario}?`,
      },
    });

    confirmRemoveDialog.afterClosed().subscribe((result) => {
      if (result) {
        usuario.indAtivo = 0;
        this.confirmaInativarUsuario(usuario);
        this.isLoading = true;
      }
    });
  }

  private confirmaInativarUsuario(usuario:Usuario)
  {
    this.usuarioService.inativarUsuario(usuario).subscribe(
      (response) => {
        this.snackBar.openSnackBar(
          `Usuário ${usuario.nomeUsuario} foi inativado com sucesso.`,
          null
        );
        this.pesquisaUsuarios();
      },
      (err) => {
        if (err.status === 401)
        {
          TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.confirmaInativarUsuario(usuario);}));
        }
        else
        {
          TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
        }
      });
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  applyValue(event) {  
    this.mostraInativos = event.checked;
    this.pesquisaUsuarios();
  }

}
