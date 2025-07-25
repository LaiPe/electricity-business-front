import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../models/user.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent implements OnInit {
	
		//méthode inject : Alternative a l'injeciton via constructor
    //Injection de la route
		private route = inject(ActivatedRoute);
    //Injection du router
    private router = inject(Router);
	
		//Propriété représentant le paramètre id
    userId: number | undefined = undefined;

    //Propriété représentant l'user correspondant à l'id
    user: User | undefined;
    
	ngOnInit() {
    const userIdString: string | null = this.route.snapshot.paramMap.get('id');

    // Vérifier que l'id est bien présent et convertible en nombre
    if (!userIdString || isNaN(+userIdString)) {
      this.router.navigate(['/404']);
      return;
    }

    this.userId = parseInt(userIdString, 10);
    this.user = this.users.find(u => u.id === this.userId);

    // Si aucun utilisateur ne correspond à l'id, rediriger vers une page 404
    if (!this.user) {
      this.router.navigate(['/404']);
      return;
    }
  }

  //Data users
  private users : Array<User> = [
    {
      "id": 1,
      "username": "johnupdated",
      "email": "john.updated@example.com",
      "firstName": "John",
      "lastName": "Updated",
      "birthDate": "1990-05-15",
      "role": "USER",
      "signinDate": "2024-01-15T10:30:00",
      "banned": false
    },
    {
      "id": 3,
      "username": "johndoe",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "birthDate": "1990-05-15",
      "role": "USER",
      "signinDate": "2025-07-24T20:55:06.940965",
      "banned": false
    },
    {
      "id": 4,
      "username": "admin",
      "email": "admin@company.com",
      "firstName": "Alice",
      "lastName": "Smith",
      "birthDate": "1985-12-01",
      "role": "ADMIN",
      "signinDate": "2025-07-24T20:55:07.721054",
      "banned": false
    },
    {
      "id": 5,
      "username": "banneduser",
      "email": "banned@example.com",
      "firstName": "Banned",
      "lastName": "User",
      "birthDate": "1988-03-10",
      "role": "USER",
      "signinDate": "2025-07-24T20:55:11.684188",
      "banned": true
    }
  ];
}