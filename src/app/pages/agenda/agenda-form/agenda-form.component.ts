import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, } from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { ActivatedRoute } from '@angular/router';
import { TecnicoService } from 'src/app/services/tecnico-service';
import { AgendaService } from 'src/app/services/agenda-service';
import { Tecnico } from 'src/app/models/tecnico/tecnico';
import { TarefaAgenda } from 'src/app/models/tarefa-agenda/tarefa-agenda';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { TarefaAgendaFormComponent } from '../tarefa-agenda/tarefa-agenda-form.component';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { TarefaAgendaParam } from 'src/app/models/tarefa-agenda/tarefa-agenda-param';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-agenda-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './agenda-form.component.html',
  styleUrls: ['./agenda-form.component.css']
})
export class AgendaFormComponent implements OnInit {

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  locale:String = "pt";
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = false;
  tecnicoSelecionado: Tecnico;
  horarioTrabalhoInicio: number = 8;
  horarioTrabalhoFim: number = 18;
  excludeDays: number[] = [0, 6];

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Editar',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.alterarTarefaAgenda(event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Apagar',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.excluirTarefaAgenda(event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-clone"></i>',
      a11yLabel: 'Copiar',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.copiarTarefaAgenda(event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();
  //events: CalendarEvent<TarefaAgenda>[] = [];

  events: CalendarEvent<TarefaAgenda>[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
      actions: this.actions,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private tecnicoService: TecnicoService,
    private agendaService: AgendaService,
    private dialog: MatDialog,
    
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe( data => {
      if (data["id?"]) {
        this.tecnicoSelecionado = this.tecnicoService.pesquisaTecnico(data["id?"]);
        this.agendaService.pesquisaAgenda(data["id?"]);
      }
    });    

    this.dayClicked({ date: new Date(), 
                      events: this.events});

  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        var tarefaAgenda:TarefaAgenda;
        if (event.meta != undefined)
        {
          tarefaAgenda = event.meta;
          event.meta.dataHoraInicio = newStart;
          event.meta.dataHoraFim    = newEnd;
        }
        return {
          ...event,
          start: newStart,
          end: newEnd,
          meta: tarefaAgenda          
        };
      }
      return iEvent;
    });
    //this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    console.log(action);
    this.modalData = { event, action };
    console.log(this.modalContent);
  }

  private copiarTarefaAgenda(event: CalendarEvent): void{

    if (event.meta === undefined) return;

    var tarefaAgendaParam: TarefaAgendaParam = new TarefaAgendaParam();
    tarefaAgendaParam.data = event.meta;
    tarefaAgendaParam.indCopia = true;
    var dialogConfig = new MatDialogConfig();
    dialogConfig.height = "auto";
    dialogConfig.width = "90%";
    dialogConfig.data = tarefaAgendaParam;
    let incluirTarefaFormComponent = this.dialog.open(TarefaAgendaFormComponent,dialogConfig);
    incluirTarefaFormComponent.afterClosed().subscribe((result) => {
      if (result!= undefined)
      {
        this.events = [
          ...this.events,
          {
            title: result.data.nomeTarefa + "<br>" + "teste",
            start: result.data.dataHoraInicio,
            end: result.data.dataHoraFim,
            allDay: result.data.indDiaInteiro,
            color: (result.data.indDiaInteiro ? colors.blue : colors.red),
            draggable: true,
            actions: this.actions,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
            meta: result.data,
          },
        ];
        this.refresh.next();
      }
    });
  }

  private alterarTarefaAgenda(event: CalendarEvent): void{

    if (event.meta === undefined) return;

    var tarefaAgendaParam: TarefaAgendaParam = new TarefaAgendaParam();
    tarefaAgendaParam.data = event.meta;
    tarefaAgendaParam.indAlteracao = true;
    var dialogConfig = new MatDialogConfig();
    dialogConfig.height = "auto";
    dialogConfig.width = "90%";
    dialogConfig.data = tarefaAgendaParam;
    let incluirTarefaFormComponent = this.dialog.open(TarefaAgendaFormComponent,dialogConfig);
    incluirTarefaFormComponent.afterClosed().subscribe((result) => {
      if (result!=undefined)
      {
        this.events = this.events.map((iEvent) => {
          if (iEvent === event) {
            return {
              ...event,
              start: result.data.dataHoraInicio,
              end: result.data.dataHoraFim,              
              meta: result.data,
              color: (result.data.indDiaInteiro ? colors.blue : colors.red),
              allDay: result.data.indDiaInteiro,
            };
          }
          return iEvent;
        });
        this.refresh.next();
      }
    });
  }

  incluirTarefaAgenda($event): void{
    var tarefaAgenda: TarefaAgenda = new TarefaAgenda();
    tarefaAgenda.codigoTecnico = this.tecnicoSelecionado.codigoTecnico;
    tarefaAgenda.nomeTecnico = this.tecnicoSelecionado.nomeTecnico;
    tarefaAgenda.dataHoraInicio = $event.date;
    var tarefaAgendaParam: TarefaAgendaParam = new TarefaAgendaParam();
    tarefaAgendaParam.data = tarefaAgenda;
    tarefaAgendaParam.indInclusao = true;
    var dialogConfig = new MatDialogConfig();
    dialogConfig.height = "auto";
    dialogConfig.width = "90%";
    dialogConfig.data = tarefaAgendaParam;
    let incluirTarefaFormComponent = this.dialog.open(TarefaAgendaFormComponent,dialogConfig);
    incluirTarefaFormComponent.afterClosed().subscribe((result) => {
      if (result!= undefined)
      {
        this.events = [
          ...this.events,
          {
            title: result.data.nomeTarefa,
            start: result.data.dataHoraInicio,
            end: result.data.dataHoraFim,
            color: (result.data.indDiaInteiro ? colors.blue : colors.red),
            draggable: true,
            actions: this.actions,
            allDay: result.data.indDiaInteiro,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
            meta: result.data,
          },
        ];
        this.refresh.next();
      }

    });
  }

  private excluirTarefaAgenda(event: CalendarEvent):void
  {
    if (event.meta === undefined) return;

    var tarefaAgenda: TarefaAgenda = new TarefaAgenda();
    tarefaAgenda = event.meta;

    const confirmRemoveDialog = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: "Confirmar exclusão de tarefa da agenda",
        msg: `Tem certeza que deseja prosseguir com a exclusão da tarefa ${tarefaAgenda.nomeTarefa} ?`,
      },
    })
    
    confirmRemoveDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.events = this.events.filter((eventAux) => eventAux !== event);   
        this.refresh.next();     
      }
    });

  }

  /*addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }*/

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  salvarAgenda()
  {
    
  }
}
