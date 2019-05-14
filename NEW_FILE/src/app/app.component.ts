import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { style, animate, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})


export class AppComponent {
  constructor(  private router: Router ) {
      this.router.navigate(['/home']);
    }  
    
}
