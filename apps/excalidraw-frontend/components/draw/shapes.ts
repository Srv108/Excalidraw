type DrawingState = {
    strokeColor?: string;
    strokeWidth?: number;
    strokeStyle?: CanvasLineCap;
    fillColor?: string;
    opacity?: number;
};

abstract class Shape {
    protected startX: number;
    protected startY: number;
    protected strokeColor: string;
    protected strokeStyle: CanvasLineCap;
    protected strokeWidth: number;
    protected opacity: number;
    protected isSelected: boolean;
    protected fillColour: string;


    constructor (x: number, y: number){
        this.startX = x;
        this.startY = y;
        this.strokeColor = "#000000" /* black */
        this.strokeStyle = 'round';
        this.opacity = 1;
        this.isSelected = false;
        this.strokeWidth = 2;
        this.fillColour = 'transparent';
    }

    /* draw method is to implement by their subclasses */
    abstract draw (ctx: CanvasRenderingContext2D): void;

    /* common method for all shapes */
    setStrokeColor(color: string): void{
        this.strokeColor = color;
    }

    setStrokeWidth(width: number): void{
        this.strokeWidth = width;
    }

    setOpacity(x: number): void{
        this.opacity = x;
    }

    setShapeColor(color: string): void{
        this.fillColour = color;
    }

    setIsShapeSelected(confirm: boolean): void{
        this.isSelected = confirm;
    }

    /* method to check is cursor inside the shape implemented by their subclasses*/
    isPointInside(x: number, y: number): boolean{
        return false;
    }

    /* to move the shape */
    toMove(x: number, y: number): void{
        this.startX = x;
        this.startY = y
    }

    /* get the current state of shapes */
    getState (): DrawingState{
        return {
            strokeColor: this.strokeColor,
            strokeStyle: this.strokeStyle,
            strokeWidth: this.strokeWidth,
            opacity: this.opacity,
            fillColor: this.fillColour
        }
    }

    /* set the states of the drawing */
    setState (state: DrawingState) : void{
        this.strokeColor = state.strokeColor ?? "#000000";
        this.strokeStyle = state.strokeStyle ?? "round";
        this.strokeWidth = state.strokeWidth ?? 2;
        this.opacity = state.opacity ?? 1;
        this.fillColour = state.fillColor ?? "transparent";
    }
}


export class Rectangle extends Shape {
    private width: number;
    private height: number;

    constructor(x: number, y: number, width: number, height: number){
        super(x, y);
        this.width = width;
        this.height = height;
    }

    draw(ctx: CanvasRenderingContext2D): void{
        ctx.save();
        ctx.beginPath();

        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.strokeWidth;
        ctx.lineCap = this.strokeStyle;
        ctx.fillStyle = this.fillColour;
        ctx.globalAlpha = this.opacity;
        
        /*  */
        ctx.rect(this.startX, this.startY, this.width, this.height);
        ctx.fill();
        ctx.stroke();
    }
    
    isPointInside(x: number, y: number): boolean{
        return ((x >= this.startX) && (x <= this.startX + this.width)) 
            && ((y >= this.startY) && y <= this.startY + this.height)
    }

    setSize (width: number, height: number): void{
        this.width = width;
        this.height = height;
    }
}

export class Circle extends Shape {
    private radius: number;
    private centerX: number;
    private centerY: number;
    private endX: number;
    private endY: number;
    // private startAngle: number;
    // private endAngle: number;
    private clockwise: boolean;
    
    constructor (x: number, y: number, width: number, height: number) {
        super(x, y);

        this.endX = width + x;
        this.endY = height + y;

        /* center of the diameter 
            ->          (x1 + x2) / 2, (y1 + y2) / 2
            centerX = (this.endX + x) / 2            -> width + x + x = width + 2x
            centerY = (this.endY + y) / 2            -> height + y + y = height + 2y
        */
        this.centerX = (2*x + width) / 2;
        this.centerY = (2*y + height) / 2;

        /* redius will be the mid point of the diameter */

        /* 
            dx = this.endX - x          -> width + x - x = width
            dy = this.endY - y          -> height + y - y = height
        */
        const distance = Math.sqrt(width*width + height*height);    /* length of the diameter */
        this.radius = distance / 2;

        /* calculate startAngle and endAngle
            this.startAngle = 0;
            this.endAngle = 0;
        */
        this.clockwise = true;

        /* set slope of the circle

            const dy = (height + y - y);
            const dx = (width + x - x);

            const m = dy/dx;
        */
    }

    draw (ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.beginPath();

        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.strokeWidth;
        ctx.lineCap = this.strokeStyle;
        ctx.fillStyle = this.fillColour;
        ctx.globalAlpha = this.opacity;

        /* draw circle with given radius */
        ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    isPointInside(x: number, y: number): boolean {

        /* now calculate the distance btw point and radius of the circle */
        const distance = Math.sqrt(Math.pow(x - this.centerX, 2) + Math.pow(y - this.centerY, 2));

        return distance <= this.radius;
    }

    setRadius(width: number, height: number): void {
        this.radius = Math.sqrt(width*width + height*height) / 2;

        this.centerX = (2*this.startX + width) / 2;
        this.centerY = (2*this.startY + height) / 2;
    }

}