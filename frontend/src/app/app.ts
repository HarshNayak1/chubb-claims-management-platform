
import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div class="container">
      <h1>Angular + Spring Boot Demo</h1>

      <h2>Backend Response:</h2>

      <p>{{ message() }}</p>
    </div>
  `,
  styles: [`
    .container {
      text-align: center;
      margin-top: 100px;
      font-family: Arial, sans-serif;
    }

    h1 {
      color: #1976d2;
    }

    p {
      color: green;
      font-size: 22px;
      font-weight: bold;
    }
  `]
})
export class App implements OnInit {

  message = signal('Connecting to Spring Boot...');

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('http://localhost:8080/', {
      responseType: 'text'
    }).subscribe({
      next: (response) => {
        console.log('Backend response:', response);
        this.message.set(response);
      },
      error: (error) => {
        console.error('API error:', error);
        this.message.set('Backend connection failed!');
      }
    });
  }
}
