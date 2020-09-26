import { Injectable } from '@angular/core';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  constructor() {}

    public valueToValueAnimation(
        aniCallback: (arg: number[]) => void,
        data: number[],
        stopData: number[],
        duration: number = 10
        ) {

        let manipData = data;
        let validators;
        const greatThanVal = (v, i) => v < stopData[i];
        const lessThanVal = (v, i) => v > stopData[i];

        function prepare(d) {
            validators = d.map(da => {
                if (da >= stopData[1]) {
                    return greatThanVal;
                } else {
                    return lessThanVal;
                }
            });
        }

        prepare(data);

        const sanitise = v => v.map(va => Math.round(va));

        data = sanitise(data);
        stopData = sanitise(stopData);
         const travelUnits = data.map((d, i) => Math.abs(d - stopData[i]) / duration );

        const animate = () => {

            const then = performance.now();

            manipData = manipData
            .map((d, i) => {
                const stopValue = stopData[i];
                return (d === stopValue) ? d : d > stopValue ? d - travelUnits[i] : d + travelUnits[i];
            });

            aniCallback(manipData);

            if (validators.every(v => !!v())) {
                requestAnimationFrame(animate);

            } else {

            // todo: some kind of success callback
            }
        };

        animate();
        }
    }
