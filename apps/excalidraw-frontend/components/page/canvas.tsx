'use client'

import { useEffect, useRef, useState } from "react"
import Navbar from "./Navbar"
import { Rectangle, Circle } from "../draw/shapes";


export default function Canvas () {

    const canvasRef = useRef<HTMLCanvasElement>(null);


    useEffect(() => {
        const canvas = canvasRef.current;
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        if(!ctx) return;

        const dpr = window.devicePixelRatio || 1;   /* device pixel ratio */

        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const shape = new Circle(250, 250, 150, 300);
        shape.setStrokeColor("#000");
        
        shape.draw(ctx);

        /* draw circle */

    }, []);

    return <>
        <div>
            <canvas
                ref={canvasRef}
                className="w-screen h-screen bg-white text-2xl font-bold"
            />
        </div>
    </>
}