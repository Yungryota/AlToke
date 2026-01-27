import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, NgIf],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})

export class Navbar {

  mostrarModal = false;

  constructor(
    private router: Router) {}

  Logout()
  {
    this.router.navigate(['/login']);
  }

  AbrirModal(){
    console.log("MOSTRAR MODAL");
    this.mostrarModal = true;
  }

  CerrarModal(){
    this.mostrarModal = false;
  }

}
