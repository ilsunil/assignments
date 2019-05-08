import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HtmlDashboardComponent } from './html-dashboard/html-dashboard.component';
import { DataSharedService } from './shared.service';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
    { path: '', component: AppComponent, pathMatch: 'full' },
    {path: 'home', component: HomeComponent}, 
    {path: 'dashboard', component: HtmlDashboardComponent}    
    // { path: '**', redirectTo: 'landingpage', pathMatch: 'full' },
    // { path: '', redirectTo: 'landingpage', pathMatch: 'full' }
  ];
  
  @NgModule({
    imports: [
      RouterModule.forRoot(routes)
    ],
    exports: [
      RouterModule
    ],
    providers: [      
      DataSharedService
    ]
  })
  export class AppRoutingModule {
  }