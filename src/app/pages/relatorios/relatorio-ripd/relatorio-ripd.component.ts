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
import { ExcelUtils } from 'src/app/shared/utils/excel-utils';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'app-relatorio-ripd',
	templateUrl: './relatorio-ripd.component.html',
	styleUrls: ['./relatorio-ripd.component.css']
})
export class RelatorioRIPDComponent implements OnInit {

	isLoading = false;

	constructor(
    	private formBuilder: FormBuilder,
  	) { }

	relatorioForm: FormGroup;

	ngOnInit() {
		this.relatorioForm = this.formBuilder.group({});
	}

	gerarRelatorio(event) {
		const filePath = `assets/docs/PRIVA-Template-RIPD.pdf`;
		const link = document.createElement('a');
		link.href = filePath;
		link.download = "PRIVA-Template-RIPD.pdf";
		link.click();
	}

}
