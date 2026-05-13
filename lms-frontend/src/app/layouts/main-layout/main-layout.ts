import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar';
  @Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [RouterOutlet,NavbarComponent],
    templateUrl: './main-layout.html',
    styleUrl: './main-layout.scss',
  })
  export class MainLayoutComponent {};
