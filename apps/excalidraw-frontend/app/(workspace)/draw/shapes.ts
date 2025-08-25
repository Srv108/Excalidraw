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
    private width: number;
    private height: number;
    // private startAngle: number;
    // private endAngle: number;
    private clockwise: boolean;
    
    constructor (x: number, y: number, width: number, height: number) {
        super(x, y);

        this.width = width;
        this.height = height;

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

// export class Oval extends Shape {

// }

export class Line extends Shape{
    private endX: number;
    private endY: number;
    private width: number;
    private height: number;

    constructor (x: number, y: number, width: number, height: number){
        super(x, y);

        this.width = width;
        this.height = height;

        /* calculate endx and endy */
        this.endX = width + x;
        this.endY = height + y;
    }

    draw (ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.beginPath();

        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.strokeWidth;
        ctx.lineCap = this.strokeStyle;
        ctx.fillStyle = this.fillColour;
        ctx.globalAlpha = this.opacity;


        /* draw line */
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX, this.endY);
        ctx.stroke();
    }

    /* point lie on the line  */
    isPointInside(x: number, y: number): boolean {

        /* calculate distance and verify is it on the line or not 

            1.      this.startX = x1, this.endX = x2            x2 -> x1 + this.width
            2.      this.startY = y1, this.endY = y2            y2 -> y1 + this.height
            3.      x , y                                       
        */

        /* x1 - x, y1 - y */
        const dis1 = Math.sqrt(Math.pow(this.startX - x, 2) + Math.pow(this.startY - y, 2));
        /* x2 - x, y2 - y */
        const dis2 = Math.sqrt(Math.pow(this.endX - x, 2) + Math.pow(this.endY - y, 2));

        /* length of the line x1 - x2, y1 - y2      -> this.width , this.height */
        const dis = Math.sqrt((this.width * this.width) + (this.height * this.height));

        return dis === dis1 + dis2;
    }

    setSize (width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}

export class Diamond extends Shape {
    private width: number;
    private height: number;

    constructor(x: number, y: number, width: number, height: number){
        super(x, y);

        this.width = width;
        this.height = height;
    }

    draw (ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.beginPath();

        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.strokeWidth;
        ctx.lineCap = this.strokeStyle;
        ctx.fillStyle = this.fillColour;
        ctx.globalAlpha = this.opacity;

        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;
        ctx.moveTo(this.startX, this.startY - halfHeight);
        ctx.lineTo(this.startX + halfWidth, this.startY);
        ctx.lineTo(this.startX, this.startY + halfHeight);
        ctx.lineTo(this.startX - halfWidth, this.startY);

        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    isPointInside(x: number, y: number): boolean {
        return false;
    }

    setSize(width: number, height: number) {

    }
}

export class Arrow extends Shape {
    private endX: number;
    private endY: number;
    private width: number;
    private height: number;
    private headLen: number = 10;

    constructor (x: number, y: number, width: number, height: number){
        super(x, y);

        this.width = width;
        this.height = height;

        /* calculate endx and endy */
        this.endX = width + x;
        this.endY = height + y;
    }

    draw (ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.beginPath();

        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.strokeWidth;
        ctx.lineCap = this.strokeStyle;
        ctx.fillStyle = this.fillColour;
        ctx.globalAlpha = this.opacity;


        /* draw line */
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX, this.endY);
        ctx.stroke()

        /* draw the arrow head of the line */

        /* const slope = (this.endY - this.startY) / (this.endX - this.startX); 
            atan2   -> inverse tan()
        */
        const angle = Math.atan2(this.endY - this.startY, this.endX - this.startX)

        /* coordinates of the both arrow head */
        const newX1 = this.endX - (this.headLen) * Math.cos(angle - Math.PI / 6);
        const newY1 = this.endY - (this.headLen) * Math.sin(angle - Math.PI / 6);

        const newX2 = this.endX - (this.headLen) * Math.cos(angle + Math.PI / 6);
        const newY2 = this.endY - (this.headLen) * Math.sin(angle + Math.PI / 6);

        ctx.beginPath();
        ctx.moveTo(this.endX, this.endY);
        ctx.lineTo(newX1, newY1);
        ctx.stroke();
        // ctx.beginPath();
        ctx.moveTo(this.endX, this.endY);
        ctx.lineTo(newX2, newY2);
        ctx.stroke();
        ctx.fill();
    }

    /* point lie on the line  */
    isPointInside(x: number, y: number): boolean {

        /* calculate distance and verify is it on the line or not 

            1.      this.startX = x1, this.endX = x2            x2 -> x1 + this.width
            2.      this.startY = y1, this.endY = y2            y2 -> y1 + this.height
            3.      x , y                                       
        */

        /* x1 - x, y1 - y */
        const dis1 = Math.sqrt(Math.pow(this.startX - x, 2) + Math.pow(this.startY - y, 2));
        /* x2 - x, y2 - y */
        const dis2 = Math.sqrt(Math.pow(this.endX - x, 2) + Math.pow(this.endY - y, 2));

        /* length of the line x1 - x2, y1 - y2      -> this.width , this.height */
        const dis = Math.sqrt((this.width * this.width) + (this.height * this.height));

        return dis === dis1 + dis2;
    }

    setSize (width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}

export class Text extends Shape {
    private text: string;
    private fontSize: number;
    private fontFamily: string = "Arial";

    constructor(x: number, y: number, text?: string, fontSize?: number, fillColor?: string) {
        super(x, y);

        this.text = text ?? "";
        this.fontSize = fontSize ?? 20;
        

        this.setStrokeColor("black");
        this.setStrokeWidth(2);
        this.setOpacity(1.0);
        this.setShapeColor(fillColor ?? "red");
    }

    draw (ctx: CanvasRenderingContext2D) {
        ctx.save();

        ctx.strokeStyle = this.strokeColor || "black";   
        ctx.lineWidth = this.strokeWidth || 2;          
        ctx.lineCap = "round";                           
        ctx.fillStyle = "red";                           
        ctx.globalAlpha = this.opacity ?? 1.0;           
        ctx.font = `${this.fontSize || 20}px Arial`;     

        ctx.fillText(this.text, this.startX, this.startY);
        ctx.restore();

    }

    /* implement the logic */
    isPointInside(x: number, y: number): boolean {
        return false;
    }

    setText(text: string): void {
        this.text = text;
    }

    setFontSize(size: number): void {
        this.fontSize = size;
    }

    setFontFamily(family: string): void {
        this.fontFamily = family;
    }
}