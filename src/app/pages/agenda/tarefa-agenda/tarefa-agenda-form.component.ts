import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TarefaAgenda } from 'src/app/models/tarefa-agenda/tarefa-agenda';
import { Tecnico } from 'src/app/models/tecnico/tecnico';
import { TarefaTecnico } from 'src/app/models/tarefa-tecnico/tarefa-tecnico';
import { Projeto } from 'src/app/models/projeto/projeto';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { TarefaAgendaParam } from 'src/app/models/tarefa-agenda/tarefa-agenda-param';

@Component({
  selector: 'app-tarefa-agenda-form',
  templateUrl: './tarefa-agenda-form.component.html',
  styleUrls: ['./tarefa-agenda-form.component.css']
})
export class TarefaAgendaFormComponent implements OnInit {

  listaTarefaTecnico: TarefaTecnico[] = 
  [
    {
      codigoProjeto: 10,
      nomeProjeto: "Projeto 10",
      codigoTecnico: "XX",    
      codigoTarefa: 100,
      nomeTarefa: "Desenvolvimento",
      horasAlocadas: 10,
      horasDisponiveis: 5
    },
    {
      codigoProjeto: 10,
      nomeProjeto: "Projeto 10",
      codigoTecnico: "XX",    
      codigoTarefa: 101,
      nomeTarefa: "Análise",
      horasAlocadas: 20,
      horasDisponiveis: 10
    },
    {
      codigoProjeto: 20,
      nomeProjeto: "Projeto 20",
      codigoTecnico: "XX",    
      codigoTarefa: 100,
      nomeTarefa: "Desenvolvimento",
      horasAlocadas: 40,
      horasDisponiveis: 25
    },
    {
      codigoProjeto: 20,
      nomeProjeto: "Projeto 20",
      codigoTecnico: "XX",    
      codigoTarefa: 101,
      nomeTarefa: "Análise",
      horasAlocadas: 50,
      horasDisponiveis: 0
    },
  ];

  listaProjeto: Projeto[] = 
  [
    {
      codigoProjeto: 10,
      nomeProjeto: "Projeto 10",

    },
    {
      codigoProjeto: 20,
      nomeProjeto: "Projeto 20",

    },
  ];


  listaTarefaTecnicoFiltrados: Observable<TarefaTecnico[]>;
  listaProjetoFiltrados: Observable<Projeto[]>;

  tarefaAgendaForm: FormGroup;

  dateControlInicio = new FormControl(new Date());

  constructor(
    public dialogRef: MatDialogRef<TarefaAgendaFormComponent>,
    private formBuilder: FormBuilder,
    private snackBar: CustomSnackBarService,
    @Inject(MAT_DIALOG_DATA) public data: TarefaAgendaParam,

  ) { }

