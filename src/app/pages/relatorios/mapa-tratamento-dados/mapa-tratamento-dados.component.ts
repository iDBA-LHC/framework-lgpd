import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Area } from 'src/app/models/area/area';
import { Atividade } from 'src/app/models/atividade/atividade';
import { CicloMonitoramento } from 'src/app/models/ciclo-monitoramento/ciclo-monitoramento';
import { Empresa } from 'src/app/models/empresa/empresa';
import { Processo } from 'src/app/models/processo/processo';
import { AreaService } from 'src/app/services/area.service';
import { AtividadeService } from 'src/app/services/atividade.service';
import { CicloMonitoramentoService } from 'src/app/services/ciclo-monitoramento.service';
import { DataMapService } from 'src/app/services/data-map.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ProcessoService } from 'src/app/services/processo.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { Cell, Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { DataMap } from 'src/app/models/data-map/data-map';

@Component({
  selector: 'app-mapa-tratamento-dados',
  templateUrl: './mapa-tratamento-dados.component.html',
  styleUrls: ['./mapa-tratamento-dados.component.css']
})
export class MapaTratamentoDadosComponent implements OnInit {

  isLoading = false;

  listaEmpresas: Empresa[];
	listaEmpresasFiltradas: Observable<Empresa[]>;

  listaCiclos: CicloMonitoramento[];
	listaCiclosFiltrados: Observable<CicloMonitoramento[]>;

	listaAreas: Area[];
	listaAreasFiltradas: Observable<Area[]>;

	listaProcessos: Processo[];
	listaProcessosFiltradas: Observable<Processo[]>;

  listaAtividade: Atividade[];
  listaAtividadesFiltradas: Observable<Atividade[]>;

  relatorioForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private empresaService: EmpresaService,
    private areaService: AreaService,
		private processoService: ProcessoService,
    private atividadeService: AtividadeService,
    private cicloMonitoarmentoService: CicloMonitoramentoService,
    private dataMapService: DataMapService,
    private snackBar: CustomSnackBarService,		
  ) { }

  ngOnInit() {
    this.createForm();

    this.pesquisaEmpresas();
  }

  private createForm() {
		this.relatorioForm = this.formBuilder.group({

			codEmpresa: [0, Validators.required],
			empresa: ["", Validators.required],			

			codArea: ["", Validators.required],
			area: ["", Validators.required],

      codCicloMonitoramento: ["", Validators.required],
			cicloMonitoramento: ["", Validators.required],

			codProcesso: ["", ],
			processo: ["", ],

			codAtividade: ["", ],
			atividade: ["", ],			

		});
	}

  private pesquisaEmpresas() {
		this.empresaService.listaTodasEmpresas().subscribe(
			(retorno) => {
				this.listaEmpresas = retorno.body;

				let codEmpresa = this.relatorioForm.controls.codEmpresa.value;
				if (codEmpresa != 0) {
					let empresaSel: Empresa = <Empresa>this.listaEmpresas.filter(empresa => empresa.codigoEmpresa == codEmpresa)[0];
					if (empresaSel)
						this.relatorioForm.controls.empresa.setValue(empresaSel);
				}

				this.listaEmpresasFiltradas = this.relatorioForm.controls.empresa.valueChanges
					.pipe(
						startWith(''),
						map(value => typeof value === 'string' ? value : value.nomeEmpresa),
						map(name => {
							return name ? this.filtraEmpresa(name) : this.listaEmpresas.slice();
						}));
			}
		)
	}

	private filtraEmpresa(value: string): Empresa[] {
		const filterValue = value.toLowerCase();
		return this.listaEmpresas.filter(item => item.nomeEmpresa.trim().toLowerCase().includes(filterValue));
	}

	selecionaEmpresa(event) {
		let empresaSelecionada: Empresa = event.option.value;
		this.relatorioForm.controls.empresa.setValue(empresaSelecionada);
		this.relatorioForm.controls.codEmpresa.setValue(empresaSelecionada.codigoEmpresa);

		this.relatorioForm.controls.area.setValue(null);
		this.relatorioForm.controls.codProcesso.setValue(null);
		this.relatorioForm.controls.processo.setValue(null);
		this.relatorioForm.controls.codAtividade.setValue(null);
    this.relatorioForm.controls.atividade.setValue(null);		

		//this.buscarUltimoCicloMonitoramento(empresaSelecionada.codigoEmpresa);

		this.pesquisaArea(empresaSelecionada.codigoEmpresa);
    this.pesquisaCicloMonitoramento(empresaSelecionada.codigoEmpresa);
	}

	displayEmpresa(empresa: Empresa): string {
		return empresa ? empresa.nomeEmpresa : "";
	}

  private pesquisaArea(codEmpresa: number) {
    this.isLoading = true;
		this.areaService.listaAreasPorEmpresa(codEmpresa).subscribe(
			(retorno) => {
        this.isLoading = false;
				this.listaAreas = retorno.body;

				let codArea = this.relatorioForm.controls.codArea.value;
				if (codArea != 0) {
					let areaSel: Area = <Area>this.listaAreas.filter(area => area.codArea == codArea)[0];
					if (areaSel)
						this.relatorioForm.controls.area.setValue(areaSel);
				}

				this.listaAreasFiltradas = this.relatorioForm.controls.area.valueChanges
					.pipe(
						startWith(''),
						map(value => value === undefined || value === null ? "": value),
						map(value => typeof value === 'string' ? value : value.nomeArea),
						map(name => {
							return name ? this.filtraArea(name) : this.listaAreas.slice();
						}));
			}
		)
	}

	private filtraArea(value: string): Area[] {
		const filterValue = value.toLowerCase();
		return this.listaAreas.filter(item => item.nomeArea.trim().toLowerCase().includes(filterValue));
	}

	selecionaArea(event) {
		let areaSelecionada: Area = event.option.value;
		this.relatorioForm.controls.area.setValue(areaSelecionada);
		this.relatorioForm.controls.codArea.setValue(areaSelecionada.codArea);

		this.relatorioForm.controls.codProcesso.setValue(null);
		this.relatorioForm.controls.processo.setValue(null);
		this.relatorioForm.controls.codAtividade.setValue(null);
		this.relatorioForm.controls.atividade.setValue(null);

		this.pesquisaProcesso(areaSelecionada.codArea);
	}

	displayArea(area: Area): string {
		return area ? area.nomeArea : "";
	}

  private pesquisaCicloMonitoramento(codEmpresa: number) {
    this.isLoading = true;
		this.cicloMonitoarmentoService.buscarCicloMonitoramentoPorEmpresa(codEmpresa).subscribe(
			(retorno) => {
        this.isLoading = false;
				this.listaCiclos = retorno.body;

				this.listaCiclosFiltrados = this.relatorioForm.controls.cicloMonitoramento.valueChanges
					.pipe(
						startWith(''),
						map(value => value === undefined || value === null ? "": value),
						map(value => typeof value === 'string' ? value : value.nomeCicloMonitoramento),
						map(name => {
							return name ? this.filtraCicloMonitoramento(name) : this.listaCiclos.slice();
						}));
			}
		)
	}

	private filtraCicloMonitoramento(value: string): CicloMonitoramento[] {
		const filterValue = value.toLowerCase();
		return this.listaCiclos.filter(item => item.nomeCicloMonitoramento.trim().toLowerCase().includes(filterValue));
	}

	selecionaCicloMonitoramento(event) {
		let cicloSelecionado: CicloMonitoramento = event.option.value;
		this.relatorioForm.controls.cicloMonitoramento.setValue(cicloSelecionado);
		this.relatorioForm.controls.codCicloMonitoramento.setValue(cicloSelecionado.codCicloMonitoramento);
	}

	displayCicloMonitoramento(cicloMonitoramento: CicloMonitoramento): string {
		return cicloMonitoramento ? cicloMonitoramento.nomeCicloMonitoramento : "";
	}

  private pesquisaProcesso(codArea: number) {
		this.isLoading = true;
		this.processoService.listarProcessosPorArea(codArea).subscribe(
			(retorno) => {
				this.isLoading = false;
				this.listaProcessos = retorno.body;

				let codProcesso = this.relatorioForm.controls.codProcesso.value;
				if (codProcesso != 0) {
					let processoSel: Processo = <Processo>this.listaProcessos.filter(processo => processo.codProcesso == codProcesso)[0];
					if (processoSel)
						this.relatorioForm.controls.processo.setValue(processoSel);
				}

				this.listaProcessosFiltradas = this.relatorioForm.controls.processo.valueChanges
					.pipe(
						startWith(''),
						map(value => value === undefined || value === null ? "": value),
						map(value => typeof value === 'string' ? value : value.nomeProcesso),
						map(name => {
							return name ? this.filtraProcesso(name) : this.listaProcessos.slice();
						}));
			}
		)
	}

	private filtraProcesso(value: string): Processo[] {
		const filterValue = value.toLowerCase();
		return this.listaProcessos.filter(item => item.nomeProcesso.trim().toLowerCase().includes(filterValue));
	}

	selecionaProcesso(event) {
		let processoSelecionada: Processo = event.option.value;
		this.relatorioForm.controls.processo.setValue(processoSelecionada);
		this.relatorioForm.controls.codProcesso.setValue(processoSelecionada.codProcesso);

		this.relatorioForm.controls.codAtividade.setValue(null);
    this.relatorioForm.controls.atividade.setValue(null);

		this.pesquisaAtividade(processoSelecionada.codProcesso);
	}

	displayProcesso(processo: Processo): string {
		return processo ? processo.nomeProcesso : "";
	}

  private pesquisaAtividade(codProcesso: number) {
		this.isLoading = true;
		this.atividadeService.listaAtivadadesPorProcesso(codProcesso).subscribe(
			(retorno) => {
				this.isLoading = false;
				this.listaAtividade = retorno.body;

				if (this.relatorioForm.controls.codAtividade.value != 0) {
					let atividade: Atividade = <Atividade>this.listaAtividade.filter(atividade => atividade.codAtividade == this.relatorioForm.controls.codAtividade.value)[0];
					if (atividade) {
						this.relatorioForm.controls.atividade.setValue(atividade);
					}
				}

        this.listaAtividadesFiltradas = this.relatorioForm.controls.atividade.valueChanges
					.pipe(
						startWith(''),
						map(value => value === undefined || value === null ? "": value),
						map(value => typeof value === 'string' ? value : value.nomeAtividade),
						map(name => {
							return name ? this.filtraAtividade(name) : this.listaAtividade.slice();
						}));
			}
		)
	}

  private filtraAtividade(value: string): Atividade[] {
		const filterValue = value.toLowerCase();
		return this.listaAtividade.filter(item => item.nomeAtividade.trim().toLowerCase().includes(filterValue));
	}

	displayAtividade(atividade: Atividade): string {
		return atividade ? atividade.nomeAtividade : "";
	}

	selecionaAtividade(event) {
		let selecionado: Atividade = event.option.value;
		this.relatorioForm.controls.atividade.setValue(selecionado);
		this.relatorioForm.controls.codAtividade.setValue(selecionado.codAtividade);		
		
	}

  gerarRelatorio(event) {

    if (this.relatorioForm.valid)
    {

      this.isLoading = true;

      this.dataMapService.geraRelatorioMapaTratamento(this.relatorioForm.controls.codEmpresa.value,
                                                      this.relatorioForm.controls.codCicloMonitoramento.value,
                                                      this.relatorioForm.controls.codArea.value,
                                                      this.relatorioForm.controls.codProcesso.value,
                                                      this.relatorioForm.controls.codAtividade.value,
                                                      1).subscribe(
        (retorno) => {
          this.isLoading = false;

          if (retorno.body.length===0)
          {
            this.showMessage("Não Existem Dados Para a Seleção Informada", "Warn");
            return;
          }

          this.geraPlanilha(retorno.body);
        });

    } else {
        this.showMessage("Campos obrigatórios não foram preenchidos", "Warn");
    }
  }

  private geraPlanilha(listaDataMap: DataMap[]){

    const header = ["Empresa", "Área", "Atividade", "Processo","Dados Tratados","Origem","Destino","Base Legal",
                    "Dados Sensíveis","Dados de Menores","Necessidade Consentimento","Tranferência Internacional",
                    "Necessidade de Anonimização","Ciclo de Vida","Risco","Ações Necessárias"];

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Tratamento de Dados');                    

    let headerRow = worksheet.addRow(header);
    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.font = { name: 'Calibri', size: 11, bold: true, color: {argb : '222A35'} };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '9CC2E5' },
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
    });

    listaDataMap.forEach((dataMap) => {
      
      let metadados:String = "";
      let coleta: String = "";
      let armazenamento: String = "";
	  let plano:String = "";

      dataMap.metadados.forEach((dado) => {
        if (metadados.length!=0)
        {
          metadados = metadados + ",";
        }
        metadados = metadados + dado.nomeMetadados;
      });

      dataMap.formaColetas.forEach((dado) => {
        if (coleta.length!=0)
        {
          coleta = coleta + ",";
        }
        coleta = coleta + dado.nomeFormaColeta;
      });

      dataMap.armazenamentos.forEach((dado) => {
        if (armazenamento.length!=0)
        {
          armazenamento = armazenamento + ",";
        }
        armazenamento = armazenamento + dado.nomeLocalArmazenamento;
      });

	  dataMap.planoMitigacao.forEach((dado) => {
		if (plano.length!=0)
		{
			plano = plano + "\r\n";
		}
		plano = plano + dado.desPlanoMitigacao;
		});

      let dado = 
      [
        dataMap.nomeEmpresa,
        dataMap.nomeArea,
        dataMap.nomeAtividade,
        dataMap.nomeProcesso,
        metadados,
        coleta,
        armazenamento,
        dataMap.nomeBaseLegal,
        dataMap.indSensivel === 1 ? "Sim":"Não",
        dataMap.indDadosMenores === 1 ? "Sim":"Não",
        dataMap.indNecessitaConsentimento === 1 ? "Sim":"Não",
        dataMap.indTransfInternacional === 1 ? "Sim":"Não",
        dataMap.indAnonimizacao === 1 ? "Sim":"Não",
        dataMap.nomeCicloVida,
        dataMap.indRisco === 1 ? "Baixo": 
			dataMap.indRisco === 2 ? "Moderado": 
				dataMap.indRisco === 3 ? "Elevado":"Extremo",
		plano
      ]
      let row = worksheet.addRow(dado);
	  let colPlano = row.getCell(16);
	  colPlano.alignment =  { wrapText: true };

	  row.eachCell((cell, number) => {
		cell.font = { name: 'Calibri', size: 10, bold: false, color: {argb : 'FFFFFF'} };
		cell.fill = {
		  type: 'pattern',
		  pattern: 'solid',
		  fgColor: { argb: '1F4E78' },
		}
		cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
	  });

	  if (dataMap.indSensivel===1)
	  {
		this.trataFormatacao(row.getCell(9));
	  }

	  if (dataMap.indDadosMenores===1)
	  {
		this.trataFormatacao(row.getCell(10));
	  }

	  if (dataMap.indNecessitaConsentimento===1)
	  {
		this.trataFormatacao(row.getCell(11));
	  }

	  if (dataMap.indTransfInternacional===1)
	  {
		this.trataFormatacao(row.getCell(12));
	  }

	  if (dataMap.indAnonimizacao===1)
	  {
		this.trataFormatacao(row.getCell(13));
	  }

	  let colRisco = row.getCell(15);

	  switch(dataMap.indRisco)
	  {
		case 1:
		{
			colRisco.font = { name: 'Calibri', size: 10, bold: false, color: {argb : 'FFFFFF'} };
			colRisco.fill = {
		  		type: 'pattern',
		  		pattern: 'solid',
		  		fgColor: { argb: '92D050' },
			}	
			break;	
		}
		case 2:
		{
			colRisco.font = { name: 'Calibri', size: 10, bold: false, color: {argb : 'FFFFFF'} };
			colRisco.fill = {
		  		type: 'pattern',
		  		pattern: 'solid',
		  		fgColor: { argb: '92D050' },
			}	
			break;	
		}		
		case 3:
		{
			colRisco.font = { name: 'Calibri', size: 10, bold: false, color: {argb : '000000'} };
			colRisco.fill = {
		  		type: 'pattern',
		  		pattern: 'solid',
		  		fgColor: { argb: 'FFFF00' },
			}
			break;
		}
		case 4:
		{
			colRisco.font = { name: 'Calibri', size: 10, bold: false, color: {argb : 'FFFFFF'} };
			colRisco.fill = {
		  		type: 'pattern',
		  		pattern: 'solid',
		  		fgColor: { argb: 'FF0000' },
			}
			break;
		}
	  }
    });

	this.autoWidth(worksheet);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'TratamentoDados.xlsx');
    });

 }

 private autoWidth = (worksheet, minimalWidth = 10) => {
	worksheet.columns.forEach((column) => {
		let maxColumnLength = 0;
		column.eachCell({ includeEmpty: true }, (cell) => {
			maxColumnLength = Math.max(
				maxColumnLength,
				minimalWidth,
				cell.value ? cell.value.toString().length : 0
			);
		});
		column.width = maxColumnLength + 2;
	});
};

private autoHeight = (worksheet) => {
	const lineHeight = 12 // height per line is roughly 12
	worksheet.eachRow((row) => {
		let maxLine = 1;
		row.eachCell((cell) => {
			maxLine = Math.max(cell.value.split('\n').length - 1, maxLine)
		})
		row.height = lineHeight * maxLine
	})
}


 private trataFormatacao(cell: Cell)
 {
	cell.font = { name: 'Calibri', size: 10, bold: false, color: {argb : 'FFFFFF'} };
		cell.fill = {
		  type: 'pattern',
		  pattern: 'solid',
		  fgColor: { argb: 'FFC000' },
		}
		cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
 }

  private showMessage(msg: string, type: string = "Success") {
    this.snackBar.openSnackBar(msg, null, type);
  }

}