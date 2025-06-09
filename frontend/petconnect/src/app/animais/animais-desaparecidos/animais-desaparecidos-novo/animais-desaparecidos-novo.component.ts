import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnimalDesaparecidoService } from 'src/app/services/animal-desaparecido.service';

@Component({
  selector: 'app-animais-desaparecidos-novo',
  templateUrl: './animais-desaparecidos-novo.component.html',
  styleUrls: ['./animais-desaparecidos-novo.component.css']
})
export class AnimaisDesaparecidosNovoComponent {

  fotoFile: File | null = null;  // Alterado para File
  fotoPreview: string | null = null;  // Adicionado para preview

  animalForm = this.fb.group({
    // Seção 1
    animal: this.fb.group({
        nome: ['', Validators.required],
        especie: ['', Validators.required],
        raca: [''],
        idade: ['', Validators.required],
        descricao: ['', Validators.required]
    }),

    // Seção 3
    dataDesaparecimento: ['', Validators.required],
    local: ['', Validators.required],
    complemento: [''],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: AnimalDesaparecidoService
  ) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fotoFile = file;

      // Cria preview (opcional)
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removerFoto() {
    this.fotoFile = null;
    this.fotoPreview = null;
  }

  onSubmit() {
    if (this.animalForm.valid) {
      const formData = new FormData();

      formData.append('animal', new Blob([JSON.stringify(this.animalForm.value)], {
        type: 'application/json'
      }));

      if (this.fotoFile) {
        // Adiciona o arquivo original (não a versão base64)
        formData.append('foto', this.fotoFile, this.fotoFile?.name);
      }

      // Adiciona campos do formulário
      // Object.keys(this.animalForm.controls).forEach(key => {
      //   formData.append(key, this.animalForm.get(key)?.value);
      // });

      // Adiciona fotos (simulação - em produção seria multipart/form-data)
      console.log('Dados do formulário:', this.animalForm.value);
      console.log('Dados do formulário:', this.fotoFile);

      this.service.save(formData).then(() => {
        // Redireciona após cadastro
        this.router.navigate(['/animais-desaparecidos']);
      })
      .catch(err => alert(err))
    }
  }
}
