import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'DateFormatPipe',
})
export class DateFormatPipe implements PipeTransform {
    transform(value: string) {
       var datePipe = new DatePipe("pt-BR");
        value = datePipe.transform(value, 'dd/MM/yyyy');
        return value;
    }

    transformToScreen(value: string) {
        var datePipe = new DatePipe("pt-BR");
         value = datePipe.transform(value, 'yyyy-MM-dd');
         return value;
     }
}