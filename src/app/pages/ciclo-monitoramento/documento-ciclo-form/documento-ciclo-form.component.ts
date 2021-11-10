import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { MatDialog } from '@angular/material';
import { DocumentoCicloService } from 'src/app/services/documento-ciclo.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';
import { DocumentoCiclo } from 'src/app/models/documento-ciclo/documento-ciclo';

@Component({
  selector: 'app-documento-form',
  templateUrl: './documento-ciclo-form.component.html',
  styleUrls: ['./documento-ciclo-form.component.css']
})
export class DocumentoCicloFormComponent implements OnInit {

  documentoCicloForm: FormGroup;
  codDocumentoCiclo: number;
  isLoading = false;
  codCicloMonitoramento: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: CustomSnackBarService,
    private router: Router,
    private dialog: MatDialog,
    private documentoCicloService: DocumentoCicloService,
  ) { }

  ngOnInit() {

    this.createForm();
    this.pesquisaDocumentoCiclo();
  }

  private createForm() {
    this.documentoCicloForm = this.formBuilder.group({      
      desDocumentoCiclo: ["", Validators.required],
      desEnderecoDocumento: ["", Validators.required],
    });
  }

  pesquisaDocumentoCiclo() {
    this.activatedRoute.params.subscribe(
      (data) => {
		    this.codCicloMonitoramento = parseInt(data["cicloId"]);
		    this.codDocumentoCiclo = parseInt(data["id?"]);

        if (this.codDocumentoCiclo) {
          this.documentoCicloService.pesquisarDocumentoCiclo(this.codDocumentoCiclo).subscribe(
            (retorno) => {
              this.documentoCicloForm.patchValue({
                desDocumentoCiclo: retorno.body[0].desDocumentoCiclo,
				        desEnderecoDocumento: retorno.body[0].desEnderecoDocumento
              });
              this.isLoading = false;
            },
            (err) => {
              if (err.status === 401)
                {
                  TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaDocumentoCiclo();}));
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

  salvarDocumentoCiclo() {
    if (this.documentoCicloForm.valid) {
      const documentoCiclo: DocumentoCiclo = this.documentoCicloForm.getRawValue();
      documentoCiclo.codDocumentoCiclo = this.codDocumentoCiclo;
      documentoCiclo.codCicloMonitoramento = this.codCicloMonitoramento;      

      if (this.codDocumentoCiclo) {
        // Alteração
        this.documentoCicloService.alterarDocumentoCiclo(documentoCiclo).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Documento do Ciclo de Monitoramento foi atualizado com sucesso!`,null);
            this.navigateToCicloMonitoramento();
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarDocumentoCiclo();}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        )
      } else {
        // Inclusão
        this.documentoCicloService.incluirDocumentoCiclo(documentoCiclo).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Documento do Ciclo de Monitoramento foi criado com sucesso!`,null);
            this.navigateToCicloMonitoramento();
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarDocumentoCiclo();}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        )
      }
    }
    else
    {
      this.snackBar.openSnackBar("Campos obrigatórios não foram preenchidos", null, "Warn");
    }
  }

  navigateToCicloMonitoramento()
	{
    this.router.navigate(["ciclo-monitoramento", this.codCicloMonitoramento]);
	}

}
