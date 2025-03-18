import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';

@Component({
  selector: 'app-data-discovery-list',
  templateUrl: './data-discovery-list.component.html',
  styleUrls: ['./data-discovery-list.component.css'],

})
export class DataDiscoveryListComponent implements OnInit {

  isLoading = false;

  displayedColumns: string[] = ["area", "processo", "atividade", "metadados", "endereco", "tabela", "modulo"];

  jsonData = [
    {
      "area": "RH",
      "processo": "Admissão",
      "atividade": "Cadastro",
      "metadados": "Nome",
      "endereco": "nome_funcionario",
      "tabela": "hcm_pessoas",
      "modulo": "TOTVS HCM"
    },
    {
      "area": "RH",
      "processo": "Admissão",
      "atividade": "Cadastro",
      "metadados": "CPF",
      "endereco": "cpf",
      "tabela": "hcm_pessoas",
      "modulo": "TOTVS HCM"
    },
    {
      "area": "RH",
      "processo": "Admissão",
      "atividade": "Cadastro",
      "metadados": "Data Nascimento",
      "endereco": "data_nascimento",
      "tabela": "hcm_pessoas",
      "modulo": "TOTVS HCM"
    },
    {
      "area": "RH",
      "processo": "Admissão",
      "atividade": "Cadastro",
      "metadados": "Telefone",
      "endereco": "telefone",
      "tabela": "hcm_pessoas",
      "modulo": "TOTVS HCM"
    },
    {
      "area": "RH",
      "processo": "Admissão",
      "atividade": "Cadastro",
      "metadados": "Dados bancários",
      "endereco": "dado_bancario",
      "tabela": "hcm_pessoas",
      "modulo": "TOTVS HCM"
    },
    {
      "area": "RH",
      "processo": "Admissão",
      "atividade": "Cadastro",
      "metadados": "PCD",
      "endereco": "flag_pcd",
      "tabela": "hcm_pessoas",
      "modulo": "TOTVS HCM"
    },
    {
      "area": "RH",
      "processo": "Admissão",
      "atividade": "Cadastro",
      "metadados": "Naturalidade",
      "endereco": "naturalidade",
      "tabela": "hcm_pessoas",
      "modulo": "TOTVS HCM"
    },
    {
      "area": "RH",
      "processo": "Admissão",
      "atividade": "Cadastro",
      "metadados": "Nacionalidade",
      "endereco": "nacionalidade",
      "tabela": "hcm_pessoas",
      "modulo": "TOTVS HCM"
    },
    {
      "area": "RH",
      "processo": "Admissão",
      "atividade": "Cadastro",
      "metadados": "Filiação",
      "endereco": "filiacao",
      "tabela": "hcm_pessoas",
      "modulo": "TOTVS HCM"
    },
    {
      "area": "RH",
      "processo": "Admissão",
      "atividade": "Cadastro",
      "metadados": "Sexo",
      "endereco": "sexo",
      "tabela": "hcm_pessoas",
      "modulo": "TOTVS HCM"
    },
    {
      "area": "RH",
      "processo": "Admissão",
      "atividade": "Cadastro",
      "metadados": "Endereço",
      "endereco": "endereco",
      "tabela": "hcm_pessoas",
      "modulo": "TOTVS HCM"
    }
  ];


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
        processo: string,
        atividade: string,
        metadados: string,
        endereco: string,
        tabela: string
      },
      filterValue: string
    ) => data.area.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
        data.processo.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
        data.atividade.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
        data.metadados.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
        data.endereco.toString().trim().toLowerCase().indexOf(filterValue) !== -1;

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();

  }
}
