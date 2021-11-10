import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Atividade } from 'src/app/models/atividade/atividade';
import { Metadados } from 'src/app/models/metadados/metadados';
import { AtividadeService } from 'src/app/services/atividade.service';
import { AuthService } from 'src/app/services/auth.service';
import { MetadadosService } from 'src/app/services/metadados.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-atividade-form',
  templateUrl: './atividade-form.component.html',
  styleUrls: ['./atividade-form.component.css']
})
export class AtividadeFormComponent implements OnInit {

  atividadeForm: FormGroup;
  areaId: number;
  processoId: number;
  atividadeId: number;
  isLoading = false;

  listaMetadados: Metadados[];
  metadados: Metadados[];
  listaMetadadosFiltrados: Observable<Metadados []>;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  metadadosCtrl = new FormControl();
  metadadosAtividade: Metadados[] = [];

  @ViewChild('metadadosInput',{static: false}) metadadosInput: ElementRef<HTMLInputElement>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private atividadeService: AtividadeService,
    private metadadosService: MetadadosService,
    private snackBar: CustomSnackBarService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.isLoading = true;

    this.createForm();
    this.pesquisaAtividade();
  }  

  createForm() {
    this.atividadeForm = this.formBuilder.group({
      nomeAtividade: ["", Validators.required],
      obsAtividade: [],
      metadados: [],
      indAutomatizado: [false, ],
    });
  }

  pesquisaAtividade() {
    this.activatedRoute.params.subscribe(
      (data) => {
        this.areaId = parseInt(data["areaId"]);
        this.processoId = parseInt(data["processoId"]);
        this.atividadeId = parseInt(data["id?"]);

        if (this.atividadeId) {
          this.atividadeService.pesquisaAtividade(this.atividadeId).subscribe(
            (retorno) => {
              this.atividadeForm.patchValue({
                nomeAtividade: retorno.body[0].nomeAtividade,
                obsAtividade: retorno.body[0].obsAtividade,
                indAutomatizado: retorno.body[0].indAutomatizado,
              });              

              this.metadadosAtividade = retorno.body[0].metadados;
              this.pesquisaMetadados();

              this.isLoading = false;
            }
          )
        } else {
          this.pesquisaMetadados();
        }
      }
    )
  }

  salvarAtividade() {
    if (this.atividadeForm.valid) {
      const atividade: Atividade = this.atividadeForm.getRawValue();
      atividade.codAtividade = this.atividadeId;
      atividade.codProcesso = this.processoId;
      atividade.indAutomatizado = (this.atividadeForm.controls.indAutomatizado.value ? 1 : 0);
      atividade.codUsuarioAlteracao = this.authService.getLoggedUserId();
      atividade.metadados = this.metadadosAtividade;

      if (this.atividadeId) {
        // Alteração
        this.atividadeService.alterarAtividade(atividade).subscribe(
          (retorno) => {
            this.snackBar.openSnackBar(`A Atividade ${atividade.nomeAtividade} foi atualizado com sucesso!`,null);
            this.router.navigate(["area", this.areaId, "processo", this.processoId]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarAtividade();}));            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        )
      } else {
        // Inclusão
        this.atividadeService.incluirAtividade(atividade).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`A Atividade ${atividade.nomeAtividade} for criada com sucesso!`, null);
            this.router.navigate(["area", this.areaId, "processo", this.processoId])
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarAtividade();}));
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

  private pesquisaMetadados() {    
    this.metadadosService.listaTodosMetadados().subscribe(
      (retorno) => {
        this.listaMetadados = retorno.body;    
        
        this.removeSelecionados();
    
        this.listaMetadadosFiltrados = this.metadadosCtrl.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value: value.nomeMetadados),
            map(name => {
              return name ? this.filtraMetadados(name): this.listaMetadados.slice();
            })
          );

          this.isLoading = false;

      });

    this.isLoading = false;
  }

  filtraMetadados(value: string): Metadados[] {
    const filterValue = value.toLowerCase();

    return this.listaMetadados.filter(item => item.nomeMetadados.trim().toLowerCase().includes(filterValue));
  }

  displayMetadados(met: Metadados): string {
    return met && met.nomeMetadados ? met.nomeMetadados : '';
  }

  removeSelecionados()
  {
    var index = -1;
    if (this.listaMetadados != undefined && this.listaMetadados.length!=0 &&
        this.metadadosAtividade != undefined && this.metadadosAtividade.length!=0)
    {
      var listaAux = this.listaMetadados;
      this.listaMetadados = [];
      listaAux.forEach(meta => {
        index = -1;
        this.metadadosAtividade.forEach(metaAtividade => {
          if (meta.codMetadados === metaAtividade.codMetadados)
          {
            index = 1;
          }          
        });

        if (index===-1)
        {
          this.listaMetadados.push(meta);
        }
      });
      this.listaMetadados.sort((a,b) => a.nomeMetadados.localeCompare(b.nomeMetadados));
      
      this.metadadosCtrl.setValue("");
    }
  }

  remove(metadados: Metadados): void {
    const index = this.metadadosAtividade.indexOf(metadados);

    if (index >= 0) {
      this.metadadosAtividade.splice(index, 1);
      this.listaMetadados.push(metadados);
    }

    this.listaMetadados.sort((a,b) => a.nomeMetadados.localeCompare(b.nomeMetadados));

    this.metadadosCtrl.setValue("");
  }

  selectedMetadados(event: MatAutocompleteSelectedEvent): void {
    this.metadadosAtividade.push(event.option.value);

    this.metadadosInput.nativeElement.value = '';
    const index = this.listaMetadados.indexOf(event.option.value);

    if (index >= 0) {
      this.listaMetadados.splice(index, 1);
    }
    this.metadadosCtrl.setValue("");
  }

  navigateToProcesso()
	{
    this.router.navigate(["area", this.areaId, "processo", this.processoId])
	}
}
