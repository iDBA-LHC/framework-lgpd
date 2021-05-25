import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { ExportPdfService } from 'src/app/services/export-pdf.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario/usuario';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';


const mockedUsuarios: Usuario[] = [
  {
    codigoUsuario: 1,
    nomeUsuario: "Huguinho",
    emailUsuario: "a@a.a",
    codigoCliente: 1,
    nomeEmpresa: "Empresa 1",
    indAtivo: false,
    indAdmin: false,
    dataHoraLogin: null,
    dataHoraValidade: null,
  },
  {
    codigoUsuario: 2,
    nomeUsuario: "Zezinho",
    emailUsuario: "b@b.b",
    codigoCliente: 1,
    nomeEmpresa: "Empresa 1",
    indAtivo: true,
    indAdmin: false,
    dataHoraValidade: null,
    dataHoraLogin: null,
  },
  {
    codigoUsuario: 3,
    nomeUsuario: "Luizinho",
    emailUsuario: "c@c.c",
    codigoCliente: 1,
    nomeEmpresa: "Empresa 1",
    indAtivo: true,
    indAdmin: false,
    dataHoraLogin: null,
    dataHoraValidade: null,
  },

];

@Component({
  selector: 'app-usuario-list',
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.css']
})
export class UsuarioListComponent implements OnInit {

  isLoading = false;

  displayedColumns: string[] = ["nomeUsuario", "nomeEmpresa","actions"];

  private somenteAtivos = true;

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private usuarioService: UsuarioService,
    private snackBar: CustomSnackBarService,
    private dialog: MatDialog,
    private exportPdfService: ExportPdfService
  ) {}


  ngOnInit() {
    this.pesquisaUsuarios(this.somenteAtivos);
  }

  pesquisaUsuarios(active?: boolean) {
    //this.categoryService.getAll(active).subscribe((categoryResponseList) => {
    //this.dataSource = new MatTableDataSource(categoryResponseList);
    this.dataSource = new MatTableDataSource(mockedUsuarios);
    setTimeout(() => {
      this.dataSource.filterPredicate = (
        data: { nomeUsuario: string,
                nomeEmpresa: string },
        filterValue: string
      ) => data.nomeUsuario.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
           data.nomeEmpresa.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ;

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.isLoading = true;
    //});
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
        this.usuarioService.gerarSenha(usuario.codigoUsuario).subscribe(
          () => {
            this.snackBar.openSnackBar(
              `Senha foi gerada com sucesso.`,
              null
            );
          },
          (err) => this.snackBar.openSnackBar(err.error, null, "Error")
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
        this.usuarioService.inativarUsuario(usuario.codigoUsuario).subscribe(
          () => {
            this.snackBar.openSnackBar(
              `${usuario.nomeUsuario} foi inativado com sucesso.`,
              null
            );
          },
          (err) => this.snackBar.openSnackBar(err.error, null, "Error")
        );
      }
    });
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  applyValue(event) {  
    this.pesquisaUsuarios();
  }

}