  ngOnInit() {

    this.data = this.dialogRef.componentInstance.data;

    this.createForm(); 

    this.listaTarefaTecnicoFiltrados = this.tarefaAgendaForm.controls.tarefa.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.descricaoTarefa),
      map(name => {
        return name ? this.filtraTarefaTecnico(name) : this.listaTarefaTecnico.slice();
      })
    );

    this.tarefaAgendaForm.controls.dataHoraInicio.valueChanges.subscribe(value =>
    {
      if (this.data.indCopia && this.tarefaAgendaForm.controls.indDiaInteiro.value)
      {
        this.tarefaAgendaForm.controls.dataHoraFim.setValue(value);
      }
    });


    if (this.data.data.dataHoraFim == null)
    {
      this.data.data.dataHoraFim = new Date(this.data.data.dataHoraInicio);
      this.data.data.dataHoraFim.setHours(this.data.data.dataHoraInicio.getHours() + 1);
    }

    this.tarefaAgendaForm.patchValue({
      codigoTarefa: this.data.data.codigoTarefa,
      nomeTarefa: this.data.data.nomeTarefa,
      codigoProjeto: this.data.data.codigoProjeto,
      nomeProjeto: this.data.data.nomeProjeto,
      horasAlocadas: this.data.data.horasAlocadas,
      horasDisponiveis: this.data.data.horasDisponiveis,
      codigoTecnico: this.data.data.codigoTecnico,
      nomeTecnico: this.data.data.nomeTecnico,
      dataHoraInicio: this.data.data.dataHoraInicio,
      dataHoraFim: this.data.data.dataHoraFim,
      indDiaInteiro: this.data.data.indDiaInteiro
    });

    if (this.data.data.codigoTarefa!=null)
    {
      let tarefa:TarefaTecnico = <TarefaTecnico>this.listaTarefaTecnico.filter( tarefaTec => tarefaTec.codigoTarefa  == this.data.data.codigoTarefa &&
                                                                                             tarefaTec.codigoProjeto == this.data.data.codigoProjeto)[0];
      if(tarefa){
        this.tarefaAgendaForm.controls.tarefa.setValue(<TarefaTecnico>this.listaTarefaTecnico.filter( tarefaTec => tarefaTec.codigoTarefa  == this.data.data.codigoTarefa &&
                                                                                                                   tarefaTec.codigoProjeto == this.data.data.codigoProjeto)[0]);
      }
    }    

    if (this.data.indCopia)
    {
      this.tarefaAgendaForm.controls.tarefa.disable();
    }

    if (this.data.data.indDiaInteiro)
    {

      if (!this.data.indCopia)
      {
        this.tarefaAgendaForm.controls.dataHoraInicio.disable();
      }
    
      this.tarefaAgendaForm.controls.dataHoraFim.disable();
    }
  }

  private createForm() {
    this.tarefaAgendaForm = this.formBuilder.group({
      codigoTecnico: ["",],      
      nomeTecnico: ["",],      
      codigoProjeto: [0, Validators.required],
      nomeProjeto: ["",],
      tarefa: [TarefaTecnico, Validators.required],
      codigoTarefa: [0, Validators.required],
      nomeTarefa: ["",],
      horasAlocadas: [0,],
      horasDisponiveis: [0,],
      dataHoraInicio: ["", Validators.required],
      dataHoraFim:["", Validators.required],
      indDiaInteiro:[false, ]
    });

    this.tarefaAgendaForm.controls.nomeProjeto.disable();
    this.tarefaAgendaForm.controls.horasAlocadas.disable();
    this.tarefaAgendaForm.controls.horasDisponiveis.disable();

    this.tarefaAgendaForm.controls.tarefa.valueChanges.subscribe(value => {
      if (value!=null)
      {
        this.tarefaAgendaForm.controls.codigoProjeto.setValue(value.codigoProjeto);
        this.tarefaAgendaForm.controls.nomeProjeto.setValue(value.nomeProjeto);
        this.tarefaAgendaForm.controls.codigoTarefa.setValue(value.codigoTarefa);
        this.tarefaAgendaForm.controls.nomeTarefa.setValue(value.nomeTarefa);
        this.tarefaAgendaForm.controls.horasAlocadas.setValue(value.horasAlocadas);
        this.tarefaAgendaForm.controls.horasDisponiveis.setValue(value.horasDisponiveis);
      }

    });
  }

  salvarTarefa()
  {
    if (this.tarefaAgendaForm.valid) {

      this.data.data = this.tarefaAgendaForm.getRawValue();

      if (Object.prototype.toString.call(this.tarefaAgendaForm.controls.dataHoraInicio.value) === "[object Date]") 
      {
        this.data.data.dataHoraInicio = this.tarefaAgendaForm.controls.dataHoraInicio.value;
      }
      else
      {
        this.data.data.dataHoraInicio = new Date(this.tarefaAgendaForm.controls.dataHoraInicio.value.toLocaleString());
      }

      if (Object.prototype.toString.call(this.tarefaAgendaForm.controls.dataHoraFim.value) === "[object Date]") 
      {
        this.data.data.dataHoraFim = this.tarefaAgendaForm.controls.dataHoraFim.value;
      }
      else
      {
        this.data.data.dataHoraFim = new Date(this.tarefaAgendaForm.controls.dataHoraFim.value.toLocaleString());
      }

      if (this.data.data.dataHoraInicio.getTime() > this.data.data.dataHoraFim.getTime())
      {
        this.showMessage("Data Final Deve Ser Maior que a Data Inicial", "Error");
        return;
      }

      if (this.data.data.indDiaInteiro)
      {
        this.data.data.dataHoraInicio.setHours(0);
        this.data.data.dataHoraInicio.setMinutes(0);
        this.data.data.dataHoraInicio.setSeconds(0);

        this.data.data.dataHoraFim.setHours(0);
        this.data.data.dataHoraFim.setMinutes(0);
        this.data.data.dataHoraFim.setSeconds(0);
      }
      
      this.dialogRef.close(this.data);
    }
    else {
      this.showMessage("Campos obrigatórios não foram preenchidos", "Warn");
    }
  }

  trataTarefaDiaInteiro(value: boolean)
  {
    if (value)
    {
      //Dia Inteiro
      if (!this.data.indCopia)
      {
        this.tarefaAgendaForm.controls.dataHoraInicio.disable();
      }

      this.tarefaAgendaForm.controls.dataHoraFim.disable();
      var dataAux:Date = new Date(this.data.data.dataHoraInicio);
      dataAux.setHours(0);
      dataAux.setMinutes(0);
      this.tarefaAgendaForm.controls.dataHoraInicio.setValue(dataAux);
      this.tarefaAgendaForm.controls.dataHoraFim.setValue(dataAux);
    
    }
    else
    {
      if (this.data.data.dataHoraInicio.getTime() == this.data.data.dataHoraFim.getTime())
      {
        this.data.data.dataHoraFim.setHours(this.data.data.dataHoraFim.getHours() + 1);
      }
      this.tarefaAgendaForm.controls.dataHoraInicio.enable();
      this.tarefaAgendaForm.controls.dataHoraFim.enable();
      this.tarefaAgendaForm.controls.dataHoraInicio.setValue(this.data.data.dataHoraInicio);
      this.tarefaAgendaForm.controls.dataHoraFim.setValue(this.data.data.dataHoraFim);      
    }
  }

  private showMessage(msg: string, type: string = "Success") {
    this.snackBar.openSnackBar(msg, null, type);
  }

  private filtraTarefaTecnico(value: string): TarefaTecnico[] {
    const filterValue = value.toLowerCase();

    return this.listaTarefaTecnico.filter(item => item.nomeTarefa.trim().toLowerCase().includes(filterValue));
  }

  displayTarefaTecnico(tarefaTecnico: TarefaTecnico): string {
    return tarefaTecnico && tarefaTecnico.nomeTarefa ? tarefaTecnico.nomeTarefa : '';
  }

}
