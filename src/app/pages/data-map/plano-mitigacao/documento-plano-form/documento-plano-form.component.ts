import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentoPlano } from 'src/app/models/documento-plano/documento-plano';
import { AuthService } from 'src/app/services/auth.service';
import { CompartilhamentoService } from 'src/app/services/compartilhamento.service';
import { DocumentoPlanoService } from 'src/app/services/documento-plano.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-documento-plano-form',
  templateUrl: './documento-plano-form.component.html',
  styleUrls: ['./documento-plano-form.component.css']
})
export class DocumentoPlanoFormComponent implements OnInit {

  documentoPlanoForm: FormGroup;
  codDataMap: number;
  codDocumentoPlano: number;
  codPlanoMitigacao: number;
  isLoading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: CustomSnackBarService,
    private router: Router,
    private dialog: MatDialog,
    private DocumentoPlanoService: DocumentoPlanoService,
  ) { }

  ngOnInit() {
    this.isLoading = true;

    this.createForm();
    this.pesquisaDocumentoPlano();
  }

  private createForm() {
    this.documentoPlanoForm = this.formBuilder.group({      
      desDocumentoPlano: ["", Validators.required],
      desEnderecoPlano: ["", Validators.required],
    });
  }

  pesquisaDocumentoPlano() {
    this.activatedRoute.params.subscribe(
      (data) => {
		    this.codDataMap = parseInt(data["codDataMap"]);
        this.codPlanoMitigacao = parseInt(data["codPlanoMitigacao"]);
		    this.codDocumentoPlano = parseInt(data["id?"]);

        if (this.codDocumentoPlano) {
          this.DocumentoPlanoService.pesquisaDocumentoPlano(this.codDocumentoPlano).subscribe(
            (retorno) => {
              this.documentoPlanoForm.patchValue({
                desDocumentoPlano: retorno.body[0].desDocumentoPlano,
				        desEnderecoPlano: retorno.body[0].desEnderecoPlano
              });
              this.isLoading = false;
            },
            (err) => {
              if (err.status === 401)
                {
                  TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaDocumentoPlano();}));
                }
                else
                {
                  TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
                }
            }
          );
        }
        else
          this.isLoading = false;
      }
    )
  }

  salvarDocumentoPlano() {
    if (this.documentoPlanoForm.valid) {
      const documentoPlano: DocumentoPlano = this.documentoPlanoForm.getRawValue();
      documentoPlano.codDocumentoPlano = this.codDocumentoPlano;
      documentoPlano.codPlanoMitigacao = this.codPlanoMitigacao;

      if (this.codDocumentoPlano) {
        // Alteração
        this.DocumentoPlanoService.alterarDocumentoPlano(documentoPlano).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Documento Plano foi atualizado com sucesso!`,null);
            this.navigateToPlanoMitigacao();
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarDocumentoPlano();}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        )
      } else {
        // Inclusão
        this.DocumentoPlanoService.incluirDocumentoPlano(documentoPlano).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Documento Plano foi criado com sucesso!`,null);
            this.navigateToPlanoMitigacao();
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarDocumentoPlano();}));
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

  navigateToPlanoMitigacao()
	{
    this.router.navigate(["/priva/data-analisys-map", this.codDataMap, "plano-mitigacao", this.codPlanoMitigacao]);
	}
}
