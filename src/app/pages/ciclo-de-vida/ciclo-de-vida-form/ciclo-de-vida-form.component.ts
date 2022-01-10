import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CicloDeVida } from 'src/app/models/ciclo-de-vida/ciclo-de-vida';
import { AuthService } from 'src/app/services/auth.service';
import { CicloDeVidaService } from 'src/app/services/ciclo-de-vida.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-ciclo-de-vida-form',
  templateUrl: './ciclo-de-vida-form.component.html',
  styleUrls: ['./ciclo-de-vida-form.component.css']
})
export class CicloDeVidaFormComponent implements OnInit {
  
  cicloDeVidaForm: FormGroup;
  cicloVidaCodigo: number;
  isLoading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: CustomSnackBarService,
    private router: Router,
    private dialog: MatDialog,
    private cicloDeVidaService: CicloDeVidaService
  ) { }

  ngOnInit() {
    this.isLoading = true;

    this.createForm();
    this.pesquisaCicloDeVida();
  }

  private createForm() {
    this.cicloDeVidaForm = this.formBuilder.group({
      nomeCicloVida: ["", Validators.required]
    });
  }

  pesquisaCicloDeVida() {
    this.activatedRoute.params.subscribe(
      (data) => {
        this.cicloVidaCodigo = parseInt(data["id?"]);

        if (this.cicloVidaCodigo) {
          this.cicloDeVidaService.pesquisaCicloDeVida(this.cicloVidaCodigo).subscribe(
            (retorno) => {
              this.cicloDeVidaForm.patchValue({
                nomeCicloVida: retorno.body[0].nomeCicloVida
              });
            },
            (err) => {
              if (err.status === 401)
              {
                TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaCicloDeVida();}));
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

  salvarCicloDeVida() {
    if (this.cicloDeVidaForm.valid) {
      const cicloDeVida: CicloDeVida = this.cicloDeVidaForm.getRawValue();
      cicloDeVida.codCicloVida = this.cicloVidaCodigo;

      if (this.cicloVidaCodigo) {
        // Alteração
        this.cicloDeVidaService.alterarCicloDeVida(cicloDeVida).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Ciclo De Vida ${cicloDeVida.nomeCicloVida} foi atualizado com sucesso!`,null);
            this.router.navigate(["/ciclo-de-vida"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarCicloDeVida();}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        )
      } else {
        // Inclusão
        this.cicloDeVidaService.incluirCicloDeVida(cicloDeVida).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Ciclo De Vida ${cicloDeVida.nomeCicloVida} foi criada com sucesso!`,null);
            this.router.navigate(["/ciclo-de-vida"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarCicloDeVida();}));
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
