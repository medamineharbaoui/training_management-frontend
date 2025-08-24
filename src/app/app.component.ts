import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  providers: [MessageService]
})
export class AppComponent {
  title = 'training_management_FE';
}
