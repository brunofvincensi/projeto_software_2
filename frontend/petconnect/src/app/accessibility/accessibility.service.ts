import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AccessibilityService {
  private fontSize = 100; // porcentagem
  private contrastMode = false;

  increaseFont() {
    this.fontSize = Math.min(this.fontSize + 10, 200);
    document.documentElement.style.fontSize = this.fontSize + '%';
  }

  decreaseFont() {
    this.fontSize = Math.max(this.fontSize - 10, 80);
    document.documentElement.style.fontSize = this.fontSize + '%';
  }

  toggleContrast() {
    this.contrastMode = !this.contrastMode;
    document.body.classList.toggle('high-contrast', this.contrastMode);
  }

  speak(text: string) {
    const msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
  }

}
