    export class Ball {
        r: number;
        cx: number;
        cy: number;
        vx: number;
        vy: number;
        fill: string;
    
        constructor (canvasWidth: number, canvasHight: number, 
                    velocityX: number, velocityY: number) {
            this.r = 5;
            this.cx = canvasWidth;
            this.cy = canvasHight;
            this.vx = velocityX;
            this.vy = velocityY;
            this.fill = "white";
        }
    }