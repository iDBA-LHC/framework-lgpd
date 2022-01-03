import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Risco } from 'src/app/models/risco/risco';
import { AuthService } from 'src/app/services/auth.service';
import { RiscoService } from 'src/app/services/risco.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-risco-form',
  templateUrl: './risco-form.component.html',
  styleUrls: ['./risco-form.component.css']
})
export class RiscoFormComponent implements OnInit {

  form: FormGroup;
  codigoRisco: number;
  isLoading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: CustomSnackBarService,
    private router: Router,
    private service: RiscoService
  ) { }

  ngOnInit() {

    this.createForm();
    this.pesquisa();
  }

  private createForm() {
    this.form = this.formBuilder.group({
      nomeRisco: ["", Validators.required],
      descricaoRisco: ["",Validators.required],
      nomeCausas: ["",Validators.required],
      nomeAmeacas: ["",Validators.required],
      nomeInteressados: ["",Validators.required],
      nomeAcoesSugeridas: ["",Validators.required],
      nomeTempoResposta: ["",Validators.required]
    });
  }

  pesquisa() {
    this.activatedRoute.params.subscribe(
      (data) => {
        this.codigoRisco = parseInt(data["id?"]);

        if (this.codigoRisco) {
          this.service.pesquisa(this.codigoRisco).subscribe(
            (retorno) => {
              this.form.patchValue({
                nomeRisco: retorno.body[0].nomeRisco,
                descricaoRisco: retorno.body[0].descricaoRisco,
                nomeCausas: retorno.body[0].nomeCausas,
                nomeAmeacas: retorno.body[0].nomeAmeacas,
                nomeInteressados: retorno.body[0].nomeInteressados,
                nomeAcoesSugeridas: retorno.body[0].nomeAcoesSugeridas,
                nomeTempoResposta: retorno.body[0].nomeTempoResposta
              });
            },
            (err) => {
              if (err.status === 401)
              {
                TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisa();}));
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

  salvar() {
    if (this.form.valid) {
      const registro: Risco = this.form.getRawValue();
      registro.codigoRisco = this.codigoRisco;

      if (this.codigoRisco) {
        // Alteração
        this.service.alterar(registro).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Risco ${registro.nomeRisco} foi atualizado com sucesso!`,null);
            this.router.navigate(["/risco"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvar();}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        )
      } else {
        // Inclusão
        this.service.incluir(registro).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Risco ${registro.nomeRisco} foi criado com sucesso!`,null);
            this.router.navigate(["/risco"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvar();}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        );
      }
    }
  }
}

