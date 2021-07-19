import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { AreaService } from 'src/app/services/area.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { MatDialog } from '@angular/material';
import { emailValidator, cnpjValidator, cpfValidator } from 'src/app/shared/utils/app.validator';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';
import { Area } from 'src/app/models/area/area';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-area-form',
  templateUrl: './area-form.component.html',
  styleUrls: ['./area-form.component.css']
})
export class AreaFormComponent implements OnInit {

  areaForm: FormGroup;
  areaId: number;
  isLoading = false;

  listaAreas: Area[];
  listaAreasFiltradas: Observable<Area[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private areaService: AreaService,
    private snackBar: CustomSnackBarService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {

    this.isLoading = true;

    this.createForm();    
    // this.pesquisaEmpresa();

  }

  private createForm() {
    this.areaForm = this.formBuilder.group({
      nomeArea: ["", Validators.required],
    });
  }

  private pesquisaTodasAreas() {

  }

  salvarArea() {
    
  }
  // private pesquisaEmpresa()
  // {
  //   this.activatedRoute.params.subscribe((data) => {
  //     if (data["id?"]) {
  //       this.empresaId = data["id?"];
  //       this.areaService.pesquisaArea(this.empresaId).subscribe(
  //           (retorno) => {
  //             this.empresaForm.patchValue({
  //               nomeEmpresa: retorno.body[0].nomeEmpresa,
  //               numeroCNPJ: retorno.body[0].numeroCNPJ,
  //               enderecoEmpresa: retorno.body[0].enderecoEmpresa,
  //               nomeControlador: retorno.body[0].nomeControlador,
  //               numeroCPFControlador: retorno.body[0].numeroCPFControlador,
  //               telefoneControlador: retorno.body[0].telefoneControlador,
  //               emailControlador: retorno.body[0].emailControlador,
  //               indMatrizFilial: retorno.body[0].indMatrizFilial,
  //               codigoEmpresaMatriz: retorno.body[0].codigoEmpresaMatriz,
  //             });

  //             if (retorno.body[0].indMatrizFilial == 1)
  //             {
  //               this.empresaForm.controls.indMatrizFilial.setValue(true);
  //             }
  //             else
  //             {
  //               this.empresaForm.controls.indMatrizFilial.setValue(false);
  //             }
              
  //             this.pesquisaEmpresasMatriz();
  //             this.trataMatrizFilial(this.empresaForm.controls.indMatrizFilial.value);
              
  //           },
  //           (err) =>{
  //             if (err.status === 401)
  //             {
  //               TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaEmpresa();}));
  //             }
  //             else
  //             {
  //               TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
  //             }
  //           });
  //     }
  //     else
  //     {
  //       this.pesquisaEmpresasMatriz();
  //     }
  //   }); 
  // }

  // private pesquisaEmpresasMatriz()
  // {
  //   this.areaService.listaTodasEmpresas().subscribe(
  //     (retorno) => {
  //       this.listaEmpresas = retorno.body;

  //       if (this.empresaForm.controls.codigoEmpresaMatriz.value!=0)
  //       {
  //         let empresa: Area;
  //         empresa = <Area>this.listaEmpresas.filter( empresa => empresa.codigoEmpresa == this.empresaForm.controls.codigoEmpresaMatriz.value)[0];
  //         if(empresa){
  //           this.empresaForm.controls.empresaMatriz.setValue(empresa);
  //         }
  //       }

  //       this.listaEmpresasFiltradas = this.empresaForm.controls.empresaMatriz.valueChanges
  //       .pipe(
  //         startWith(''),
  //         map(value => typeof value === 'string' ? value : value.nomeEmpresa),
  //         map(name => {
  //           return name ? this.filtraEmpresa(name) : this.listaEmpresas.slice();
  //         }));

  //       this.isLoading = false;  
  //     },
  //     (err) =>{
  //       if (err.status === 401)
  //       {
  //         TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaEmpresasMatriz();}));
  //       }
  //       else
  //       {
  //         TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
  //       }
  //     }
  //   );    
  // }

  // salvarEmpresa()
  // {

  //   if (this.empresaForm.controls.indMatrizFilial.value == false && 
  //      (!this.empresaForm.controls.empresaMatriz.value.codigoEmpresa || this.empresaForm.controls.empresaMatriz.value.codigoEmpresa==0))
  //   {
  //     this.empresaForm.controls.empresaMatriz.setErrors( {required: true } );
  //   }
  //   else
  //   {
  //     this.empresaForm.controls.empresaMatriz.setErrors( null );
  //   }    

  //   if (this.empresaForm.valid) {
  //     const empresa: Area = this.empresaForm.getRawValue();        
  //     empresa.codigoEmpresa = this.empresaId;

  //     if (this.empresaId) {     
  //       //Alteração
  //       this.areaService.alterarArea(empresa).subscribe(
  //         (response) => {
  //           this.snackBar.openSnackBar(`A Empresa ${empresa.nomeEmpresa} foi atualizada com sucesso!`,null);
  //           this.router.navigate(["/empresa"]);
  //         },
  //         (err) => {
  //           if (err.status === 401)
  //           {
  //             TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarEmpresa();}));
  //           }
  //           else
  //           {
  //             TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
  //           }
  //         }
  //       );
  //     }
  //     else
  //     {
  //       //Inclusão
  //       this.areaService.incluirEmpresa(area).subscribe(
  //         (response) => {
  //           this.snackBar.openSnackBar(`A Empresa ${empresa.nomeEmpresa} foi criada com sucesso!`,null);
  //           this.router.navigate(["/empresa"]);
  //         },
  //         (err) => {
  //           if (err.status === 401)
  //           {
  //             TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarEmpresa();}));
  //           }
  //           else
  //           {
  //             TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
  //           }
  //         }
  //       );
  //     }
  //   }
  //   else {
  //     this.snackBar.openSnackBar("Campos obrigatórios não foram preenchidos", null, "Warn");
  //   }
  // }

  // private filtraEmpresa(value: string): Area[] {
  //   const filterValue = value.toLowerCase();

  //   return this.listaEmpresas.filter(item => item.nomeEmpresa.trim().toLowerCase().includes(filterValue));
  // }

  // displayEmpresaMatriz(empresa: Area): string {
  //   return empresa && empresa.nomeEmpresa ? empresa.nomeEmpresa : '';
  // }

  // selecionaEmpresaMatriz(event){
  //   let empresaSelecionada : Area = event.option.value;
  //   this.empresaForm.controls.empresaMatriz.setValue(empresaSelecionada);
  // }

  // trataMatrizFilial(value)
  // {    
  //   if (value == true)
  //   {
  //     this.empresaForm.controls.empresaMatriz.disable();
  //   }
  //   else
  //   {
  //     this.empresaForm.controls.empresaMatriz.enable();
  //   }
    
  // }

}
