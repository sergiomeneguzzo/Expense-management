import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CardModule } from 'primeng/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { EmailConfirmedComponent } from './pages/auth/email-confirmed/email-confirmed.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { CheckEmailComponent } from './pages/auth/check-email/check-email.component';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { AuthInterceptor } from './utils/auth.interceptor';
import { TableModule } from 'primeng/table';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService } from 'primeng/dynamicdialog';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { CustomCardsComponent } from './components/custom-cards/custom-cards.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { TimeLineComponent } from './components/time-line/time-line.component';
import { ThreeChartsComponent } from './components/three-charts/three-charts.component';
import { ProgressBarModule } from 'primeng/progressbar';
import { TabMenuModule } from 'primeng/tabmenu';
import { AddModalComponent } from './components/add-modal/add-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SummaryComponent } from './components/summary/summary.component';
import { LoaderComponent } from './components/loader/loader.component';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { SettingsComponent } from './pages/settings/settings.component';

registerLocaleData(localeIt, 'it');

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    SidebarComponent,
    EmailConfirmedComponent,
    LoginComponent,
    RegisterComponent,
    CheckEmailComponent,
    CustomCardsComponent,
    BarChartComponent,
    TimeLineComponent,
    ThreeChartsComponent,
    AddModalComponent,
    SummaryComponent,
    LoaderComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ButtonModule,
    CardModule,
    MatIconModule,
    MatListModule,
    ReactiveFormsModule,
    HttpClientModule,
    InputTextModule,
    PasswordModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    DividerModule,
    TableModule,
    NgApexchartsModule,
    ChartModule,
    DialogModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    TabMenuModule,
    MatDialogModule,
    ProgressBarModule,
  ],
  providers: [
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'it' },
    DialogService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
