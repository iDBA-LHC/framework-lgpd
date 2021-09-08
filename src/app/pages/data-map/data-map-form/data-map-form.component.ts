import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DataMap } from 'src/app/models/data-map/data-map';
import { AuthService } from 'src/app/services/auth.service';
import { CompartilhamentoService } from 'src/app/services/compartilhamento.service';
import { DataMapService } from 'src/app/services/data-map.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-data-map-form',
  templateUrl: './data-map-form.component.html',
  styleUrls: ['./data-map-form.component.css']
})
export class DataMapFormComponent implements OnInit {

  dataMapForm: FormGroup;
  dataMapId: number;
  isLoading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: CustomSnackBarService,
    private router: Router,
    private dialog: MatDialog,
    private DataMapService: DataMapService,
    private compartilhamentoService: CompartilhamentoService
  ) { }

  ngOnInit() {
    //this.isLoading = true;

    this.createForm();
    this.pesquisaDataMap();
  }

  private createForm() {
    this.dataMapForm = this.formBuilder.group({
	  codCicloMonitoramento: ["", Validators.required],
    codDataMap: ["", Validators.required],
    codAtividade: ["", Validators.required],
    indTipo: ["", Validators.required],
    codCicloVida: ["", Validators.required],
    codBaseLegal: ["", Validators.required],
    codMetaDados: ["", Validators.required],
    indPrincipios: ["", Validators.required],
    indSensivel: ["", Validators.required],
    indDadosMenores: ["", Validators.required],
    indNecessitaConsentimento: ["", Validators.required],
    indTransfInternacional: ["", Validators.required],
    indAnonimizacao: ["", Validators.required],
    indRisco: ["", Validators.required],
    desobservacoes: ["", Validators.required],
    formaColetas: ["", Validators.required],
    compartilhamentos: ["", Validators.required],
    armazenamentos: ["", Validators.required],

    });
  }

  pesquisaDataMap() {
    this.activatedRoute.params.subscribe(
      (data) => {
        this.dataMapId = parseInt(data["id?"]);

        if (this.dataMapId) {
          this.DataMapService.pesquisaDataMap(this.dataMapId).subscribe(
            (retorno) => {
              this.dataMapForm.patchValue({
                codDataMap: retorno.body[0].codDataMap
              });
            },
            (err) => {
              if (err.status === 401)
                {
                  TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaDataMap();}));
                }
                else
                {
                  TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
                }
            }
          );
        }
      }
    )
  }

  salvarDataMap() {
    if (this.dataMapForm.valid) {
      const DataMap: DataMap = this.dataMapForm.getRawValue();
      DataMap.codDataMap = this.dataMapId;

      if (this.dataMapId) {
        // Alteração
        this.DataMapService.alterarDataMap(DataMap).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Data Map foi atualizado com sucesso!`,null);
              this.router.navigate(["/data-map"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarDataMap();}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        )
      } else {
        // Inclusão
        this.DataMapService.incluirDataMap(DataMap).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Data Map foi criado com sucesso!`,null);
            this.router.navigate(["/data-map"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarDataMap();}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        )
      }
    }
  }
}
