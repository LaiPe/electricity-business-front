import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../models/user.interface';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';

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
    //Injection du service
    private userService = inject(UserService)
	
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

    this.user = this.userService.getUserById(this.userId);

    // Si aucun utilisateur ne correspond à l'id, rediriger vers une page 404
    if (!this.user) {
      this.router.navigate(['/404']);
      return;
    }
  }

}