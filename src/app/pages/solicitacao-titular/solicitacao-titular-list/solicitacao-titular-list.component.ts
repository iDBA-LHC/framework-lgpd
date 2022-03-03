import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Empresa } from 'src/app/models/empresa/empresa';
import { StatusSolicitacaoTitularButtons } from 'src/app/models/solicitacao-titular/buttons/status-solicitacao-titular-buttons';
import { SolicitacaoTitular } from 'src/app/models/solicitacao-titular/solicitacao-titular';
import { AuthService } from 'src/app/services/auth.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { SolicitacaoTitularService } from 'src/app/services/solicitacao-titular.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { cpfValidator } from 'src/app/shared/utils/app.validator';
import { ExcelUtils } from 'src/app/shared/utils/excel-utils';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';
import { environment } from 'src/environments/environment';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs';
import { CpfCnpjPipe } from 'src/app/shared/components/pipe/cpf-cnpj-pipe';
import { DatePipe } from '@angular/common';
import { DireitoSolicitacaoTitularButtons } from 'src/app/models/solicitacao-titular/buttons/direito-solicitacao-titular-buttons';

@Component({
  selector: 'app-solicitacao-titular-list',
  templateUrl: './solicitacao-titular-list.component.html',
  styleUrls: ['./solicitacao-titular-list.component.css']
})
export class SolicitacaoTitularListComponent implements OnInit {
  isLoading = false;
  usuarioAdmin:boolean = this.authService.getLoggedUserType() === environment.tipoUsuaruioAdmin;
  
  displayedColumns: string[] = ["numeroProtocolo","dataSolicitacao","statusSolicitacao","actions"];
  statusSolicitacaoButtons = new StatusSolicitacaoTitularButtons();

  form: FormGroup;

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  listaEmpresas: Empresa[];
  listaEmpresasFiltradas: Observable<Empresa[]>;

  cnpjCpfPipe: CpfCnpjPipe = new CpfCnpjPipe();

  direitoSolicitacaoTitularButtons: DireitoSolicitacaoTitularButtons = new DireitoSolicitacaoTitularButtons();


  constructor(
      private service: SolicitacaoTitularService,
      private snackBar: CustomSnackBarService,
      private dialog: MatDialog,
      private empresaService: EmpresaService,
      private authService: AuthService,
      private formBuilder: FormBuilder,
      private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {

      this.form = this.formBuilder.group({
        empresa: [,],
        codigoEmpresa: [0,],  
        datas: [{begin: new Date(), end: new Date()}],
        indStatus: [0,],
        cpfTitular: ["",cpfValidator],
        cpfRepresentante: ["",cpfValidator],
      });

      if (!this.usuarioAdmin)
      {
          this.form.controls.codigoEmpresa.setValue(this.authService.getLoggedEmpresaUser());
      }

      this.pesquisaSolicitaoesTitular();
      this.pesquisaEmpresas();
  }

    pesquisaSolicitaoesTitular() {
        this.isLoading = true;
        this.service.pesquisaSolicitacoes(this.form.controls['codigoEmpresa'].value,
                                          this.form.controls['datas'].value.begin,
                                          this.form.controls['datas'].value.end,
                                          this.form.controls['indStatus'].value,
                                          this.form.controls['cpfTitular'].value.trim(),
                                          this.form.controls['cpfRepresentante'].value.trim()).subscribe(
            (response) => {
    
                this.isLoading = false;
                this.dataSource = new MatTableDataSource<SolicitacaoTitular>(response.body);
    
                setTimeout(() => {
                    this.dataSource.filterPredicate = (
                        data: {
                            numeroProtocolo: string
                        },
                        filterValue: string
                    ) => data.numeroProtocolo.toString().trim().toLowerCase().indexOf(filterValue) !== -1;
                    
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                });
    
            },
            (err) => {
                this.isLoading = false;
                if (err.status == 401) {
                    TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaSolicitaoesTitular();}));
                } else {
                    this.isLoading = false;
                    TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
                }
            });
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

  gerarRelatorio(event)
  {
      this.geraPlanilha(this.dataSource.data as SolicitacaoTitular[]);
  }

  private geraPlanilha(listaRegistros: SolicitacaoTitular[]){

    const header = ["Protocolo", "CPF Titular", "CPF Representante", "Direito a Ser Exercido","E-Mail Contato",
                    "Data Inclusão","Data Prevista Retorno","Data Retorno","Usuário",
                    "Status","Retorno / Observações"];

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Solicitações de Titulares');                    

    let headerRow = worksheet.addRow(header);
    
    headerRow.eachCell((cell, number) => {
        cell.font = { name: 'Calibri', size: 11, bold: true, color: {argb : 'F8F8F8'} };
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'F58634' },
        }
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    listaRegistros.forEach((solicitacao) => {
        let dado = 
        [
            solicitacao.numeroProtocolo,
            this.cnpjCpfPipe.transform(solicitacao.numeroCpfTitular),
            solicitacao.numeroCpfRepresentante === null ? "" : this.cnpjCpfPipe.transform(solicitacao.numeroCpfRepresentante),
            this.direitoSolicitacaoTitularButtons.buttons[solicitacao.indDireito - 1]['description'],
            solicitacao.emailTitular,
            this.datePipe.transform(solicitacao.dataInclusao,"dd/MM/yyyy"),
            this.datePipe.transform(solicitacao.dataPrevisaoRetorno,"dd/MM/yyyy"),
            solicitacao.dataRetorno === null ? "" : this.datePipe.transform(solicitacao.dataRetorno,"dd/MM/yyyy"),
            solicitacao.nomeUsuario,
            this.statusSolicitacaoButtons.buttonsForm[solicitacao.indStatus - 1]['description'],
            solicitacao.desObservacoes === null  ? "" : solicitacao.desObservacoes 
        ]

        let row = worksheet.addRow(dado);
        let colDetalhes = row.getCell(11);
        colDetalhes.alignment =  { wrapText: true };

        row.eachCell((cell, number) => {
            cell.font = { name: 'Calibri', size: 10, bold: false, color: {argb : 'FFFFFF'} };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '606062' },
            }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        });
    });

    ExcelUtils.autoWidth(worksheet);

    workbook.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob, 'Solicitações.xlsx');
    });

}

}
