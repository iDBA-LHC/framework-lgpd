import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Processo } from 'src/app/models/processo/processo';
import { AuthService } from 'src/app/services/auth.service';
import { ProcessoService } from 'src/app/services/processo.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-processo-form',
  templateUrl: './processo-form.component.html',
  styleUrls: ['./processo-form.component.css']
})
export class ProcessoFormComponent implements OnInit {

  processoForm: FormGroup;
  processoId: number;
  areaId: number;
  isLoading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private processoService: ProcessoService,
    private snackBar: CustomSnackBarService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.isLoading = true;

    this.createForm();
    this.pesquisaProcesso();
  }

  private createForm() {
    this.processoForm = this.formBuilder.group({
      nomeProcesso: ["", Validators.required],
      obsProcesso: [],
    });
  }

  private pesquisaProcesso() {
    this.activatedRoute.params.subscribe(
      (data) => {
        this.areaId = parseInt(data["areaId"]);
        this.processoId = parseInt(data["id?"]);

        if (this.processoId) {
          this.processoService.pesquisaProcesso(this.processoId).subscribe(
            (retorno) => {
              this.processoForm.patchValue({
                nomeProcesso: retorno.body[0].nomeProcesso,
                obsProcesso: retorno.body[0].obsProcesso
              });

              this.isLoading = false;
            }
          )
        } else {
          this.isLoading = false;
        }
      }
    )
  }

  private salvarProcesso() {
    if (this.processoForm.valid) {
      const processo: Processo = this.processoForm.getRawValue();
      processo.codProcesso = this.processoId;
      processo.codArea = this.areaId;
      processo.codUsuarioAlteracao = this.authService.getLoggedUserId();

      if (this.processoId) {
        // Alteração
        this.processoService.alterarProcesso(processo).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Processo ${processo.nomeProcesso} foi atualizado com sucesso!`,null);
            this.router.navigate(["/area", this.areaId]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarProcesso();}));            
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        )
      } else {
        // Inclusão
        this.processoService.incluirProcesso(processo).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Processo ${processo.nomeProcesso} foi criado com sucesso!`,null);
            this.router.navigate(["/area", this.areaId]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarProcesso();}));
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
