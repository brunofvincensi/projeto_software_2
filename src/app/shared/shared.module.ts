import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importar aqui o ButtonComponent
import { ButtonComponent } from './components/button/button.component';

@NgModule({
  declarations: [
    ButtonComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ButtonComponent
  ]
})
export class SharedModule { }
