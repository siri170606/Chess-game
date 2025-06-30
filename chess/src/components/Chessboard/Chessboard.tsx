import React from 'react'
import './Chessboard.css';
import Tile from "../Tile/tile"; 

const verticalaxis=[1,2,3,4,5,6,7,8]
const horizontalaxis=["a","b","c","d","e","f","g","h"];

interface Piece{
    image:string
    x:number
    y:number
}
const pieces:Piece[]=[];

for(let p=0; p < 2; p++){
    const type = (p === 0) ? "b" : "w";
    const y= (p === 0) ? 7 : 0; 
    
pieces.push({image:`/images/rook-${type}.svg`,x:0,y});
pieces.push({image:`/images/rook-${type}.svg`,x:7,y});
pieces.push({image:`/images/rknight-${type}.svg`,x:1,y});
pieces.push({image:`/images/rknight-${type}.svg`,x:6,y});
pieces.push({image:`/images/bishop-${type}.svg`,x:2,y});
pieces.push({image:`/images/bishop-${type}.svg`,x:5,y});
pieces.push({image:`/images/queen-${type}.svg`,x:3,y});
pieces.push({image:`/images/king-${type}.svg`,x:4,y});

}

for (let i=0;i<8;i++){
pieces.push({image:"/images/pawn-b.svg",x:i,y:6});
}

for (let i=0;i<8;i++){
pieces.push({image:"/images/pawn-w.svg",x:i,y:1});
}

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
    if(activePiece){
        const x = e.clientX - 50 ;
        const y = e.clientY - 50;
        activePiece.style.position = "absolute";
        activePiece.style.left = `${x}px`;
        activePiece.style.top = `${y}px`;
    }

}

function dropPiece(e: React.MouseEvent){
    if(activePiece) {
        activePiece =null;
    }
}
export default function Chessboard(){
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
        id="chessboard">
        {board}
        
    </div>
    );
}
