import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  usuario: string | null = null;

  ngOnInit(): void {
    this.usuario = localStorage.getItem('usuario');     
  }
}