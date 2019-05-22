import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HtmlValidatorComponent } from './html-validator/html-validator.component';
import { HeadBannerComponent } from './head-banner/head-banner.component';
import { HtmlElemNavigationComponent } from './html-elem-navigation/html-elem-navigation.component';
import { HtmlValidMeterComponent } from './html-valid-meter/html-valid-meter.component';
import { HtmlDashboardComponent } from './html-dashboard/html-dashboard.component';
import { DataSharedService } from './shared.service';
import { HomeComponent } from './home/home.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FormsModule } from '@angular/forms'
import { HtmlValidResultsComponent } from './html-valid-results/html-valid-results.component';
import { ButtonComponent } from './button/button.component';
import { HtmlToTextService } from './services/html-to-text.service';
import { ModalComponent } from './modal/modal.component';
import { HtmlValidatorFooterComponent } from './html-validator-footer/html-validator-footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';




@NgModule({
  declarations: [
    AppComponent,
    HtmlValidatorComponent,
    HeadBannerComponent,
    HtmlElemNavigationComponent,
    HtmlValidMeterComponent,
    HtmlDashboardComponent,
    HomeComponent,
    HtmlValidResultsComponent,
    ButtonComponent,
    ModalComponent,
    HtmlValidatorFooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxDropzoneModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [DataSharedService, HtmlToTextService],
  bootstrap: [AppComponent],
  schemas: [
    // CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
