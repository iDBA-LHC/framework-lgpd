import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseLegal } from 'src/app/models/base-legal/base-legal';
import { AuthService } from 'src/app/services/auth.service';
import { BaseLegalService } from 'src/app/services/base-legal.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-base-legal-form',
  templateUrl: './base-legal-form.component.html',
  styleUrls: ['./base-legal-form.component.css']
})
export class BaseLegalFormComponent implements OnInit {

  baseLegalForm: FormGroup;
  baseLegalId: number;
  isLoading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: CustomSnackBarService,
    private router: Router,
    private dialog: MatDialog,
    private baseLegalService: BaseLegalService
  ) { }

  ngOnInit() {
      this.isLoading = true;

      this.createForm();
      this.pesquisaBaseLegal();
  }

  private createForm() {
    this.baseLegalForm = this.formBuilder.group({
      nomeBase: ["", Validators.required]
    });
  }

  pesquisaBaseLegal() {
    this.activatedRoute.params.subscribe(
      (data) => {
        this.baseLegalId = data["id?"];
        // Quando criar uma rota para buscar um único ID, descomentar
        // this.baseLegalService.pesquisaBaseLegal(this.baseLegalId).subscribe(
        //   (retorno) => {
        //     this.baseLegalForm.patchValue({
        //       nomeBase: retorno.body[0].nomeBase
        //     });
        //   },
        //   (err) => {
        //     if (err.status === 401)
        //       {
        //         TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaBaseLegal();}));
        //       }
        //       else
        //       {
        //         TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
        //       }
        //   }
        // );

        this.baseLegalService.listaTodasBasesLegais().subscribe(
            (response) => {
                console.log(`Recebeu ${JSON.stringify(response.body)}`);
                
                for (let element of response.body) {
                  if (element.codigoBase == this.baseLegalId) {
                    this.baseLegalForm.patchValue({
                        nomeBase: element.nomeBase
                    });
                  }
                }
            },
            (err) => {
                if (err.status == 401) {
                    TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaBasesLegais();}));
                } else {
                    this.isLoading = false;
                    TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
                }
            }
        )

        this.isLoading = false;
      }
    )
  }

  salvarBaseLegal() {
    if (this.baseLegalForm.valid) {
      const baseLegal: BaseLegal = this.baseLegalForm.getRawValue();
      baseLegal.codigoBase = this.baseLegalId;

      if (this.baseLegalId) {
        // Alteração
        this.baseLegalService.alterarBaseLegal(baseLegal).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`A Base Legal ${baseLegal.nomeBase} foi atualizada com sucesso!`,null);
            this.router.navigate(["/base-legal"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarBaseLegal();}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        )
      } else {
        // Inclusão
        this.baseLegalService.incluirBaseLegal(baseLegal).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`A Base Legal ${baseLegal.nomeBase} foi criada com sucesso!`,null);
            this.router.navigate(["/base-legal"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarBaseLegal();}));
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
