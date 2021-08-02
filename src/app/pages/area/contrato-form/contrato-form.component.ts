import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Contrato } from 'src/app/models/contrato/contrato';
import { AuthService } from 'src/app/services/auth.service';
import { ContratoService } from 'src/app/services/contrato.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-contrato-form',
  templateUrl: './contrato-form.component.html',
  styleUrls: ['./contrato-form.component.css']
})
export class ContratoFormComponent implements OnInit {

  contratoForm: FormGroup;
  areaId: number;
  processoId: number;
  contratoId: number;
  isLoading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private contratoService: ContratoService,
    private snackBar: CustomSnackBarService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.isLoading = true;

    this.createForm();
    this.pesquisaContrato();
  }

  createForm() {
    this.contratoForm = this.formBuilder.group({
      objetoContrato: ["", Validators.required],
      indTipoContrato: [0, Validators.required],
      obsContrato: [],
      enderecoDocumento: [],
    });
  }

  pesquisaContrato() {
    this.activatedRoute.params.subscribe(
      (data) => {
        this.areaId = parseInt(data["areaId"]);
        this.processoId = parseInt(data["processoId"]);
        this.contratoId = parseInt(data["id?"]);

        if (this.contratoId) {
          this.contratoService.pesquisaContrato(this.contratoId).subscribe(
            (retorno) => {
              this.contratoForm.patchValue({
                objetoContrato: retorno.body[0].objetoContrato,
                obsContrato: retorno.body[0].obsContrato,
                indTipoContrato: retorno.body[0].indTipoContrato,
                enderecoDocumento: retorno.body[0].enderecoDocumento
              });

              this.isLoading = false;
            }
          )
        } else {
          this.isLoading = false;
        }
      }
    );
  }

  salvarContrato() {
    if (this.contratoForm.valid) {
      const contrato: Contrato = this.contratoForm.getRawValue();
      contrato.codContrato = this.contratoId;
      contrato.codProcesso = this.processoId;
      contrato.codUsuarioAlteracao = this.authService.getLoggedUserId();

      if (this.contratoId) {
        // Alteração
        this.contratoService.alterarContrato(contrato).subscribe(
          (retorno) => {
            this.snackBar.openSnackBar(`O Contrato ${contrato.objetoContrato} foi atualizado com sucesso!`,null);
            this.router.navigate(["area", this.areaId, "processo", this.processoId]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarContrato();}));            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        )
      } else {
        // Inclusão
        this.contratoService.incluirContrato(contrato).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Contrato ${contrato.objetoContrato} for criado com sucesso!`, null);
            this.router.navigate(["area", this.areaId, "processo", this.processoId])
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarContrato();}));
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
