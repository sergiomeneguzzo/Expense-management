import { Component, Input } from '@angular/core';
import { Expense } from '../../entities/expense';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-time-line',
  templateUrl: './time-line.component.html',
  styleUrl: './time-line.component.scss',
})
export class TimeLineComponent {
  @Input() expenses$: Observable<Expense[]> = new Observable();
}
