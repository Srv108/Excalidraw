import { Circle, Rectangle } from "./shapes";

type AnyShape =  Rectangle | Circle;

type ShapeConstructor = new (x: number, y: number, width: number, height: number) => AnyShape;

/* map shape constructor */
const ShapeRegistry: Record< string, ShapeConstructor> = {
    rect: Rectangle,
    circle: Circle,
}

export class Draw {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private ExistingData: AnyShape[];
    private roomId: string;
    private clicked: boolean;
    private selectedShape: string;
    private startX: number = 0;
    private startY: number = 0;
    
    socket: WebSocket;

    constructor (canvas: HTMLCanvasElement, selectedShape: string, previousData: AnyShape[], socket: WebSocket, roomId: string) {
        this.selectedShape = selectedShape;
        this.ExistingData = previousData;
        this.roomId = roomId;
        this.socket = socket;

        if(!canvas) {
            throw new Error("canvas element is required") ;
        }

        this.canvas = canvas;

        const context = this.canvas.getContext("2d");
        if(!context) {
            throw new Error ("could not get 2D context from canvas");
        }

        this.ctx = context;

        const dpr = window.devicePixelRatio || 1;   /* device pixel ratio */

        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        
        this.ctx.scale(dpr, dpr);
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.clicked = false;
        this.initMouseHandler();    /* initialise mouse events */
    }

    initMouseHandler () {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
        this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    }

    mouseDownHandler = (e: MouseEvent) => {
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
    }

    mouseUpHandler = (e: MouseEvent) => {
        this.clicked = false;

        /* height and width of the shape */
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;

        /* initialise the object of the selected shape */
        const ShapeClass = ShapeRegistry[this.selectedShape];
        
        if(!ShapeClass){
            console.warn(`Shape "${this.selectedShape}" is not registered`);
            return;
        }

        const shape = new ShapeClass(this.startX, this.startY, width, height);

        /* call the draw method of that object */
        shape.draw(this.ctx);
        this.ExistingData.push(shape);

        /* 
            send shape data to the socket 
        */

    }

    mouseMoveHandler = (e: MouseEvent) => {
        if(this.clicked){
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
        }
    }


    destroyMouseHandler () {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    }

}