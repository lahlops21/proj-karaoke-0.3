import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TelaInicialComponent } from './tela-inicial/tela-inicial.component';
import { ResultadoBuscaComponent } from './resultado-busca/resultado-busca.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,  TelaInicialComponent, ResultadoBuscaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'proj-karaoke';
}
