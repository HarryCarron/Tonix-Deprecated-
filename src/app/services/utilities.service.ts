import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor() { }

  public a = (ammount: number): number[] => {
      return Array.from({length: ammount}).map((i, v) => v);
  }

  public definitionArrayFromEnum = (enumIn: any): string[] => {
    return Object.keys(enumIn).filter((e) => {
        const v = parseInt(e, 0);
        return !v && v !== 0;
    });
  }

}
