import { Pipe, PipeTransform } from '@angular/core';
import { TaxBracket } from 'app/core/models/tax.model';
import { Value } from 'app/core/models/value.model';

@Pipe({
  name: 'taxBracket',
  standalone: true,
})
export class TaxBracketPipe implements PipeTransform {
  transform(bracket: TaxBracket | null): Value[] {
    if (!bracket) {
      return [
        {
          label: 'N/A',
          value: 'N/A',
        },
      ];
    }
    return [
      {
        label: 'Minimum Bracket Income',
        value: `$${bracket.minIncome}.00+`,
      },
      {
        label: 'Tax Rate',
        value: `${bracket.taxRate}%`,
      },
    ];
  }
}
