import { DashboardComponent } from './dashboard/dashboard.component';
import { Routes } from '@angular/router';
import { AdminComponent } from './layouts/admin/admin.component';
import { EndUserComponent } from './layouts/end-user/end-user.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { ManageVaccineComponent } from './manage-vaccine/manage-vaccine.component';
import { ManageDeviceComponent } from './manage-device/manage-device.component';
import { ManageConnectionsComponent } from './manage-connections/manage-connections.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { ManageDosesComponent } from './manage-doses/manage-doses.component';

export const routes: Routes = [
  {
    path: '',
    component: EndUserComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'search-result', component: SearchResultComponent},
    ]
  },
  {
    path: 'admin', component: AdminComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'vaccines', component: ManageVaccineComponent },
      { path: 'doses', component: ManageDosesComponent },
      { path: 'devices', component: ManageDeviceComponent },
      { path: 'connections', component: ManageConnectionsComponent},
      { path: 'profile', component: ProfileComponent },
    ]
  },
  { path: 'login', component: LoginComponent },

];
