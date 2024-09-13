import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AppStorage } from '../../components/storage/app.storage';
import { AuthService } from '../../components/services/auth/auth.service';
import { Credentials } from '../../components/models/auth/auth.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formulario!: FormGroup;

  constructor(
    private appStorage: AppStorage,
    private authService: AuthService,
    private snack: MatSnackBar,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.formulario = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  submit() {
    if(this.formulario.valid) {
      const credentials: Credentials = this.formulario.value;
      this.authService.login(credentials).subscribe(
        (resp: any) => {
          this.appStorage.setToken(resp.message);
          this.router.navigate(['/welcome']);
        },
        err => {
          console.log(err)
          this.snack.open('Detalles inválidos , vuelva a intentar !!','Aceptar',{
            duration:3000
          })
        }
      );
    }
  }
}
