import { AuthGuard } from "./guards/auth.guard";
import { NgModule } from "@angular/core";
import { Routes, RouterModule, Router } from "@angular/router";
import { AuthMeuUsuarioGuard } from './guards/auth-meu-usuario.guard';

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
        path: "empresa",
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
      }
    ],
    canActivate: [AuthGuard],
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
        console.log(error);
        this.router.navigate(['/home']);         
      }
    }
  }
