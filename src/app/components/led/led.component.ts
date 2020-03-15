import { Component, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { noop } from 'rxjs';

@Component({
  selector: 'app-led',
  templateUrl: './led.component.html',
  styleUrls: ['./led.component.css'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => LedComponent),
    multi: true
 }]
})
export class LedComponent implements ControlValueAccessor {

  constructor() { }

  isOn = false;

  private onChange;

  toggle() {
    this.isOn = !this.isOn === true;
    this.onChange(this.isOn);
  }

  // Function to call when the input is touched (when a star is clicked).
  onTouched = () => {};



  registerOnTouched(fn: () => void): void {

  }

  // Allows Angular to disable the input.
  setDisabledState(isDisabled: boolean): void {
    noop(); // todo
  }

  writeValue(isOn: boolean): void {
    this.isOn = isOn;
  }

  // Allows Angular to register a function to call when the model (rating) changes.
  // Save the function as a property to call later here.
  registerOnChange(fn: (rating: boolean) => void): void {
    this.onChange = fn;
  }


}
