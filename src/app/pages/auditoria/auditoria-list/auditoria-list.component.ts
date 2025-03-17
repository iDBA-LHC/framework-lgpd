import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './auditoria-list.component.html',
  styleUrls: ['./auditoria-list.component.css'],

})
export class AuditoriaListComponent implements OnInit {

  isLoading = false;
  mostraInativos = false;

  displayedColumns: string[] = ["id", "imprimir", "indicador", "area", "empresa", "responsavel", "inicio", "fechamento", "status", "excluir"];

  jsonData = [
    {
      "id": 42,
      "indicador" : 1, 
      "area": "TECNOLOGIA DA INFORMAÇÃO",
      "empresa": "DEMO 1",
      "responsavel": "Maria Luíza",
      "inicio": "13/09/2019",
      "fechamento": "",
      "status": "ACOMPANHAMENTO PENDÊNCIAS PÓS AUDITORIA"
    },
    {
      "id": 41,
      "indicador" : 1, 
      "area": "RECURSOS HUMANOS",
      "empresa": "DEMO 1",
      "responsavel": "Maria Luíza",
      "inicio": "22/06/2019",
      "fechamento": "",
      "status": "ACOMPANHAMENTO PENDÊNCIAS PÓS AUDITORIA"
    },
    {
      "id": 40,
      "indicador" : 1, 
      "area": "ASSESSORIA CIENTÍFICA",
      "empresa": "DEMO 1",
      "responsavel": "Maria Luíza",
      "inicio": "01/06/2019",
      "fechamento": "",
      "status": "ACOMPANHAMENTO PENDÊNCIAS PÓS AUDITORIA"
    },
    {
      "id": 39,
      "indicador" : 1, 
      "area": "LOGÍSTICA",
      "empresa": "DEMO 1",
      "responsavel": "Maria Luíza",
      "inicio": "23/06/2019",
      "fechamento": "",
      "status": "ACOMPANHAMENTO PENDÊNCIAS PÓS AUDITORIA"
    },
    {
      "id": 38,
      "indicador" : 2, 
      "area": "Assistência Técnica",
      "empresa": "DEMO 1",
      "responsavel": "Maria Luíza",
      "inicio": "04/04/2019",
      "fechamento": "",
      "status": "ACOMPANHAMENTO PENDÊNCIAS PÓS AUDITORIA"
    },
    {
      "id": 37,
      "indicador" : 2, 
      "area": "Faturamento e Expedição de Produtos",
      "empresa": "DEMO 1",
      "responsavel": "Maria Luíza",
      "inicio": "13/03/2019",
      "fechamento": "",
      "status": "ACOMPANHAMENTO PENDÊNCIAS PÓS AUDITORIA"
    },
    {
      "id": 36,
      "area": "COMERCIAL",
      "empresa": "DEMO 1",
      "responsavel": "Maria Luíza",
      "inicio": "17/01/2019",
      "fechamento": "12/08/2019",
      "status": "ENCERRADO"
    },
    {
      "id": 35,
      "area": "CONTROLE DE QUALIDADE",
      "empresa": "DEMO 1",
      "responsavel": "Maria Luíza",
      "inicio": "28/12/2018",
      "fechamento": "12/08/2019",
      "status": "ENCERRADO"
    },
    {
      "id": 34,
      "area": "GARANTIA DA QUALIDADE",
      "empresa": "DEMO 1",
      "responsavel": "Maria Luíza",
      "inicio": "27/12/2018",
      "fechamento": "12/08/2019",
      "status": "ENCERRADO"
    },
    {
      "id": 33,
      "area": "PRODUÇÃO FABRICAÇÃO, ENVASE E MONTAGEM",
      "empresa": "DEMO 1",
      "responsavel": "Maria Luíza",
      "inicio": "08/12/2018",
      "fechamento": "09/05/2019",
      "status": "ENCERRADO"
    }
  ]
  ;

  
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados() {
    this.dataSource.data = this.jsonData;
    this.dataSource.filterPredicate = (
      data: {
        area: string,
        empresa: string,
        responsavel: string,
        status: string
      },
      filterValue: string
    ) => data.area.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
        data.empresa.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
        data.responsavel.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
        data.status.toString().trim().toLowerCase().indexOf(filterValue) !== -1;

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }
}
