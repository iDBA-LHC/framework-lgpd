import { NgModule } from "@angular/core";
import { Router, RouterModule, Routes } from "@angular/router";
import { AuthMeuUsuarioGuard } from './guards/auth-meu-usuario.guard';
import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "priva",
    pathMatch: "full"
  },
  {
    path: "priva",
    children: [
      {
        path: "",
        redirectTo: "home",
        pathMatch: "full",
      },
      {
        path: "home",
        loadChildren: () =>
          import("./pages/home/home.module").then(
            (module) => module.HomeModule
          ),
          canActivate: [AuthGuard],
      },
      {
        path: "usuario",
        loadChildren: () =>
          import("./pages/usuario/usuario.module").then(
            (module) => module.UsuarioModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "meu-usuario",
        loadChildren: () =>
          import("./pages/usuario/usuario.module").then(
            (module) => module.UsuarioModule
          ),
        canActivate: [AuthMeuUsuarioGuard],
      },
      {
        path: "muda-senha",
        loadChildren: () =>
          import("./pages/muda-senha/muda-senha.module").then(
            (module) => module.MudaSenhaModule
          ),
          canActivate: [AuthGuard],  
      },
      {
        path: "controladora",
        loadChildren: () =>
          import("./pages/empresa/empresa.module").then(
            (module) => module.EmpresaModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "area",
        loadChildren: () =>
          import("./pages/area/area.module").then(
            (module) => module.AreaModule
          ),
        canActivate: [AuthGuard],
      }, {
        path: "base-legal",
        loadChildren: () =>
          import("./pages/base-legal/base-legal.module").then(
            (module) => module.BaseLegalModule
          ),
        canActivate: [AuthGuard],
      }, {
        path: "ciclo-de-vida",
        loadChildren: () =>
          import("./pages/ciclo-de-vida/ciclo-de-vida.module").then(
            (module) => module.CicloDeVidaModule
          ),
        canActivate: [AuthGuard],
      }, {
        path: "ciclo-monitoramento",
        loadChildren: () =>
          import("./pages/ciclo-monitoramento/ciclo-monitoramento.module").then(
            (module) => module.CicloMonitoramentoModule
          ),
        canActivate: [AuthGuard],
      },{
        path: "forma-coleta",
        loadChildren: () =>
          import("./pages/forma-coleta/forma-coleta.module").then(
            (module) => module.FormaColetaModule
          ),
        canActivate: [AuthGuard],
      }, {
        path: "metadados",
        loadChildren: () =>
          import("./pages/metadados/metadados.module").then(
            (module) => module.MetadadosModule
          ),
        canActivate: [AuthGuard],
      }, {
        path: "compartilhamento",
        loadChildren: () =>
          import("./pages/compartilhamento/compartilhamento.module").then(
            (module) => module.CompartilhamentoModule
          ),
        canActivate: [AuthGuard],
      }, {
        path: "local-armazenamento",
        loadChildren: () =>
          import("./pages/local-armazenamento/local-armazenamento.module").then(
            (module) => module.LocalArmazenamentoModule
          ),
        canActivate: [AuthGuard],
      }, {
        path: "risco",
        loadChildren: () =>
          import("./pages/risco/risco.module").then(
            (module) => module.RiscoModule),
        canActivate: [AuthGuard],
      }, {  
        path: "risco-associado",
        loadChildren: () =>
          import("./pages/risco-associado/risco-associado.module").then(
            (module) => module.RiscoAssociadoModule
          ),
        canActivate: [AuthGuard],
      }, {
        path: "ameaca",
        loadChildren: () =>
          import("./pages/ameaca/ameaca.module").then(
            (module) => module.AmeacaModule
          ),
        canActivate: [AuthGuard],
      }, {
        path: "data-map",
        loadChildren: () =>
          import("./pages/data-flow/data-flow.module").then(
            (module) => module.DataFlowModule
          ),
        canActivate: [AuthGuard],
      }, {
        path: "data-analisys-map",
        loadChildren: () =>
          import("./pages/data-map/data-map.module").then(
            (module) => module.DataMapModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "data-governance-map",
        loadChildren: () =>
          import("./pages/data-map/data-map.module").then(
            (module) => module.DataMapModule
          ),
        canActivate: [AuthGuard],
      }, 
      // {
      //   path: "data-flow",
      //   loadChildren: () =>
      //     import("./pages/data-flow/data-flow.module").then(
      //       (module) => module.DataFlowModule
      //     ),
      //   canActivate: [AuthGuard],
      // },
      {
        path: "mapa-tratamento-dados",
        loadChildren: () =>
          import("./pages/relatorios/mapa-tratamento-dados/mapa-tratamento-dados.module").then(
            (module) => module.MapaTratamentoDadosModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "inventario-contratos",
        loadChildren: () =>
          import("./pages/relatorios/inventario-contratos/inventario-contratos.module").then(
            (module) => module.InventarioContratosModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "mapa-riscos",
        loadChildren: () =>
          import("./pages/relatorios/mapa-riscos/mapa-riscos.module").then(
            (module) => module.MapaRiscosModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "relatorio-ripd",
        loadChildren: () =>
          import("./pages/relatorios/relatorio-ripd/relatorio-ripd.module").then(
            (module) => module.RelatorioRIPDModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "incidente",
        loadChildren: () =>
          import("./pages/incidente/incidente.module").then(
            (module) => module.IncidenteModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "solicitacao-titular",
        loadChildren: () =>
          import("./pages/solicitacao-titular/solicitacao-titular.module").then(
            (module) => module.SolicitacaoTitularModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "data-discovery",
        loadChildren: () =>
          import("./pages/data-discovery/data-discovery.module").then(
            (module) => module.DataDiscoveryModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "consentimento",
        loadChildren: () =>
          import("./pages/consentimento/consentimento.module").then(
            (module) => module.ConsentimentoModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "auditoria",
        loadChildren: () =>
          import("./pages/auditoria/auditoria.module").then(
            (module) => module.AuditoriaModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "cookie",
        loadChildren: () =>
          import("./pages/cookie/cookie.module").then(
            (module) => module.CookieModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: "ripd",
        loadChildren: () =>
          import("./pages/ripd/ripd.module").then(
            (module) => module.RIPDModule
          ),
        canActivate: [AuthGuard],
      }
    ],
  },
  {
    path: "public",
    children: [
      {
        path: "sign-in",
        loadChildren: () =>
          import("./pages/sign-in/sign-in.module").then(
            (module) => module.SignInModule
          ),
      },
      {
        path: "nova-senha",
        loadChildren: () =>
          import("./pages/nova-senha/nova-senha.module").then(
            (module) => module.NovaSenhaModule
          ), 
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(private router: Router) {
      this.router.errorHandler = (error: any) => {
        this.router.navigate(['/priva/home']);
      }
    }
  }
