import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DataFlow } from 'src/app/models/data-flow/data-flow';
import { AuthService } from 'src/app/services/auth.service';
import { CompartilhamentoService } from 'src/app/services/compartilhamento.service';
import { DataFlowService } from 'src/app/services/data-flow.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-data-flow-form',
  templateUrl: './data-flow-form.component.html',
  styleUrls: ['./data-flow-form.component.css']
})
export class DataFlowFormComponent implements OnInit {

  dataFlowForm: FormGroup;
  dataFlowId: number;
  isLoading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: CustomSnackBarService,
    private router: Router,
    private dialog: MatDialog,
    private DataFlowService: DataFlowService,
    private compartilhamentoService: CompartilhamentoService
  ) { }

  ngOnInit() {
    //this.isLoading = true;

    this.createForm();
    this.pesquisaDataFlow();
  }

  private createForm() {
    this.dataFlowForm = this.formBuilder.group({      
	  //codCicloMonitoramento: ["", Validators.required],
    });
  }

  pesquisaDataFlow() {
    this.activatedRoute.params.subscribe(
      (data) => {
        this.dataFlowId = parseInt(data["id?"]);
        
        if (this.dataFlowId) {
          this.DataFlowService.pesquisaDataFlow(this.dataFlowId).subscribe(
            (retorno) => {
              this.dataFlowForm.patchValue({
                codDataFlow: retorno.body[0].codDataFlow                
              });
            },
            (err) => {
              if (err.status === 401)
                {
                  TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaDataFlow();}));
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

  salvarDataFlow() {
    if (this.dataFlowForm.valid) {
      const DataFlow: DataFlow = this.dataFlowForm.getRawValue();
      DataFlow.codDataFlow = this.dataFlowId;      

      if (this.dataFlowId) {
        // Alteração
        this.DataFlowService.alterarDataFlow(DataFlow).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Data Map foi atualizado com sucesso!`,null);
              this.router.navigate(["/data-flow"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarDataFlow();}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        )
      } else {
        // Inclusão
        this.DataFlowService.incluirDataFlow(DataFlow).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Data Map foi criado com sucesso!`,null);
            this.router.navigate(["/data-flow"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarDataFlow();}));
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
