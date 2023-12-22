import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Cell, Workbook } from 'exceljs';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Empresa } from 'src/app/models/empresa/empresa';
import { StatusIncidenteButtons } from 'src/app/models/incidente/buttons/status-incidente-buttons';
import { Incidente } from 'src/app/models/incidente/incidente';
import { AuthService } from 'src/app/services/auth.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { IncidenteService } from 'src/app/services/incidente.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { ExcelUtils } from 'src/app/shared/utils/excel-utils';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';
import { environment } from 'src/environments/environment';
import * as fs from 'file-saver';
import { DatePipe } from '@angular/common';
import { CpfCnpjPipe } from 'src/app/shared/components/pipe/cpf-cnpj-pipe';
import { jsPDF } from 'jspdf';

@Component({
    selector: 'app-incidente-list',
    templateUrl: './incidente-list.component.html',
    styleUrls: ['./incidente-list.component.css']
})
export class IncidenteListComponent implements OnInit {
    isLoading = false;
    usuarioAdmin: boolean = this.authService.getLoggedUserType() === environment.tipoUsuaruioAdmin;

    displayedColumns: string[] = ["numeroProtocolo", "dataIncidente", "statusIncidente", "actions"];
    statusIncidenteButtons = new StatusIncidenteButtons();

    form: FormGroup;
    datas = { begin: new Date(1900, 1, 1), end: new Date(9999, 12, 31) };

    dataSource = new MatTableDataSource();
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    listaEmpresas: Empresa[];
    listaEmpresasFiltradas: Observable<Empresa[]>;

    cnpjCpfPipe: CpfCnpjPipe = new CpfCnpjPipe();


