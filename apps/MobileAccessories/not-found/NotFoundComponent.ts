import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <div class="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  `,
  styles: [`
    .not-found-container {
      text-align: center;
      margin-top: 100px;
    }
    h1 {
      font-size: 3rem;
      color: #d32f2f;
    }
    p {
      font-size: 1.2rem;
      color: #555;
    }
  `]
})
export class NotFoundComponent {}
