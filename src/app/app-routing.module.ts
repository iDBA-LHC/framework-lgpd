import { NgModule } from "@angular/core";
import { Router, RouterModule, Routes } from "@angular/router";
import { AuthMeuUsuarioGuard } from './guards/auth-meu-usuario.guard';
import { AuthGuard } from "./guards/auth.guard";

const routes: Routes = [
  {
    path: "",
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
        path: "data-map",
        loadChildren: () =>
          import("./pages/data-map/data-map.module").then(
            (module) => module.DataMapModule
          ),
        canActivate: [AuthGuard],
      }, {
        path: "data-analisys-map",
        loadChildren: () =>
          import("./pages/data-map/data-map.module").then(
            (module) => module.DataMapModule
          ),
        canActivate: [AuthGuard],
      }, {
        path: "data-flow",
        loadChildren: () =>
          import("./pages/data-flow/data-flow.module").then(
            (module) => module.DataFlowModule
          ),
        canActivate: [AuthGuard],
      },
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
        this.router.navigate(['/home']);
      }
    }
  }
