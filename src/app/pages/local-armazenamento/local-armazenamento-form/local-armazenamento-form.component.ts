import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, ChildrenOutletContexts, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Compartilhamento } from 'src/app/models/compartilhamento/compartilhamento';
import { LocalArmazenamento } from 'src/app/models/local-armazenamento/local-armazenamento';
import { AuthService } from 'src/app/services/auth.service';
import { CompartilhamentoService } from 'src/app/services/compartilhamento.service';
import { LocalArmazenamentoService } from 'src/app/services/local-armazenamento.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-local-armazenamento-form',
  templateUrl: './local-armazenamento-form.component.html',
  styleUrls: ['./local-armazenamento-form.component.css']
})
export class LocalArmazenamentoFormComponent implements OnInit {

  localArmazenamentoForm: FormGroup;
  localArmazenamentoId: number;
  isLoading = false;

  compartilhamentoAnt: Compartilhamento;
  listaCompartilhamento: Compartilhamento[];
  listaCompartilhamentoFiltrados: Observable<Compartilhamento []>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: CustomSnackBarService,
    private router: Router,
    private dialog: MatDialog,
    private localArmazenamentoService: LocalArmazenamentoService,
    private compartilhamentoService: CompartilhamentoService
  ) { }

  ngOnInit() {
    this.isLoading = true;

    this.createForm();
    this.pesquisaLocalArmazenamento();
  }

  private createForm() {
    this.localArmazenamentoForm = this.formBuilder.group({
      nomeLocalArmazenamento: ["", Validators.required],
      indDocumentoEletronico: [false, ],
      indProvedorNacional: [false, ],
      indNuvem: [false, ],
      nomeProvedorNuvem: ["", ],
      codCompartilhamento: [],
      compartilhamento: []
    });
  }

  pesquisaLocalArmazenamento() {
    this.activatedRoute.params.subscribe(
      (data) => {
        this.localArmazenamentoId = parseInt(data["id?"]);
        
        if (this.localArmazenamentoId) {
          this.localArmazenamentoService.pesquisaLocalArmazenamento(this.localArmazenamentoId).subscribe(
            (retorno) => {
              this.localArmazenamentoForm.patchValue({
                nomeLocalArmazenamento: retorno.body[0].nomeLocalArmazenamento,
                indDocumentoEletronico: retorno.body[0].indDocumentoEletronico,
                indProvedorNacional: retorno.body[0].indProvedorNacional,
                indNuvem: retorno.body[0].indNuvem,
                nomeProvedorNuvem: retorno.body[0].nomeProvedorNuvem,
                codCompartilhamento: retorno.body[0].codCompartilhamento,
              });

              this.pesquisaCompartilhamentos();
            },
            (err) => {
              if (err.status === 401)
                {
                  TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaLocalArmazenamento();}));
                }
                else
                {
                  TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
                }
            }
          );
        } else {
          this.pesquisaCompartilhamentos();
        }
      }
    )
  }

  salvarLocalArmazenamento() {
    if (this.localArmazenamentoForm.valid) {
      const localArmazenamento: LocalArmazenamento = this.localArmazenamentoForm.getRawValue();
      localArmazenamento.codLocalArmazenamento = this.localArmazenamentoId;
      localArmazenamento.indDocumentoEletronico = (this.localArmazenamentoForm.controls.indDocumentoEletronico.value ? 1 : 0);
      localArmazenamento.indProvedorNacional = (this.localArmazenamentoForm.controls.indProvedorNacional.value ? 1 : 0);
      localArmazenamento.indNuvem = (this.localArmazenamentoForm.controls.indNuvem.value ? 1 : 0);

      if (this.localArmazenamentoId) {
        // Alteração
        this.localArmazenamentoService.alterarLocalArmazenamento(localArmazenamento).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Local de Armazenamento ${localArmazenamento.nomeLocalArmazenamento} foi atualizado com sucesso!`,null);
              this.router.navigate(["/local-armazenamento"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarLocalArmazenamento();}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        )
      } else {
        // Inclusão
        this.localArmazenamentoService.incluirLocalArmazenamento(localArmazenamento).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Local de Armazenamento ${localArmazenamento.nomeLocalArmazenamento} foi criado com sucesso!`,null);
            this.router.navigate(["/local-armazenamento"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarLocalArmazenamento();}));
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

  pesquisaCompartilhamentos() {
    this.compartilhamentoService.listarTodosCompartilhamentos().subscribe(
      (retorno) => {
        this.listaCompartilhamento = retorno.body;

        if (this.localArmazenamentoForm.controls.codCompartilhamento.value != 0) {
          let compartilhamento: Compartilhamento = <Compartilhamento>this.listaCompartilhamento.filter(compartilhamento => compartilhamento.codCompartilhamento == this.localArmazenamentoForm.controls.codCompartilhamento.value)[0];
          if (compartilhamento) {
            this.localArmazenamentoForm.controls.compartilhamento.setValue(compartilhamento);
          }
        }

        this.listaCompartilhamentoFiltrados = this.localArmazenamentoForm.controls.compartilhamento.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.nomeCompartilhamento),
            map(name => {
              return name ? this.filtraCompartilhamento(name) : this.listaCompartilhamento.slice();
            }));

        this.isLoading = false;
      }
    )
  }

  private filtraCompartilhamento(value: string): Compartilhamento[] {
    const filterValue = value.toLowerCase();

    return this.listaCompartilhamento.filter(item => item.nomeCompartilhamento.trim().toLowerCase().includes(filterValue));
  }

  selecionaCompartilhamento(event){
    let compartilhamentoSelecionado : Compartilhamento = event.option.value;
    this.isLoading = true;

    if (compartilhamentoSelecionado)
    {      
      //Só consultar no BD se houve alteração da empresa selecionada
      if (compartilhamentoSelecionado != this.compartilhamentoAnt)
      {
        this.localArmazenamentoForm.controls.codCompartilhamento.setValue(compartilhamentoSelecionado.codCompartilhamento);
        this.compartilhamentoAnt = compartilhamentoSelecionado;
      }
    }

    this.isLoading = false;
  }

  displayCompartilhamento(comp: Compartilhamento): string {
    return comp && comp.nomeCompartilhamento ? comp.nomeCompartilhamento : '';
  }
}
