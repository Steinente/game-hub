import { Routes } from '@angular/router'
import { HomePageComponent } from './features/home/home-page.component'
import { LegalImprintPageComponent } from './features/legal/legal-imprint-page.component'
import { LegalPrivacyPageComponent } from './features/legal/legal-privacy-page.component'

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'imprint',
    component: LegalImprintPageComponent,
  },
  {
    path: 'privacy',
    component: LegalPrivacyPageComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
]
