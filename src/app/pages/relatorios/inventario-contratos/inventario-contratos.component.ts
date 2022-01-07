import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Workbook } from 'exceljs';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Area } from 'src/app/models/area/area';
import { Atividade } from 'src/app/models/atividade/atividade';
import { Contrato } from 'src/app/models/contrato/contrato';
import { Empresa } from 'src/app/models/empresa/empresa';
import { Processo } from 'src/app/models/processo/processo';
import { AreaService } from 'src/app/services/area.service';
import { AtividadeService } from 'src/app/services/atividade.service';
import { ContratoService } from 'src/app/services/contrato.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ProcessoService } from 'src/app/services/processo.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { ExcelUtils } from 'src/app/shared/utils/excel-utils';
import * as fs from 'file-saver';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-inventario-contratos',
  templateUrl: './inventario-contratos.component.html',
  styleUrls: ['./inventario-contratos.component.css']
})
export class InventarioContratosComponent implements OnInit {

  isLoading = false;
  usuarioAdmin:boolean = this.authService.getLoggedUserType() === environment.tipoUsuaruioAdmin;

  listaEmpresas: Empresa[];
  listaEmpresasFiltradas: Observable<Empresa[]>;

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
      private contratoService: ContratoService,
      private snackBar: CustomSnackBarService,
      private authService: AuthService,		
    ) { }

    ngOnInit() {
      this.createForm();

      if (!this.usuarioAdmin)
      {
        this.relatorioForm.controls.codEmpresa.setValue(this.authService.getLoggedEmpresaUser());
        this.relatorioForm.controls.codArea.setValue(this.authService.getLoggedAreaUser());
      }


      this.pesquisaEmpresas();
      
    }

    private createForm() {
      this.relatorioForm = this.formBuilder.group({

        codEmpresa: [0, Validators.required],
        empresa: ["", Validators.required],			

        codArea: ["", Validators.required],
        area: ["", Validators.required],

        codProcesso: ["", ],
        processo: ["", ],

        codAtividade: ["", ],
        atividade: ["", ],			

      });
  }

    private pesquisaEmpresas() {
      this.isLoading = true;
      this.empresaService.listaTodasEmpresas().subscribe(
      (retorno) => {
        this.isLoading = false;
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

        if (!this.usuarioAdmin)
        {          
          this.pesquisaArea(codEmpresa);
        }            
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

    this.pesquisaArea(empresaSelecionada.codigoEmpresa);
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

        if (!this.usuarioAdmin)
        {          
          this.pesquisaProcesso(codArea);
        }             
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

			this.contratoService.geraRelatorioInventarioContrados(this.relatorioForm.controls.codEmpresa.value,
													                                  this.relatorioForm.controls.codArea.value,
													                                  this.relatorioForm.controls.codProcesso.value).subscribe(
				(retorno) => {
					this.isLoading = false;

					if (retorno.body.length===0)
					{
						this.showMessage("Não Existem Dados Para a Seleção Informada", "Warn");
						return;
					}

					this.geraPlanilha(retorno.body);
				},
        (err) => {
          this.isLoading = false;
          TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
        });


		} else {
			this.showMessage("Campos obrigatórios não foram preenchidos", "Warn");
		}
  }

  private geraPlanilha(listaContratos: Contrato[]){

		const header = ["Controladora", "Área", "Processo","Nome do Contrato","Endereço","Observações"];

		let workbook = new Workbook();
		let worksheet = workbook.addWorksheet('Inventário de Contratos');                    

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

		listaContratos.forEach((contrato) => {
		
      let dado = 
      [
        contrato.nomeEmpresa,
        contrato.nomeArea,
        contrato.nomeProcesso,
        contrato.objetoContrato,
        contrato.enderecoDocumento,
        contrato.obsContrato
      ]
      let row = worksheet.addRow(dado);

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
      fs.saveAs(blob, 'InventarioContratos.xlsx');
		});

	}

  private showMessage(msg: string, type: string = "Success") {
    this.snackBar.openSnackBar(msg, null, type);
  }

}
