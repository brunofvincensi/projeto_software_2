import { Component } from '@angular/core';
import { AccessibilityService } from './accessibility.service';

@Component({
  selector: 'app-accessibility',
  template: `
    <div class="accessibility-bar">
      <button (click)="increaseFont()">A+</button>
      <button (click)="decreaseFont()">A-</button>
      <button (click)="toggleContrast()">Contraste</button>
      <button (click)="speak()">Ler Página</button>
      <a href="#main-content" class="skip-link">Ir para o conteúdo</a>
    </div>
  `,
  styles: [`
    .accessibility-bar {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #eee;
      padding: 10px;
      z-index: 9999;
      display: flex;
      gap: 8px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.2);
    }

    .skip-link {
      position: absolute;
      left: -999px;
      top: -999px;
    }

    .skip-link:focus {
      left: 10px;
      top: 50px;
      background: yellow;
      padding: 5px;
    }
  `]
})
export class AccessibilityComponent {
  constructor(private acc: AccessibilityService) {}

  increaseFont() { this.acc.increaseFont(); }
  decreaseFont() { this.acc.decreaseFont(); }
  toggleContrast() { this.acc.toggleContrast(); }

  speak() {
    const content = document.getElementById('mainContent') || document.body;
    const text = content.innerText || 'Conteúdo não encontrado';
    this.acc.speak(text);
  }
}
