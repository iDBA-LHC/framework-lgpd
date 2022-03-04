import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Ameaca } from 'src/app/models/ameaca/ameaca';
import { AmeacaService } from 'src/app/services/ameaca.service';
import { AuthService } from 'src/app/services/auth.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-ameaca-form',
  templateUrl: './ameaca-form.component.html',
  styleUrls: ['./ameaca-form.component.css']
})
export class AmeacaFormComponent implements OnInit {

  ameacaForm: FormGroup;
  codigoAmeaca: number;
  isLoading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: CustomSnackBarService,
    private router: Router,
    private ameacaService: AmeacaService
  ) { }

  ngOnInit() {

    this.createForm();
    this.pesquisaAmeaca();
  }

  private createForm() {
    this.ameacaForm = this.formBuilder.group({
      nomeAmeaca: ["", Validators.required]
    });
  }

  pesquisaAmeaca() {
    this.activatedRoute.params.subscribe(
      (data) => {
        this.codigoAmeaca = parseInt(data["id?"]);

        if (this.codigoAmeaca) {
          this.ameacaService.pesquisaAmeaca(this.codigoAmeaca).subscribe(
            (retorno) => {
              this.ameacaForm.patchValue({
                nomeAmeaca: retorno.body[0].nomeAmeaca
              });
            },
            (err) => {
              if (err.status === 401)
              {
                TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaAmeaca();}));
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

  salvarAmeaca() {
    if (this.ameacaForm.valid) {
      const ameaca: Ameaca = this.ameacaForm.getRawValue();
      ameaca.codigoAmeaca = this.codigoAmeaca;

      if (this.codigoAmeaca) {
        // Alteração
        this.ameacaService.alterarAmeaca(ameaca).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`A Ameaça ${ameaca.nomeAmeaca} foi atualizada com sucesso!`,null);
            this.router.navigate(["/priva/ameaca"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarAmeaca();}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        )
      } else {
        // Inclusão
        this.ameacaService.incluirAmeaca(ameaca).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`A Ameaça ${ameaca.nomeAmeaca} foi criada com sucesso!`,null);
            this.router.navigate(["/priva/ameaca"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarAmeaca();}));
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

