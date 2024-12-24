import { Component, Input } from '@angular/core';
import { Expense } from '../../entities/expense';

@Component({
  selector: 'app-time-line',
  templateUrl: './time-line.component.html',
  styleUrl: './time-line.component.scss',
})
export class TimeLineComponent {
  @Input() expenses: Expense[] = [];
}