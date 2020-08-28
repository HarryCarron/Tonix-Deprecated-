import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {

    private fps = 20;
    private now;
    private then;
    private interval = 1000 / this.fps;
    private delta;

  constructor() {}

    public valueToValueAnimation(aniCallback, data: any[], stopData: any[]) {

        let manipData = data;
        const travelTime = 10;
        const travelUnits = data.map((d, i) =>
        Math.round(Math.abs(d - stopData[i]) / travelTime)
        );

        const animate = () => {

            manipData = manipData
            .map((d, i) => {
                const stopValue = stopData[i];
                if (d === stopValue) {
                    return d;
                } else {
                    return  Math.round(d > stopValue ? d - travelUnits[i] : d + travelUnits[i]);
                }
            });

            aniCallback(manipData);
            if (!manipData.every((d, i) => d >= stopData[i]) ) {
            requestAnimationFrame(animate);
            } else {
                console.log(stopData, manipData);
                
            // todo: some kind of success callback
            }
        };

    animate();
    }
    }
