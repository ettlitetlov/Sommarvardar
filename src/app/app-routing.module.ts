import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { HighscoreComponent } from "./highscore/highscore.component";


const routes: Routes = [
  { path: 'vote', component: UserProfileComponent},
  { path: 'highscore', component: HighscoreComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
