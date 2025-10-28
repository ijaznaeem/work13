import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(Products: any[], searchTerm: string, labelKey?: string): any {
    if (!Products || !searchTerm) {
      return null;
    }

    return Products.filter(
      item =>
        item[labelKey || 'name']
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) === true
    ).slice(0,10);
  }
}
