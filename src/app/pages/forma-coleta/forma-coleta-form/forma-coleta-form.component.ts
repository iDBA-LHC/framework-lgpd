import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { FormaColeta } from 'src/app/models/forma-coleta/forma-coleta';
import { AuthService } from 'src/app/services/auth.service';
import { FormaColetaService } from 'src/app/services/forma-coleta.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-forma-coleta-form',
  templateUrl: './forma-coleta-form.component.html',
  styleUrls: ['./forma-coleta-form.component.css']
})
export class FormaColetaFormComponent implements OnInit {
  
  formaColetaForm: FormGroup;
  formaColetaCodigo: number;
  isLoading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: CustomSnackBarService,
    private router: Router,
    private dialog: MatDialog,
    private formaColetaService: FormaColetaService
  ) { }

  ngOnInit() {
    this.isLoading = true;

    this.createForm();
    this.pesquisaFormaColeta();
  }

  private createForm() {
    this.formaColetaForm = this.formBuilder.group({
      nomeFormaColeta: ["", Validators.required]
    });
  }

  pesquisaFormaColeta() {
    this.activatedRoute.params.subscribe(
      (data) => {
        this.formaColetaCodigo = parseInt(data["id?"]);

        if (this.formaColetaCodigo) {
          this.formaColetaService.pesquisaFormaColeta(this.formaColetaCodigo).subscribe(
            (retorno) => {
              this.formaColetaForm.patchValue({
                nomeFormaColeta: retorno.body[0].nomeFormaColeta
              });
            },
            (err) => {
              if (err.status === 401)
              {
                TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaFormaColeta();}));
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

  salvarFormaColeta() {
    if (this.formaColetaForm.valid) {
      const formaColeta: FormaColeta = this.formaColetaForm.getRawValue();
      formaColeta.codFormaColeta = this.formaColetaCodigo;

      if (this.formaColetaCodigo) {
        // Alteração
        this.formaColetaService.alterarFormaColeta(formaColeta).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`A Forma Coleta ${formaColeta.nomeFormaColeta} foi atualizado com sucesso!`,null);
            this.router.navigate(["/priva/forma-coleta"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarFormaColeta();}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        )
      } else {
        // Inclusão
        this.formaColetaService.incluirFormaColeta(formaColeta).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`A Forma Coleta ${formaColeta.nomeFormaColeta} foi criada com sucesso!`,null);
            this.router.navigate(["/priva/forma-coleta"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarFormaColeta();}));
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
