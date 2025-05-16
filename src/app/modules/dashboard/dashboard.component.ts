import {Component, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {CardModule} from "primeng/card";
import {DividerModule} from "primeng/divider";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CardModule,
    DividerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}