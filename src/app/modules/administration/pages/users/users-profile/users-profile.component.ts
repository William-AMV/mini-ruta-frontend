import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {JsonPipe} from "@angular/common";
import {User} from "../../../models/user";
import {AuthService} from '../../../../auth/services/auth.service';
import {PrimeNgModule} from '../../../../../../shared/components/primeNg';

@Component({
  selector: 'app-users-profile',
  standalone: true,
  imports: [
    JsonPipe,
    PrimeNgModule
  ],
  templateUrl: './users-profile.component.html',
  styleUrl: './users-profile.component.css'
})
export class UsersProfileComponent implements OnInit{
  authService = inject(AuthService);
  user: WritableSignal<User> = signal(new User());

  ngOnInit() {
    this.profile();
  }

  profile(){
    this.user.set(this.authService.user().user);
  }

}