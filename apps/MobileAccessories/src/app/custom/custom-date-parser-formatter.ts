import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '-';

  // Parse user input string => NgbDateStruct
  parse(value: string): NgbDateStruct | null {
    if (value) {
      let parts = value.trim().split(this.DELIMITER);
      if (parts.length === 3) {
        return {
          day: parseInt(parts[0], 10),
          month: parseInt(parts[1], 10),
          year: parseInt(parts[2], 10)
        };
      }
    }
    return null;
  }

  // Format NgbDateStruct => string for input box
  format(date: NgbDateStruct | null): string {
    return date ?
      ('0' + date.day).slice(-2) + this.DELIMITER +
      ('0' + date.month).slice(-2) + this.DELIMITER +
      date.year : '';
  }
}
