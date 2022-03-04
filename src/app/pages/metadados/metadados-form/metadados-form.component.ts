import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Metadados } from 'src/app/models/metadados/metadados';
import { AuthService } from 'src/app/services/auth.service';
import { MetadadosService } from 'src/app/services/metadados.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-metadados-form',
  templateUrl: './metadados-form.component.html',
  styleUrls: ['./metadados-form.component.css']
})
export class MetadadosFormComponent implements OnInit {

  metadadosForm: FormGroup;
  metadadosCodigo: number;
  isLoading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: CustomSnackBarService,
    private router: Router,
    private dialog: MatDialog,
    private metadadosService: MetadadosService
  ) { }

  ngOnInit() {
    this.isLoading = true;

    this.createForm();
    this.pesquisaMetadados();
  }

  private createForm() {
    this.metadadosForm = this.formBuilder.group({
      nomeMetadados: ["", Validators.required],
      indSensivel: [false, ]
    });
  }

  pesquisaMetadados() {
    this.activatedRoute.params.subscribe(
      (data) => {
        this.metadadosCodigo = parseInt(data["id?"]);

        if (this.metadadosCodigo) {
          this.metadadosService.pesquisaMetadados(this.metadadosCodigo).subscribe(
            (retorno) => {
              this.metadadosForm.patchValue({
                nomeMetadados: retorno.body[0].nomeMetadados,
                indSensivel: retorno.body[0].indSensivel == 0 ? false : true,
              });
            },
            (err) => {
              if (err.status === 401)
              {
                TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaMetadados();}));
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

  salvarMetadados() {
    if (this.metadadosForm.valid) {
      const metadados: Metadados = this.metadadosForm.getRawValue();
      metadados.codMetadados = this.metadadosCodigo;
      
      if (this.metadadosForm.controls.indSensivel.value)
        metadados.indSensivel = 1;
      else
        metadados.indSensivel = 0;
      // metadados.indSensivel = parseInt(((this.metadadosForm.controls.indSensivel.value === true) ? 1 : 0));

      if (this.metadadosCodigo) {
        // Alteração
        this.metadadosService.alterarMetadados(metadados).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Metadados ${metadados.nomeMetadados} foi atualizado com sucesso!`,null);
            this.router.navigate(["/priva/metadados"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarMetadados();}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        )
      } else {
        // Inclusão
        this.metadadosService.incluirMetadados(metadados).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Metadados ${metadados.nomeMetadados} foi criado com sucesso!`,null);
            this.router.navigate(["/priva/metadados"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarMetadados();}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        )
      }
    }
    else {
      this.snackBar.openSnackBar("Campos obrigatórios não foram preenchidos", null, "Warn");
    }
  }

}
