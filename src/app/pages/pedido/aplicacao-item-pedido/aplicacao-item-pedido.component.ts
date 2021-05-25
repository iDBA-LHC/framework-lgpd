import { Component, OnInit, Inject } from '@angular/core';
import { AplicacaoItem } from 'src/app/models/pedido/aplicacao-item';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { startWith, map } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AplicacaoService } from 'src/app/services/aplicacao.service';

@Component({
  selector: 'app-aplicacao-item-pedido',
  templateUrl: './aplicacao-item-pedido.component.html',
  styleUrls: ['./aplicacao-item-pedido.component.css']
})
export class AplicacaoItemPedidoComponent implements OnInit {

  listaAplicacaoItem: AplicacaoItem[];

  listaAplicacaoItemFiltrados: Observable<AplicacaoItem[]>;
  aplicacaoItemPedidoForm: FormGroup;

  codigoItem: string = '';

  constructor(
    private aplicacaoService: AplicacaoService,
    public dialogRef: MatDialogRef<AplicacaoItemPedidoComponent>,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private snackBar: CustomSnackBarService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: AplicacaoItem,
  ) {}

  ngOnInit() {

    this.createForm(); 

    this.listaAplicacaoItemFiltrados = this.aplicacaoItemPedidoForm.controls.aplicacao.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.descricaoAplicacao),
      map(name => {
        return name ? this.filtraItens(name) : this.listaAplicacaoItem.slice();
      })
    );

  }

  private createForm() {
    this.aplicacaoItemPedidoForm = this.formBuilder.group({
      aplicacao: [AplicacaoItem, Validators.required],
      percentual: [0, [Validators.required, Validators.pattern('^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$')] ],  
    });

    this.aplicacaoItemPedidoForm.controls.aplicacao.valueChanges.subscribe(value => {
      if(value != null){
        let aplicacao : AplicacaoItem = this.listaAplicacaoItem.find( aplicacao => aplicacao.codigoAplicacao == this.aplicacaoItemPedidoForm.controls.aplicacao.value.codigoAplicacao);
        if(!aplicacao){
          this.aplicacaoItemPedidoForm.controls.aplicacao.setErrors( {required: true } );
        }
      }
    });
  }

  salvarAplicacaoItemPedido()
  {
    if (this.aplicacaoItemPedidoForm.valid) {
        let aplicacaoItem: AplicacaoItem = new AplicacaoItem();
        aplicacaoItem.codigoItem = this.codigoItem;
        aplicacaoItem.codigoAplicacao = this.aplicacaoItemPedidoForm.controls.aplicacao.value.codigoAplicacao;
        aplicacaoItem.descricaoAplicacao = this.aplicacaoItemPedidoForm.controls.aplicacao.value.descricaoAplicacao;
        aplicacaoItem.percentual = this.aplicacaoItemPedidoForm.controls.percentual.value;
        this.data = aplicacaoItem;
        this.dialogRef.close(this.data);
    }
    else {
      this.showMessage("Campos obrigatórios não foram preenchidos.", "Warn");
    }
  }

  private showMessage(msg: string, type: string = "Success") {
    this.snackBar.openSnackBar(msg, null, type);
  }

  private filtraItens(value: string): AplicacaoItem[] {
    const filterValue = value.toLowerCase();

    return this.listaAplicacaoItem.filter(item => item.descricaoAplicacao.trim().toLowerCase().includes(filterValue));
  }

  displayAplicacaoItem(aplicacaoItem: AplicacaoItem): string {
    return aplicacaoItem && aplicacaoItem.descricaoAplicacao ? aplicacaoItem.descricaoAplicacao : '';
  }

}
