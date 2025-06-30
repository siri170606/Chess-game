import React, { useEffect } from 'react'
import './Chessboard.css';
import Tile from "../Tile/tile"; 
import { useRef, useState } from 'react';

const verticalaxis=[1,2,3,4,5,6,7,8]
const horizontalaxis=["a","b","c","d","e","f","g","h"];

interface Piece{
    image:string
    x:number
    y:number
}

const intialBoardState: Piece[] = [];

for(let p=0; p < 2; p++){
    const type = (p === 0) ? "b" : "w";
    const y= (p === 0) ? 7 : 0; 
        
    intialBoardState.push({image:`/images/rook-${type}.svg`,x:0,y});
    intialBoardState.push({image:`/images/rook-${type}.svg`,x:7,y});
    intialBoardState.push({image:`/images/rknight-${type}.svg`,x:1,y});
    intialBoardState.push({image:`/images/rknight-${type}.svg`,x:6,y});
    intialBoardState.push({image:`/images/bishop-${type}.svg`,x:2,y});
    intialBoardState.push({image:`/images/bishop-${type}.svg`,x:5,y});
    intialBoardState.push({image:`/images/queen-${type}.svg`,x:3,y});
    intialBoardState.push({image:`/images/king-${type}.svg`,x:4,y});

}

for (let i=0;i<8;i++){
    intialBoardState.push({image:"/images/pawn-b.svg",x:i,y:6});
}

for (let i=0;i<8;i++){
    intialBoardState.push({image:"/images/pawn-w.svg",x:i,y:1});
}


export default function Chessboard(){
const [pieces,setPieces] = useState<Piece[]>(intialBoardState);
const chessboardRef = useRef<HTMLDivElement | null>(null);


let activePiece: HTMLElement | null = null;

function grabPiece(e: React.MouseEvent){
    const element = e.target as HTMLElement;
    if(element.classList.contains("chess-piece")){
        console.log(e); 

        const x = e.clientX - 38.75 ;
        const y = e.clientY - 38.75;
        element.style.position = "absolute";
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;

        activePiece = element;
    }
    
}

function movePiece(e: React.MouseEvent){
    const chessboard = chessboardRef.current;
    if(activePiece && chessboard){
        const minX = chessboard.offsetLeft -15;
        const minY = chessboard.offsetTop -15;
        const maxX = chessboard.offsetLeft + chessboard.clientWidth -60;
        const maxY = chessboard.offsetTop +chessboard.clientHeight -70;
        const x = e.clientX - 50 ;
        const y = e.clientY - 50;
        activePiece.style.position = "absolute";
         if(x < minX) {
            activePiece.style.left = `${minX}px`;
         }
         else if(x> maxX) {
            activePiece.style.left = `${maxX}px`;
         } 
         else {
            activePiece.style.left = `${x}px`;
         }

         if(y < minY) {
            activePiece.style.top = `${minY}px`;
         }
         else if(y> maxY) {
            activePiece.style.top = `${maxY}px`;
         } 
         else {
            activePiece.style.top = `${y}px`;
         }


    }

}

function dropPiece(e: React.MouseEvent){
    if(activePiece) {
        pieces[0].x = 5;
        activePiece =null;
    }
}

let board=[];
for(let j=verticalaxis.length-1;j>=0;j--){
    for(let i=0;i<horizontalaxis.length;i++){
        const number=i+j+2;
        let image=undefined;
        pieces.forEach((p) =>{
            if(p.x===i && p.y===j){
            image=p.image;
           }
        })
       board.push(<Tile key={`&{j},${i}`} image={image} number={number} />);
       
    }
}
    return (
    <div 
        onMouseMove={(e)=> movePiece(e)} 
        onMouseDown={(e)=>grabPiece(e)} 
        onMouseUp={(e) => dropPiece(e)}
        id="chessboard"
        ref={chessboardRef}
    >
        {board}
        
    </div>
    );
}
