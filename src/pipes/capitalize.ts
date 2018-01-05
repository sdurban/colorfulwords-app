import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'capitalizeFirst'
})
export class CapitalizeFirstPipe implements PipeTransform {
  /**
   * Returns the same string gived with first character in uppercase.
   *
   * @param {string} value
   * @param args
   * @returns {string}
   */
  transform(value: string, args: any[]): string {
    if (value === null) return 'Not assigned';
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
