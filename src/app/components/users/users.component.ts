import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { User } from '../../models/user.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  users : Array<User> = [
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
  ]
}
