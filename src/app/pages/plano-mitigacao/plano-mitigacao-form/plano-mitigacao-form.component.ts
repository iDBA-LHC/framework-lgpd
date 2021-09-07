import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanoMitigacao } from 'src/app/models/plano-mitigacao/plano-mitigacao';
import { AuthService } from 'src/app/services/auth.service';
import { CompartilhamentoService } from 'src/app/services/compartilhamento.service';
import { PlanoMitigacaoService } from 'src/app/services/plano-mitigacao.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-plano-mitigacao-form',
  templateUrl: './plano-mitigacao-form.component.html',
  styleUrls: ['./plano-mitigacao-form.component.css']
})
export class PlanoMitigacaoFormComponent implements OnInit {

  planoMitigacaoForm: FormGroup;
  planoMitigacaoId: number;
  isLoading = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: CustomSnackBarService,
    private router: Router,
    private dialog: MatDialog,
    private PlanoMitigacaoService: PlanoMitigacaoService,
    private compartilhamentoService: CompartilhamentoService
  ) { }

  ngOnInit() {
    //this.isLoading = true;

    this.createForm();
    this.pesquisaPlanoMitigacao();
  }

  private createForm() {
    this.planoMitigacaoForm = this.formBuilder.group({
      codDataMap: ["", Validators.required]      
    });
  }

  pesquisaPlanoMitigacao() {
    this.activatedRoute.params.subscribe(
      (data) => {
        this.planoMitigacaoId = parseInt(data["id?"]);
        
        if (this.planoMitigacaoId) {
          this.PlanoMitigacaoService.pesquisaPlanoMitigacao(this.planoMitigacaoId).subscribe(
            (retorno) => {
              this.planoMitigacaoForm.patchValue({
                codDataMap: retorno.body[0].codDataMap                
              });
            },
            (err) => {
              if (err.status === 401)
                {
                  TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaPlanoMitigacao();}));
                }
                else
                {
                  TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
                }
            }
          );
        }
      }
    )
  }

  salvarPlanoMitigacao() {
    if (this.planoMitigacaoForm.valid) {
      const PlanoMitigacao: PlanoMitigacao = this.planoMitigacaoForm.getRawValue();
      PlanoMitigacao.codPlanoMitigacao = this.planoMitigacaoId;
      
      if (this.planoMitigacaoId) {
        // Alteração
        this.PlanoMitigacaoService.alterarPlanoMitigacao(PlanoMitigacao).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Plano de Mitigação foi atualizado com sucesso!`,null);
              this.router.navigate(["/plano-mitigacao"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarPlanoMitigacao();}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        )
      } else {
        // Inclusão
        this.PlanoMitigacaoService.incluirPlanoMitigacao(PlanoMitigacao).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Plano de Mitigação foi criado com sucesso!`,null);
            this.router.navigate(["/plano-mitigacao"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarPlanoMitigacao();}));
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
