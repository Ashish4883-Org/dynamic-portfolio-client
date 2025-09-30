import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.base;

  constructor(private http: HttpClient) {}

  me() {
    return this.http.get(this.baseUrl + 'me', { withCredentials: true });
  }
}
