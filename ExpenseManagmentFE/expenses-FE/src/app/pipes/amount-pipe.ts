import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kFormatter',
  standalone: true,
})
export class KFormatterPipe implements PipeTransform {
  transform(value: number): string {
    if (Math.abs(value) < 1000) {
      return value.toString();
    }

    return (Math.abs(value) / 1000).toFixed(1) + 'k';
  }
}
