import { inject, Injectable } from '@angular/core';
import { User } from '../../models/user.interface';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private httpClient = inject(HttpClient);

  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>('http://localhost:8080/users').pipe(
      catchError((error) => {
        console.error('Erreur:', error);
        
        if (error.status === 404) {
          console.log('Ressource non trouvée');
        } else if (error.status === 500) {
          console.log('Erreur serveur');
        } else if (error.status === 0) {
          console.log('Problème de réseau');
        }
        
        // Return empty array or rethrow error
        return of([]); // or throwError(() => error)
      })
    );
  }

  getUserById(id : number): Observable<User> {
    return this.httpClient.get<User>(`http://localhost:8080/users/${id}`).pipe(
      catchError((error) => {
        console.error('Erreur:', error);
        
        if (error.status === 404) {
          console.log('Ressource non trouvée');
        } else if (error.status === 500) {
          console.log('Erreur serveur');
        } else if (error.status === 0) {
          console.log('Problème de réseau');
        }
        
        // Return empty array or rethrow error
        return of(); // or throwError(() => error)
      })
    );
  }
}
