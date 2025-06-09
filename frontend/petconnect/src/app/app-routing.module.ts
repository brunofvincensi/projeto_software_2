import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";
import { authGuard } from "./guards/auth.guard";
import { RegisterComponent } from "./auth/register/register.component";
import { MainLayoutComponent } from "./layout/main-layout/main-layout.component";
import { NgModule } from "@angular/core";
import { AnimaisDesaparecidosComponent } from "./animais/animais-desaparecidos/animais-desaparecidos.component";
import { AnimaisDesaparecidosNovoComponent } from "./animais/animais-desaparecidos/animais-desaparecidos-novo/animais-desaparecidos-novo.component";
import { UsuarioFormComponent } from "./usuario/usuario-form/usuario-form.component";
import { AnimaisDesaparecidosInfoComponent } from "./animais/animais-desaparecidos/animais-desaparecidos-info/animais-desaparecidos-info.component";
import { AnimaisDoacaoComponent } from "./animais/animais-doacao/animais-doacao.component";
import { AnimaisDoacaoNovoComponent } from "./animais/animais-doacao/animais-doacao-novo/animais-doacao-novo.component";
import { AnimaisDoacaoInfoComponent } from "./animais/animais-doacao/animais-doacao-info/animais-doacao-info.component";

const routes: Routes = [
    // Rotas públicas
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'animais', pathMatch: 'full' },
      { path: 'animais-desaparecidos', component: AnimaisDesaparecidosComponent },
      { path: 'animais-desaparecidos/novo', component: AnimaisDesaparecidosNovoComponent },
      { path: 'animais-desaparecidos/info/:id', component: AnimaisDesaparecidosInfoComponent },

      { path: 'animais-doacao', component: AnimaisDoacaoComponent },
      { path: 'animais-doacao/novo', component: AnimaisDoacaoNovoComponent },
      { path: 'animais-doacao/info/:id', component: AnimaisDoacaoInfoComponent },

      { path: 'usuario/form/:id', component: UsuarioFormComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Registra as rotas principais
  exports: [RouterModule] // Exporta para o AppModule
})
export class AppRoutingModule { }
