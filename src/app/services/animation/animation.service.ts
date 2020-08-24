import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  constructor() {


  }


  public valueToValueAnimation(aniCallback, valuesStart) {

    let originalValue = valuesStart;

    const animate = () => {
        originalValue = originalValue.map(v => v + 1);
        aniCallback(originalValue);
        requestAnimationFrame(animate);
    };

    animate();
  }
}