    constructor(
        private service: IncidenteService,
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
            datas: [{ begin: new Date(), end: new Date() }],
            indStatus: [0,]
        });

        if (!this.usuarioAdmin) {
            this.form.controls['codigoEmpresa'].setValue(this.authService.getLoggedEmpresaUser());
        }

        this.pesquisaIncidentes();

        this.pesquisaEmpresas();
    }

    pesquisaIncidentes() {
        this.isLoading = true;
        this.service.pesquisaIncidentes(this.form.controls['codigoEmpresa'].value,
            this.form.controls['datas'].value.begin,
            this.form.controls['datas'].value.end,
            this.form.controls['indStatus'].value).subscribe(
                (response) => {

                    this.isLoading = false;
                    this.dataSource = new MatTableDataSource<Incidente>(response.body);

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
                        TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => { this.pesquisaIncidentes(); }));
                    } else {
                        this.isLoading = false;
                        TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
                    }
                });
    }

    private pesquisaEmpresas() {
        this.empresaService.listaTodasEmpresas().subscribe(
            (retorno) => {
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

    gerarRelatorio(event) {
        this.geraPlanilha(this.dataSource.data as Incidente[]);
    }

    private geraPlanilha(listaIncidentes: Incidente[]) {

        const header = ["Protocolo", "Controlador", "CNPJ", "Operador", "Encarregado",
            "Contato Encarregado", "Registro do Incidente", "Data do Incidente", "Data da Comunicação",
            "Status", "Detalhes"];

        let workbook = new Workbook();
        let worksheet = workbook.addWorksheet('Incidentes');

        let headerRow = worksheet.addRow(header);

        headerRow.eachCell((cell, number) => {
            cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'F8F8F8' } };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'F58634' },
            }
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        });

        listaIncidentes.forEach((incidente) => {
            let dado =
                [
                    incidente.numeroProtocolo,
                    incidente.nomeEmpresa,
                    this.cnpjCpfPipe.transform(incidente.numeroCNPJEmpresa),
                    incidente.nomeUsuarioOperador,
                    incidente.nomeUsuarioEncarregado,
                    incidente.emailUsuarioEncarregado,
                    this.datePipe.transform(incidente.dataRegistro, "dd/MM/yyyy hh:mm:ss"),
                    this.datePipe.transform(incidente.dataIncidente, "dd/MM/yyyy hh:mm:ss"),
                    this.datePipe.transform(incidente.dataComunicacao, "dd/MM/yyyy"),
                    this.statusIncidenteButtons.buttonsForm[incidente.indStatus - 1]['description'],
                    incidente.desDetalhes === null ? "" : incidente.desDetalhes
                ]

            let row = worksheet.addRow(dado);
            let colDetalhes = row.getCell(11);
            colDetalhes.alignment = { wrapText: true };

            row.eachCell((cell, number) => {
                cell.font = { name: 'Calibri', size: 10, bold: false, color: { argb: 'FFFFFF' } };
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
            fs.saveAs(blob, 'Incidentes.xlsx');
        });

    }

    gerarPdfIncidente(incidente: Incidente) {
        console.log(incidente);
        var indIncidenteNoPrazo = false;
        var linha = 70; 
        var saltoLinha = 15;

        const doc = new jsPDF({
            unit: 'px',
            format: [595, 842]
        });

        let empresaIncidente: Empresa = <Empresa>this.listaEmpresas.filter(empresa => empresa.codigoEmpresa == incidente.codigoEmpresa)[0];

        this.imprimeCabecalhoRelatorio(doc);

        doc.setFontSize(16);
        doc.setTextColor(0,0,0);
        doc.text(`Incidente # ${incidente.numeroProtocolo}`, 250, 50);

        doc.text(`Controladora: ${incidente.nomeEmpresa}`, 10, linha);
        doc.text(`CNPJ: ${this.cnpjCpfPipe.transform(incidente.numeroCNPJEmpresa)} `, 300, linha);
        linha+=saltoLinha;
        doc.text(`Operador: ${incidente.nomeUsuarioOperador}`, 10, linha);
        linha+=saltoLinha;
        doc.text(`Encarregado: ${incidente.nomeUsuarioEncarregado}`, 10, linha);
        linha+=saltoLinha;
        doc.text(`E-Mail Encarregado: ${incidente.emailUsuarioEncarregado}`, 10, linha);
        linha+=saltoLinha;
        doc.text(`Telefone Controladora: ${empresaIncidente ? empresaIncidente.telefoneControlador : ""}`, 10, linha);
        linha+=saltoLinha;
        doc.text(`Data/Hora de Registro: ${this.datePipe.transform(incidente.dataRegistro,'dd/MM/yyyy hh:mm',"UTC")} `, 10, linha);
        doc.text(`Data/Hora do Incidente: ${this.datePipe.transform(incidente.dataIncidente,'dd/MM/yyyy hh:mm',"UTC")} `, 300, linha);
        linha+=saltoLinha;
        doc.text(`Data de Comunicação Registro: ${this.datePipe.transform(incidente.dataComunicacao,'dd/MM/yyyy',"UTC")} `, 10, linha);

        if (this.datediff(incidente.dataIncidente, incidente.dataComunicacao) > 2) {
			indIncidenteNoPrazo = false;
		}
		else {
			indIncidenteNoPrazo = true;
		}

        if (indIncidenteNoPrazo)
        {
            doc.setTextColor(0,255,0);
            doc.text(`Incidente Comunicado No Prazo`, 300, linha);
        }
        else
        {
            doc.setTextColor(255,0,0);
            doc.text(`Incidente Comunicado Fora do Prazo`, 300, linha);
        }

        linha+=saltoLinha;
        doc.setTextColor(0,0,0)
        
        doc.text(`Justificativa:`,10, linha);
        doc.text(`${incidente.desJustificativa ? incidente.desJustificativa : ""}`, 80,linha);
        linha+=(saltoLinha * this.contaLinhas(incidente.desJustificativa));
        doc.text(`Status: ${this.statusIncidenteButtons.buttonsForm[incidente.indStatus - 1].description}`, 10,linha);
        linha+=saltoLinha;
        doc.text(`Tipo de Comunicação: ${incidente.desTipoComunicacao ? incidente.desTipoComunicacao: ''}`,10, linha);
        linha+=saltoLinha;
        doc.text(`Dados do Agente de Tratamento: ${incidente.dadosAgenteTratamento ? incidente.dadosAgenteTratamento: ""}`,10, linha);
        linha+=saltoLinha;
        doc.text(`Dados do Notificante: ${incidente.dadosNotificante ? incidente.dadosNotificante: ""}`,10, linha);
        linha+=saltoLinha;
        doc.text(`Detalhes:`,10, linha);
        doc.text(`${incidente.desDetalhes ? incidente.desDetalhes: ""}`,65, linha);
        linha+=(saltoLinha * this.contaLinhas(incidente.desDetalhes));
        doc.text(`Natureza dos Dados Afetados: ${incidente.desNaturezaDados ? incidente.desNaturezaDados: ""}`,10, linha);
        linha+=saltoLinha;
        doc.text(`Tipo Titulares Afetados: ${incidente.desTipoTitulares ? incidente.desTipoTitulares: ""}`,10, linha);
        linha+=saltoLinha;
        doc.text(`Medidas Preventivas:`,10,linha);
        doc.text(`${incidente.desMedidasPreventivas ? incidente.desMedidasPreventivas: ""}`,128, linha);
        linha+=(saltoLinha * this.contaLinhas(incidente.desMedidasPreventivas));
        doc.text(`Medidas Mitigatórias:`,10,linha);
        doc.text(`${incidente.desMedidasMitigatorias ? incidente.desMedidasMitigatorias: ""}`,128, linha);
        linha+=(saltoLinha * this.contaLinhas(incidente.desMedidasMitigatorias));
        doc.text(`Relatório de Impacto: ${incidente.indRelatorioImpacto ? 'Sim':'Não'}`,10, linha);
        linha+=saltoLinha;
        doc.text(`Consequências:`,10,linha);
        doc.text(`${incidente.desConsequencias ? incidente.desConsequencias: ""}`,100, linha);
        linha+=(saltoLinha * this.contaLinhas(incidente.desConsequencias));
        doc.text(`Link Documento Incidente: ${incidente.desLinkDocumento ? incidente.desLinkDocumento : ''}`,10, linha);

        doc.save('pdf-export');
        
    }

    private imprimeCabecalhoRelatorio(doc: jsPDF)
    {
        doc.setFillColor("F58634");
        doc.rect(0, 0, 595, 30, 'F');
        doc.setFontSize(20);
        doc.setTextColor(255, 255, 255);
        doc.text('PRIVA',280,21);
    }

    private contaLinhas(texto: string): number
    {
        var linhas = texto.split("\n").length;
        if (linhas === 0) linhas = 1;
        return linhas;
    }

    private datediff(first, second) {
		return Math.round((second - first) / (1000 * 60 * 60 * 24)) + 1;
	}

}
