import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-compartilhamento-form',
  templateUrl: './compartilhamento-form.component.html',
  styleUrls: ['./compartilhamento-form.component.css']
})
export class CompartilhamentoFormComponent implements OnInit {

  compartilhamentoForm: FormGroup;
  compartilhamentoCodigo: number;
  isLoading = false;

  listaLocaisArmazenamento: LocalArmazenamento[];
  listaLocaisArmazenamentoFiltrados: Observable<LocalArmazenamento []>;
  localArmazenamentoAnt: LocalArmazenamento;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: CustomSnackBarService,
    private router: Router,
    private dialog: MatDialog,
    private compartilhamentoService: CompartilhamentoService,
    private localArmazenamentoService: LocalArmazenamentoService
  ) { }

  ngOnInit() {
    this.isLoading = true;

    this.createForm();
    this.pesquisaCompartilhamento();
  }

  private createForm() {
    this.compartilhamentoForm = this.formBuilder.group({
      nomeCompartilhamento: ["", Validators.required],
      nomeAplicacao: ["", ],
      nomeModulo: ["", ],
      nomeFornecedor: ["", ],
      codLocalArmazenamento: [],
      localArmazenamento: ["", ]
    })
  }

  private pesquisaCompartilhamento() {
    this.activatedRoute.params.subscribe(
      (data) => {
        this.compartilhamentoCodigo = parseInt(data["id?"]);

        if (this.compartilhamentoCodigo) {
          this.compartilhamentoService.pesquisaCompartilhamento(this.compartilhamentoCodigo).subscribe(
            (retorno) => {
              this.compartilhamentoForm.patchValue({
                nomeCompartilhamento: retorno.body[0].nomeCompartilhamento,
                nomeAplicacao: retorno.body[0].nomeAplicacao,
                nomeModulo: retorno.body[0].nomeModulo,
                nomeFornecedor: retorno.body[0].nomeFornecedor,
                codLocalArmazenamento: retorno.body[0].codLocalArmazenamento,
              });
              this.pesquisaLocaisArmazenamento();
            }
          )
        } else {
          this.isLoading = false;
          this.pesquisaLocaisArmazenamento()
        }
      }
    )
  }

  private pesquisaLocaisArmazenamento() {
    this.localArmazenamentoService.listaTodosLocaisArmazenamento().subscribe(
      (retorno) => {
        this.listaLocaisArmazenamento = retorno.body;

        if (this.compartilhamentoForm.controls.codLocalArmazenamento.value != 0) {
          let localArmazenamento: LocalArmazenamento = <LocalArmazenamento>this.listaLocaisArmazenamento.filter(localArmazenamento => localArmazenamento.codLocalArmazenamento == this.compartilhamentoForm.controls.codLocalArmazenamento.value)[0];
          if (localArmazenamento) {
            this.compartilhamentoForm.controls.localArmazenamento.setValue(localArmazenamento);
          }
        }

        this.listaLocaisArmazenamentoFiltrados = this.compartilhamentoForm.controls.localArmazenamento.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.nomeLocalArmazenamento),
            map(name => {
              return name ? this.filtraLocalArmazenamento(name) : this.listaLocaisArmazenamento.slice();
            })
          )

        this.isLoading = false;
      }
    )
  }

  private filtraLocalArmazenamento(value: string): LocalArmazenamento[] {
    const filterValue = value.toLowerCase();

    return this.listaLocaisArmazenamento.filter(item => item.nomeLocalArmazenamento.trim().toLowerCase().includes(filterValue));
  }

  selecionaLocalArmazenamento(event) {
    let localArmazenamentoSelecionado: LocalArmazenamento = event.option.value;
    this.isLoading = true;

    if (localArmazenamentoSelecionado && (localArmazenamentoSelecionado !== this.localArmazenamentoAnt)) {
      this.compartilhamentoForm.controls.codLocalArmazenamento.setValue(localArmazenamentoSelecionado.codLocalArmazenamento);
      this.localArmazenamentoAnt = localArmazenamentoSelecionado;
    }

    this.isLoading = false
  }

  displayLocalArmazenamento(localArmazenamento: LocalArmazenamento): string {
    return localArmazenamento && localArmazenamento.nomeLocalArmazenamento ? localArmazenamento.nomeLocalArmazenamento : '';
  }

  salvarCompartilhamento() {
    if (this.compartilhamentoForm.valid) {
      const compartilhamento: Compartilhamento = this.compartilhamentoForm.getRawValue();
      compartilhamento.codCompartilhamento = this.compartilhamentoCodigo;

      if (compartilhamento.codLocalArmazenamento === null)
      {
        compartilhamento.codLocalArmazenamento = 0;
      }

      if (this.compartilhamentoCodigo) {
        this.compartilhamentoService.alterarCompartilhamento(compartilhamento).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Compartilhamento ${compartilhamento.nomeCompartilhamento} foi atualizado com sucesso!`,null);
            this.router.navigate(["/compartilhamento"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarCompartilhamento();}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        )
      } else {
        // Inclusão
        this.compartilhamentoService.incluirCompartilhamento(compartilhamento).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Compartilhamento ${compartilhamento.nomeCompartilhamento} foi criada com sucesso!`,null);
            this.router.navigate(["/compartilhamento"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarCompartilhamento();}));
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
