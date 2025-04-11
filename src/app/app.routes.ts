import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ModuliComponent } from './moduli/moduli.component';
import { SponsorComponent } from './sponsor/sponsor.component';
import { CookieComponent } from './cookie/cookie.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { ShopComponent } from './shop/shop.component';
import { CheckoutComponent } from './checkout/checkout.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect to 'home'
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'moduli', component: ModuliComponent },
    { path: 'sponsor', component: SponsorComponent },
    { path: 'cookie', component: CookieComponent },
    { path: 'privacy', component: PrivacyComponent },
    { path: 'shop', component: ShopComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: '', redirectTo: 'shop', pathMatch: 'full' }
];
