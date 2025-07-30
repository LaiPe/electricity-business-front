import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { User } from '../../../models/user.interface';
import { RouterLink } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-all-users',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.css'
})
export class AllUsersComponent {
  private userService = inject(UserService);
  
  users : Array<User> | undefined;
  
  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (users) => this.users = users,
      error: (error) => console.error('Erreur récupération users:', error)
    });
  }
}
