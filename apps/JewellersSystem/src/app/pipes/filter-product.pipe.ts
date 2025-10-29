import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filterproduct',
    pure: false
})

export class FilterProductPipe implements PipeTransform {
    transform(Products: any[], args: any[]): any {
        // return Products.filter(item => item.ProductName.indexOf(args[0]) !== -1);
        let filtered = [];
        filtered = Products.filter(x => {
            let idx = -1;
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < x.length; i++) {
                idx = x[0].toUpperCase().indexOf(args[0]);
                if (idx >= 0) {
                    return true;
                }
            }
            return idx >= 0;
        });
    }
}
