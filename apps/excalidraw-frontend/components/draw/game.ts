// Abstract base class for all shapes
type DrawingState = {
    strokeColor: string;
    strokeWidth: number;
    strokeStyle: CanvasLineCap;
    fillColor: string;
    opacity: number;
};

abstract class Shape {
    protected startX: number;
    protected startY: number;
    protected strokeColor: string;
    protected strokeStyle: CanvasLineCap;
    protected strokeWidth: number;
    protected opacity: number;
    protected isSelected: boolean;
    protected fillColor: string;

    constructor(x: number, y: number, DrawingState?: Partial<DrawingState> ) {
        this.startX = x;
        this.startY = y;
        this.strokeColor = DrawingState?.strokeColor ?? '#000000';
        this.strokeStyle = DrawingState?.strokeStyle ?? 'round';
        this.strokeWidth = DrawingState?.strokeWidth ?? 2;
        this.opacity = DrawingState?.opacity ?? 1;
        this.fillColor =  DrawingState?.fillColor ?? 'transparent';
        this.isSelected = false;
    }

    // Abstract method to be implemented by subclasses
    abstract draw(ctx: CanvasRenderingContext2D): void;

    // Common methods for all shapes
    setStrokeColor(color: string): void {
        this.strokeColor = color;
    }

    setFillColor(color: string): void {
        this.fillColor = color;
    }

    setStrokeWidth(width: number): void {
        this.strokeWidth = width;
    }

    setOpacity(opacity: number): void {
        this.opacity = Math.max(0, Math.min(1, opacity));
    }

    setSelected(selected: boolean): void {
        this.isSelected = selected;
    }

    // Method to check if point is within shape (to be overridden by subclasses)
    isPointInside(x: number, y: number): boolean {
        return false;
    }

    // Method to move shape
    moveTo(x: number, y: number): void {
        this.startX = x;
        this.startY = y;
    }

    getState (): DrawingState{
        return {
            strokeColor: this.strokeColor,
            strokeStyle: this.strokeStyle,
            strokeWidth: this.strokeWidth,
            opacity: this.opacity,
            fillColor: this.fillColor
        }
    }
}

export class Rectangle extends Shape {
    private width: number;
    private height: number;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y);
        this.width = width;
        this.height = height;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.strokeWidth;
        ctx.lineCap = this.strokeStyle;
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.fillColor;

        ctx.rect(this.startX, this.startY, this.width, this.height);
        ctx.fill();
        ctx.stroke();

        // Draw selection highlight if selected
        if (this.isSelected) {
            ctx.strokeStyle = '#00f';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.startX - 2, this.startY - 2, this.width + 4, this.height + 4);
        }
        ctx.restore();
    }

    isPointInside(x: number, y: number): boolean {
        return x >= this.startX && x <= this.startX + this.width &&
               y >= this.startY && y <= this.startY + this.height;
    }

    setSize(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }
}

export class Circle extends Shape {
    private radius: number;

    constructor(x: number, y: number, radius: number) {
        super(x, y);
        this.radius = radius;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.strokeWidth;
        ctx.lineCap = this.strokeStyle;
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.fillColor;

        ctx.arc(this.startX, this.startY, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        if (this.isSelected) {
            ctx.strokeStyle = '#00f';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.startX, this.startY, this.radius + 2, 0, 2 * Math.PI);
            ctx.stroke();
        }
        ctx.restore();
    }

    isPointInside(x: number, y: number): boolean {
        const dx = x - this.startX;
        const dy = y - this.startY;
        return Math.sqrt(dx * dx + dy * dy) <= this.radius;
    }

    setRadius(radius: number): void {
        this.radius = radius;
    }
}

export class Line extends Shape {
    private endX: number;
    private endY: number;

    constructor(x1: number, y1: number, x2: number, y2: number) {
        super(x1, y1);
        this.endX = x2;
        this.endY = y2;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.strokeWidth;
        ctx.lineCap = this.strokeStyle;
        ctx.globalAlpha = this.opacity;

        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX, this.endY);
        ctx.stroke();

        if (this.isSelected) {
            ctx.strokeStyle = '#00f';
            ctx.lineWidth = this.strokeWidth + 2;
            ctx.beginPath();
            ctx.moveTo(this.startX, this.startY);
            ctx.lineTo(this.endX, this.endY);
            ctx.stroke();
        }
        ctx.restore();
    }

    isPointInside(x: number, y: number): boolean {
        // Check if point is close to the line (within 5 pixels)
        const dx = this.endX - this.startX;
        const dy = this.endY - this.startY;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        if (length === 0) return false;

        const t = ((x - this.startX) * dx + (y - this.startY) * dy) / (length * length);
        if (t < 0 || t > 1) return false;

        const closestX = this.startX + t * dx;
        const closestY = this.startY + t * dy;
        const distance = Math.sqrt((x - closestX) ** 2 + (y - closestY) ** 2);
        return distance <= 5;
    }

    setEndPoint(x: number, y: number): void {
        this.endX = x;
        this.endY = y;
    }
}

