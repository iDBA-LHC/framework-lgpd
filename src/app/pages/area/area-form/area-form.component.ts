import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AreaService } from 'src/app/services/area.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';
import { Area } from 'src/app/models/area/area';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Empresa } from 'src/app/models/empresa/empresa';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ProcessoService } from 'src/app/services/processo.service';
import { Processo } from 'src/app/models/processo/processo';
import { environment } from 'src/environments/environment';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-area-form',
  templateUrl: './area-form.component.html',
  styleUrls: ['./area-form.component.css']
})
export class AreaFormComponent implements OnInit {

  permiteExclusao = this.authService.getLoggedUserType() === environment.tipoUsuaruioAdmin;

  areaForm: FormGroup;
  areaId: number;
  isLoading = false;
  empresaAnt: Empresa;

  listaAreas: Area[];
  listaAreasFiltradas: Observable<Area[]>;

  listaEmpresas: Empresa[];
  listaEmpresasFiltradas: Observable<Empresa[]>;

  displayedColumns: string[] = ["nomeProcesso", "actions"];
  dataSourceProcesso = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private areaService: AreaService,
    private empresaService: EmpresaService,
    private processService: ProcessoService,
    private snackBar: CustomSnackBarService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {

    this.isLoading = true;

    this.createForm();   
    this.pesquisaArea();
  }

  private createForm() {
    this.areaForm = this.formBuilder.group({
      nomeArea: ["", Validators.required],
      nomeResponsavel: ["", Validators.required],
      codEmpresa: [0,],
      empresa: ["", Validators.required],
    });
  }

  applyFilterProcesso(value: string) {
    this.dataSourceProcesso.filter = value.trim().toLowerCase();
  }

  salvarArea() {
    if (this.areaForm.valid) {
      const area: Area = this.areaForm.getRawValue();
      area.codArea = this.areaId;
      area.codUsuarioAlteracao = this.authService.getLoggedUserId();

      if (this.areaId) {
        this.areaService.alterarArea(area).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`A Área ${area.nomeArea} foi atualizado com sucesso!`,null);
            this.router.navigate(["/area"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarArea();}));            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        )
      } else {
        this.areaService.incluirArea(area).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`A Área ${area.nomeArea} foi criada com sucesso!`,null);
            this.router.navigate(["/area"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarArea();}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        )
      }
    }   
    else {
      this.snackBar.openSnackBar("Campos obrigatórios não foram preenchidos", null, "Warn");
    }
  }
  
  pesquisaArea() {
    this.activatedRoute.params.subscribe(
      (data) => {
        this.areaId = parseInt(data["id?"]);

        if (this.areaId) {
          this.areaService.pesquisaArea(this.areaId).subscribe(
            (retorno) => {
              this.areaForm.patchValue({
                nomeArea: retorno.body[0].nomeArea,
                nomeResponsavel: retorno.body[0].nomeResponsavel,
                codEmpresa: retorno.body[0].codEmpresa,
                nomeEmpresa: retorno.body[0].nomeEmpresa,
              });

              this.pesquisaEmpresas();
              this.pesquisaProcessos();
            },
            (err) =>{
              if (err.status === 401)
              {
                TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaArea();}));
              }
              else
              {
                TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
              }
            }
          )
        } else {
          this.pesquisaEmpresas();
        }
      }
    )
  }

  pesquisaProcessos() {
    this.processService.listarProcessosPorArea(this.areaId).subscribe(
      (response) => {
        this.dataSourceProcesso = new MatTableDataSource<Processo>(response.body);
        setTimeout(() => {
          this.dataSourceProcesso.filterPredicate = (
            data: {
              nomeProcesso: string
            },
            filterValue: string
          ) => data.nomeProcesso.toString().trim().toLowerCase().indexOf(filterValue) !== -1;

          this.dataSourceProcesso.paginator = this.paginator;
          this.dataSourceProcesso.sort = this.sort;
        });
        this.isLoading = false;
      }
    )
  }

  displayEmpresa(empresa: Empresa): string {
    return empresa && empresa.nomeEmpresa ? empresa.nomeEmpresa : '';
  }

  pesquisaEmpresas() {
    this.empresaService.listaTodasEmpresas().subscribe(
      (retorno) => {
        this.listaEmpresas = retorno.body;

        if (this.areaForm.controls.codEmpresa.value != 0) {
          let empresa: Empresa = <Empresa>this.listaEmpresas.filter(empresa => empresa.codigoEmpresa == this.areaForm.controls.codEmpresa.value)[0];
          if (empresa) {
            this.areaForm.controls.empresa.setValue(empresa);
          }
        }

        this.listaEmpresasFiltradas = this.areaForm.controls.empresa.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.nomeEmpresa),
            map(name => {
              return name ? this.filtraEmpresa(name) : this.listaEmpresas.slice();
            }));
        this.isLoading = false;
      }
    )
  }

  private filtraEmpresa(value: string): Empresa[] {
    const filterValue = value.toLowerCase();

    return this.listaEmpresas.filter(item => item.nomeEmpresa.trim().toLowerCase().includes(filterValue));
  }

  selecionaEmpresa(event){
    let empresaSelecionada : Empresa = event.option.value;
    this.isLoading = true;

    if (empresaSelecionada)
    {      
      //Só consultar no BD se houve alteração da empresa selecionada
      if (empresaSelecionada != this.empresaAnt)
      {
        this.areaForm.controls.codEmpresa.setValue(empresaSelecionada.codigoEmpresa);
        this.empresaAnt = empresaSelecionada;
      }
    }

    this.isLoading = false;
  }

  excluirProcesso(processo: Processo)
    {
        const confirmRemoveDialog = this.dialog.open(ConfirmModalComponent, {
            data: {
              title: "Confirmar Exclusão de Processo",
              msg: `Tem certeza que deseja prosseguir com exclusão do Processo ${processo.nomeProcesso}?`,
            },
          });

          confirmRemoveDialog.afterClosed().subscribe((result) => {
            if (result) {
              this.confirmaExclusaoProcesso(processo);
              this.isLoading = true;
            }
          });  
    }

    confirmaExclusaoProcesso(processo:Processo)
    {
        this.processService.excluirProcesso(processo.codProcesso).subscribe((response) => {
            this.snackBar.openSnackBar(
              `Processo ${processo.nomeProcesso} foi excluído com Sucesso.`,
              null
            );
            this.pesquisaProcessos();
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.confirmaExclusaoProcesso(processo);}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
              this.isLoading = false;
            }
          });
    }
}