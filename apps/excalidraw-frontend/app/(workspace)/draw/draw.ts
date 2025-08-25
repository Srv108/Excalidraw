import { getExistingData } from "./data";
import { Arrow, Circle, Diamond, Line, Rectangle, Text } from "./shapes";

export type AnyShape =  Rectangle | Circle | Line | Diamond | Arrow;

export type ShapeConstructor = 
            | (new (x: number, y: number, width: number, height: number, fillColor: string) => AnyShape) 
            | (new (x: number, y: number, text?: string, fontSize?: number) => Text)

/* map shape constructor */
export const ShapeRegistry: Record< string, ShapeConstructor> = {
    rect: Rectangle,
    circle: Circle,
    line: Line,
    diamond: Diamond,
    arrow: Arrow,
    text: Text
}

type ExistingShape = {
    type: string,
    shape: AnyShape | Text
}

export class Draw {
    private canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public ExistingData: ExistingShape[];
    private roomId: number | null;
    private clicked: boolean;
    public selectedShape: string;
    private startX: number = 0;
    private startY: number = 0;
    private token: string | null;

    socket: WebSocket;


    constructor (canvas: HTMLCanvasElement, selectedShape: string, previousData: ExistingShape[], socket: WebSocket, roomId: number, token: string) {
        this.selectedShape = selectedShape;
        this.ExistingData = previousData;
        this.roomId = roomId ?? null;
        this.socket = socket;
        this.token = token;

        console.log(token);
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
        this.redrawCanvas();

        this.clicked = false;
        this.init();
        this.initMouseHandler();    /* initialise mouse events */
    }

    async init() {
        this.ExistingData = await getExistingData(this.roomId, this.token);
        this.clearCanvas();
        this.redrawCanvas();
    }

    initMouseHandler (): void {
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

        let shape: AnyShape | Text;

        if(this.selectedShape === 'text'){
            const text = prompt("Enter text") ?? "Saurabh Bharti";
            shape = new (ShapeClass as typeof Text)(this.startX, this.startY, text, 20, "red");
        } else 
            shape = new (ShapeClass as typeof any) (this.startX, this.startY, width, height);

        /* call the draw method of that object */
        shape.draw(this.ctx);
        this.ExistingData.push({
            type: this.selectedShape,
            shape
        });

        /* 
            send shape data to the socket 
        */
        this.socket.send(JSON.stringify({
            type: 'chat',
            message: JSON.stringify({
                type: this.selectedShape,
                shape
            }),
            roomId: this.roomId
        }))

    }

    mouseMoveHandler = (e: MouseEvent) => {
        if(this.clicked){
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;

            this.clearCanvas();
            this.redrawCanvas();

            /* select the current shape constructor */
            const ShapeClass = ShapeRegistry[this.selectedShape];
            if(!ShapeClass) return;

            /* create an instance of the current shape */
            const previewShape = new ShapeClass(this.startX, this.startY, width, height);
            previewShape.draw(this.ctx);    /* draw the shapes of the instances */

            /* send the live drawing to the socket also 
                todos ( send live drawing state to socket)
            */
        }
    }

    clearCanvas(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Only use for full reset if needed
    }

    redrawCanvas (): void {
        /* clear the canvas */
        this.clearCanvas();

        /* now draw the existing shapes */
        this.ExistingData.forEach(data => {
            const ShapeClass =  ShapeRegistry[data.type];

            if(!ShapeClass){
                console.warn(`Shape "${data.type}" is not registered`);
                return;
            }

            // @ts-ignore
            let shape: AnyShape | Text;

            if(data.type === 'text'){
                // @ts-ignore
                shape = new (ShapeClass as typeof Text)(data.shape.startX, data.shape.startY, data.shape.text, data.shape.fontSize, data.shape.fillColor);
            } else 
                // @ts-ignore
                shape = new ShapeClass(data.shape.startX, data.shape.startY, data.shape.width, data.shape.height);

            shape.draw(this.ctx);
        });

    }

    destroyMouseHandler (): void {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    }

}