export class Diamond extends Shape {
    private width: number;
    private height: number;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y);
        this.width = width;
        this.height = height;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.strokeWidth;
        ctx.lineCap = this.strokeStyle;
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.fillColor;

        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;
        ctx.moveTo(this.startX, this.startY - halfHeight);
        ctx.lineTo(this.startX + halfWidth, this.startY);
        ctx.lineTo(this.startX, this.startY + halfHeight);
        ctx.lineTo(this.startX - halfWidth, this.startY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        if (this.isSelected) {
            ctx.strokeStyle = '#00f';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.startX, this.startY - halfHeight - 2);
            ctx.lineTo(this.startX + halfWidth + 2, this.startY);
            ctx.lineTo(this.startX, this.startY + halfHeight + 2);
            ctx.lineTo(this.startX - halfWidth - 2, this.startY);
            ctx.closePath();
            ctx.stroke();
        }
        ctx.restore();
    }

    isPointInside(x: number, y: number): boolean {
        // Check if point is inside diamond using point-in-polygon test
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;
        const points = [
            {x: this.startX, y: this.startY - halfHeight},
            {x: this.startX + halfWidth, y: this.startY},
            {x: this.startX, y: this.startY + halfHeight},
            {x: this.startX - halfWidth, y: this.startY}
        ];

        let inside = false;
        for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
            if (((points[i].y > y) !== (points[j].y > y)) &&
                (x < (points[j].x - points[i].x) * (y - points[i].y) / 
                (points[j].y - points[i].y) + points[i].x)) {
                inside = !inside;
            }
        }
        return inside;
    }

    setSize(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }
}

export class Arrow extends Shape {
    private endX: number;
    private endY: number;
    private arrowSize: number;

    constructor(x1: number, y1: number, x2: number, y2: number) {
        super(x1, y1);
        this.endX = x2;
        this.endY = y2;
        this.arrowSize = 10;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = this.strokeColor;
        ctx.lineWidth = this.strokeWidth;
        ctx.lineCap = this.strokeStyle;
        ctx.globalAlpha = this.opacity;

        // Draw main line
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX, this.endY);

        // Calculate arrowhead
        const angle = Math.atan2(this.endY - this.startY, this.endX - this.startX);
        ctx.lineTo(
            this.endX - this.arrowSize * Math.cos(angle - Math.PI / 6),
            this.endY - this.arrowSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(this.endX, this.endY);
        ctx.lineTo(
            this.endX - this.arrowSize * Math.cos(angle + Math.PI / 6),
            this.endY - this.arrowSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();

        if (this.isSelected) {
            ctx.strokeStyle = '#00f';
            ctx.lineWidth = this.strokeWidth + 2;
            ctx.beginPath();
            ctx.moveTo(this.startX, this.startY);
            ctx.lineTo(this.endX, this.endY);
            ctx.stroke();
        }
        ctx.restore();
    }

    isPointInside(x: number, y: number): boolean {
        // Similar to Line's isPointInside
        const dx = this.endX - this.startX;
        const dy = this.endY - this.startY;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        if (length === 0) return false;

        const t = ((x - this.startX) * dx + (y - this.startY) * dy) / (length * length);
        if (t < 0 || t > 1) return false;

        const closestX = this.startX + t * dx;
        const closestY = this.startY + t * dy;
        const distance = Math.sqrt((x - closestX) ** 2 + (y - closestY) ** 2);
        return distance <= 5;
    }

    setEndPoint(x: number, y: number): void {
        this.endX = x;
        this.endY = y;
    }
}

export class Text extends Shape {
    private text: string;
    private fontSize: number;
    private fontFamily: string;

    constructor(x: number, y: number, text: string) {
        super(x, y);
        this.text = text;
        this.fontSize = 16;
        this.fontFamily = 'Arial';
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.strokeColor;
        ctx.globalAlpha = this.opacity;
        ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        
        ctx.fillText(this.text, this.startX, this.startY);

        if (this.isSelected) {
            const metrics = ctx.measureText(this.text);
            const height = this.fontSize * 1.2;
            ctx.strokeStyle = '#00f';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                this.startX - 2,
                this.startY - height + 2,
                metrics.width + 4,
                height
            );
        }
        ctx.restore();
    }

    isPointInside(x: number, y: number): boolean {
        const ctx = document.createElement('canvas').getContext('2d')!;
        ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        const metrics = ctx.measureText(this.text);
        const height = this.fontSize * 1.2;
        return x >= this.startX &&
               x <= this.startX + metrics.width &&
               y >= this.startY - height &&
               y <= this.startY;
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