import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-cards',
  templateUrl: './custom-cards.component.html',
  styleUrl: './custom-cards.component.scss',
})
export class CustomCardsComponent {
  @Input() icon!: string;
  @Input() title!: string;
  @Input() amount!: number;
  @Input() percentage!: number;
}
