import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // private baseUrl = 'http://127.0.0.1:3333'; // Adonis backend URL
  private baseUrl = environment.base;

  constructor(private http: HttpClient) {}

  getHello(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  post(url: any, data: any, options?: any) {
    return this.http.post(environment.base + url, data, options);
  }

  put(url: any, data: any, options?: any) {
    return this.http.put(environment.base + url, data, options);
  }

  delete(url: any, options?: any) {
    return this.http.delete(environment.base + url, options);
  }

  get(url: any, options?: any) {
    return this.http.get(environment.base + url, options);
  }
}
