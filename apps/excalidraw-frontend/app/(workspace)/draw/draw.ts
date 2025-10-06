import { getExistingData, deleteShape } from "./data";
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
    shape: AnyShape | Text,
    chatId?: number  // Optional for shapes not yet saved to DB
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
    private textInput: HTMLInputElement | null = null;
    private isEditingText: boolean = false;

    socket: WebSocket;


    constructor (canvas: HTMLCanvasElement, selectedShape: string, previousData: ExistingShape[], socket: WebSocket, roomId: number, token: string) {
        this.selectedShape = selectedShape;
        this.ExistingData = previousData;
        this.roomId = roomId ?? null;
        this.socket = socket;
        this.token = token;

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
        this.initMouseHandler();    /* initialise mouse events */
    }

    async init() {
        if (this.roomId === null || this.token === null) {
            console.warn("Room ID is null and token , cannot fetch existing data");
            return;
        }
        this.ExistingData = await getExistingData(this.roomId!, this.token);
        this.clearCanvas();
        this.redrawCanvas();
    }

    initMouseHandler (): void {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);
        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
        this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    }

    mouseDownHandler = (e: MouseEvent) => {
        // Don't handle mouse events if currently editing text
        if (this.isEditingText) {
            return;
        }

        // If text mode, create text input instead of drawing
        if (this.selectedShape === 'text') {
            e.preventDefault();
            this.createTextInput(e.clientX, e.clientY);
            return;
        }
        
        this.clicked = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
    }

    mouseUpHandler = (e: MouseEvent) => {
        this.clicked = false;

        /* height and width of the shape */
        const width = e.clientX - this.startX;
        const height = e.clientY - this.startY;

        if(this.selectedShape === 'eraser' || this.selectedShape === 'text') return;

        /* initialise the object of the selected shape */
        const ShapeClass = ShapeRegistry[this.selectedShape];
        
        if(!ShapeClass){
            console.warn(`Shape "${this.selectedShape}" is not registered`);
            return;
        }

        const shape = new (ShapeClass as new (x: number, y: number, width: number, height: number) => AnyShape)(
            this.startX,
            this.startY,
            width,
            height
        );
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
        // Don't handle mouse events if currently editing text
        if (this.isEditingText) {
            return;
        }

        if(this.clicked && this.selectedShape === 'eraser'){
            const x = e.clientX;
            const y = e.clientY;

            // Ensure all shapes are class instances before checking
            this.ExistingData.forEach(data => {
                if (typeof data.shape.isPointSatisfied !== 'function') {
                    this.reconstructShape(data);
                }
            });

            // Find shapes that should be deleted
            const shapesToDelete = this.ExistingData.filter(({ shape }) => {
                return shape.isPointSatisfied && shape.isPointSatisfied(x, y);
            });

            // Delete shapes from database and broadcast via WebSocket
            shapesToDelete.forEach(async (shapeData) => {
                if (shapeData.chatId && this.token) {
                    try {
                        // Delete from database
                        await deleteShape(shapeData.chatId, this.token);
                        
                        // Broadcast deletion via WebSocket
                        this.socket.send(JSON.stringify({
                            type: 'delete_shape',
                            chatId: shapeData.chatId,
                            roomId: this.roomId
                        }));
                    } catch (error) {
                        console.error('Failed to delete shape:', error);
                    }
                }
            });

            // Remove from local state
            this.ExistingData = this.ExistingData.filter(({ shape }) => {
                return !shape.isPointSatisfied || !shape.isPointSatisfied(x, y);
            });

            this.clearCanvas();
            this.redrawCanvas();
        }
        if(this.clicked){
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;

            this.clearCanvas();
            this.redrawCanvas();

            /* select the current shape constructor */
            const ShapeClass = ShapeRegistry[this.selectedShape];
            if(!ShapeClass) return;

            /* create an instance of the current shape */
            const previewShape = new (ShapeClass as new (x: number, y: number, width: number, height: number) => AnyShape)(
                this.startX,
                this.startY,
                width,
                height
            );
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
            // If shape is already a class instance, just draw it
            if (typeof data.shape.draw === 'function') {
                data.shape.draw(this.ctx);
                return;
            }

            // Otherwise, reconstruct the shape from plain object
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

            // Replace the plain object with the class instance
            data.shape = shape;
            shape.draw(this.ctx);
        });

    }

    destroyMouseHandler (): void {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
        // Clean up text input if exists
        this.removeTextInput();
    }

    /* Helper method to reconstruct a shape from plain object to class instance */
    private reconstructShape(data: ExistingShape): void {
        const ShapeClass = ShapeRegistry[data.type];
        
        if (!ShapeClass) {
            console.warn(`Shape "${data.type}" is not registered`);
            return;
        }

        // Cast to any to access plain object properties
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const plainShape = data.shape as any;
        
        // @ts-ignore
        let shape: AnyShape | Text;

        if (data.type === 'text') {
            // @ts-ignore
            shape = new (ShapeClass as typeof Text)(
                plainShape.startX, 
                plainShape.startY, 
                plainShape.text, 
                plainShape.fontSize, 
                plainShape.fillColor
            );
        } else {
            // @ts-ignore
            shape = new ShapeClass(
                plainShape.startX, 
                plainShape.startY, 
                plainShape.width, 
                plainShape.height
            );
        }

        // Replace the plain object with the class instance
        data.shape = shape;
    }

    /* Method to handle shape deletion from external sources (other users) */
    handleShapeDeletion(chatId: number): void {
        this.ExistingData = this.ExistingData.filter(
            (shapeData) => shapeData.chatId !== chatId
        );
        this.clearCanvas();
        this.redrawCanvas();
    }

    /* Create inline text input at click position */
    private createTextInput(x: number, y: number): void {
        // Remove existing text input if any
        if (this.textInput) {
            this.removeTextInput();
        }

        this.isEditingText = true;

        // Create input element
        this.textInput = document.createElement('input');
        this.textInput.type = 'text';
        this.textInput.style.position = 'absolute';
        this.textInput.style.left = `${x}px`;
        this.textInput.style.top = `${y}px`;
        this.textInput.style.fontSize = '20px';
        this.textInput.style.fontFamily = 'Arial';
        this.textInput.style.border = 'none';
        this.textInput.style.outline = 'none';
        this.textInput.style.padding = '0';
        this.textInput.style.margin = '0';
        this.textInput.style.backgroundColor = 'transparent';
        this.textInput.style.color = 'black';
        this.textInput.style.zIndex = '1000';
        // Calculate dynamic width from click point to canvas edge
        const canvasRect = this.canvas.getBoundingClientRect();
        const remainingWidth = canvasRect.width - x;
        this.textInput.style.width = `${remainingWidth}px`; // Dynamic width to canvas edge
        this.textInput.style.caretColor = 'black';
        this.textInput.style.pointerEvents = 'auto';
        this.textInput.style.height = 'auto'; // Auto height for natural text flow
        this.textInput.style.lineHeight = '24px';
        this.textInput.placeholder = '';

        // Add to canvas parent
        this.canvas.parentElement?.appendChild(this.textInput);
        
        // Focus with a small delay to prevent immediate blur
        setTimeout(() => {
            if (this.textInput) {
                this.textInput.focus();
            }
        }, 50);

        // Save text on Enter key
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.saveText(x, y);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.removeTextInput();
            }
        };
        this.textInput.addEventListener('keydown', handleKeyDown);

        // Save text on blur (clicking outside) - with longer delay
        const handleBlur = () => {
            // Longer delay to ensure we don't remove input prematurely
            setTimeout(() => {
                // Check if input still exists and is not focused
                if (this.textInput && document.activeElement !== this.textInput) {
                    if (this.textInput.value.trim()) {
                        this.saveText(x, y);
                    } else {
                        this.removeTextInput();
                    }
                }
            }, 200);
        };
        this.textInput.addEventListener('blur', handleBlur);
    }

    /* Save the text to canvas */
    private saveText(x: number, y: number): void {
        if (!this.textInput) return;

        const textValue = this.textInput.value.trim();
        if (!textValue) {
            this.removeTextInput();
            return;
        }

        // Create Text shape
        const ShapeClass = ShapeRegistry['text'];
        if (!ShapeClass) {
            console.warn('Text shape not registered');
            this.removeTextInput();
            return;
        }

        // Adjust y position to account for baseline
        // Input box top aligns with y, but canvas fillText uses baseline
        // Add fontSize * 0.8 to approximate baseline position
        const baselineY = y + 20 * 0.8;

        const textShape = new (ShapeClass as typeof Text)(x, baselineY, textValue, 20, 'black');
        
        // Draw the text
        textShape.draw(this.ctx);
        
        // Add to existing data
        this.ExistingData.push({
            type: 'text',
            shape: textShape
        });

        // Send to socket
        this.socket.send(JSON.stringify({
            type: 'chat',
            message: JSON.stringify({
                type: 'text',
                shape: textShape
            }),
            roomId: this.roomId
        }));

        // Remove input
        this.removeTextInput();
    }

    /* Remove text input element */
    private removeTextInput(): void {
        if (this.textInput) {
            this.textInput.remove();
            this.textInput = null;
            this.isEditingText = false;
        }
    }

}