import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";

export const adminGuard: CanActivateFn = () => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol"); // Guarda el rol cuando haces login
    const router = inject(Router);

    console.log('Rol actual: ', rol);
    

    if (!token) {
        router.navigate(['/login']);
        return false;
    }

    if (rol === 'Admin') {
        return true;
    } else {
        router.navigate(['/welcome']); // o donde quieras redirigir si no es admin
        return false;
    }
}