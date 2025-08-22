
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
        this.strokeColor = "" /* black */
        this.strokeStyle = 'round';
        this.opacity = 2;
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
    // private startAngle: number;
    // private endAngle: number;
    private clockwise: boolean;
    
    constructor (x: number, y: number, width: number, height: number) {
        super(x, y);

        /* logic to calculate radius */
        const radius = Math.max(width, height) / 2;

        this.radius = radius;
        // this.startAngle = 0;
        // this.endAngle = 0;
        this.clockwise = true;
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
        ctx.arc(this.startX, this.startY, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    isPointInside(x: number, y: number): boolean {
        const centerX = x + this.radius;
        const centerY = y + this.radius;

        /* now calculate the distance btw point and radius of the circle */
        const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

        return distance <= this.radius;
    }

    setRadius (r: number): void {
        this.radius = r;
    }
}