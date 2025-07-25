import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { AllUsersComponent } from './features/users/all-users/all-users.component';
import { ProfilePageComponent } from './features/users/profile-page/profile-page.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'users', component: AllUsersComponent},
    {path: 'users/:id', component: ProfilePageComponent},

    { path: '404', component: PageNotFoundComponent },
    { path: '**', redirectTo: '/404' }// Route wildcard pour 404
];
