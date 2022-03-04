import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RiscoAssociado } from 'src/app/models/risco-associado/risco-associado';
import { AuthService } from 'src/app/services/auth.service';
import { RiscoAssociadoService } from 'src/app/services/risco-associado.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-risco-associado-form',
  templateUrl: './risco-associado-form.component.html',
  styleUrls: ['./risco-associado-form.component.css']
})
export class RiscoAssociadoFormComponent implements OnInit {

  riscoAssociadoForm: FormGroup;
  codigoRiscoAssociado: number;
  isLoading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: CustomSnackBarService,
    private router: Router,
    private riscoAssociadoService: RiscoAssociadoService
  ) { }

  ngOnInit() {

    this.createForm();
    this.pesquisaRiscoAssociado();
  }

  private createForm() {
    this.riscoAssociadoForm = this.formBuilder.group({
      nomeRiscoAssociado: ["", Validators.required]
    });
  }

  pesquisaRiscoAssociado() {
    this.activatedRoute.params.subscribe(
      (data) => {
        this.codigoRiscoAssociado = parseInt(data["id?"]);

        if (this.codigoRiscoAssociado) {
          this.riscoAssociadoService.pesquisaRiscoAssociado(this.codigoRiscoAssociado).subscribe(
            (retorno) => {
              this.riscoAssociadoForm.patchValue({
                nomeRiscoAssociado: retorno.body[0].nomeRiscoAssociado
              });
            },
            (err) => {
              if (err.status === 401)
              {
                TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaRiscoAssociado();}));
              }
              else
              {
                TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
              }
            }
          );
        }

        this.isLoading = false;
      }
    )
  }

  salvarRiscoAssociado() {
    if (this.riscoAssociadoForm.valid) {
      const riscoAssociado: RiscoAssociado = this.riscoAssociadoForm.getRawValue();
      riscoAssociado.codigoRiscoAssociado = this.codigoRiscoAssociado;

      if (this.codigoRiscoAssociado) {
        // Alteração
        this.riscoAssociadoService.alterarRiscoAssociado(riscoAssociado).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Risco Associado ${riscoAssociado.nomeRiscoAssociado} foi atualizado com sucesso!`,null);
            this.router.navigate(["/priva/risco-associado"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarRiscoAssociado();}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        )
      } else {
        // Inclusão
        this.riscoAssociadoService.incluirRiscoAssociado(riscoAssociado).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Risco Associado ${riscoAssociado.nomeRiscoAssociado} foi criado com sucesso!`,null);
            this.router.navigate(["/priva/risco-associado"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarRiscoAssociado();}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        );
      }
    }
    else {
      this.snackBar.openSnackBar("Campos obrigatórios não foram preenchidos", null, "Warn");
    }
  }
}
