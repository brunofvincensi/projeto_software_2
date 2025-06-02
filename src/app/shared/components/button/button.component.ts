import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: '../button/button.component.html',
  styleUrls: ['../button/button.component.css'],

})
export class ButtonComponent {
  @Input() label: string = 'Clique';
  @Input() type: 'primary' | 'secondary' = 'primary';
}
