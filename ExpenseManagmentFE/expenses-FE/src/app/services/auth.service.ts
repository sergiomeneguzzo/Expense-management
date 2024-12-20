import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap, map, Observable } from 'rxjs';
import { JwtService } from './jwt.service';
import { User } from '../entities/user';
import { apiUrl } from '../../../secrets';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _currentUser$ = new BehaviorSubject<User | null>(null);
  currentUser$ = this._currentUser$.asObservable();

  private _loading$ = new BehaviorSubject<boolean>(false);
  loading$ = this._loading$.asObservable();

  constructor(
    private jwtSrv: JwtService,
    private http: HttpClient,
    private router: Router
  ) {
    this.fetchUser();
  }

  isLoggedIn() {
    return this.jwtSrv.hasToken();
  }

  login(username: string, password: string) {
    return this.http
      .post<{ user: User; token: string }>(`${apiUrl}/login`, {
        username,
        password,
      })
      .pipe(
        tap((res) => this.jwtSrv.setToken(res.token)),
        tap((res) => this._currentUser$.next(res.user)),
        map((res) => res.user)
      );
  }

  register(
    firstName: string,
    lastName: string,
    username: string,
    picture: string,
    password: string,
    confirmPassword: string
  ) {
    return this.http.post(`${apiUrl}/register`, {
      firstName,
      lastName,
      username,
      password,
      confirmPassword,
      picture,
    });
  }

  logout() {
    this.jwtSrv.removeToken();
    this._currentUser$.next(null);
    this.router.navigate(['/']);
  }

  public fetchUser() {
    this._loading$.next(true);
    this.http.get<User>(`${apiUrl}/users/me`).subscribe({
      next: (user) => {
        this._currentUser$.next(user);
        this._loading$.next(false);
        console.log('user log: ', user);
      },
      error: (err) => {
        this._loading$.next(false);
        if (err.status === 401) {
          this.logout();
        }
        console.error('Error fetching user:', err);
      },
    });
  }

  updatePassword(
    newPassword: string,
    confirmPassword: string
  ): Observable<any> {
    const body = {
      newPassword,
      confirmPassword,
    };
    return this.http.patch<any>(`${apiUrl}/users/updatePassword`, body);
  }

  confirmEmail(token: string): Observable<any> {
    return this.http.post(`${apiUrl}/users/email-confirmation`, { token });
  }

  updateUserPicture(url: string): Observable<any> {
    return this.http.patch(`${apiUrl}/users/update-profile-picture`, {
      url,
    });
  }
}
