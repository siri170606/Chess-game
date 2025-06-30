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



for (let i=0;i<8;i++){
pieces.push({image:"/images/pawn-b.svg",x:i,y:6});
}

for (let i=0;i<8;i++){
pieces.push({image:"/images/pawn-w.svg",x:i,y:1});
}

pieces.push({image:"/images/rook-b.svg",x:0,y:7});
pieces.push({image:"/images/rook-b.svg",x:7,y:7});
pieces.push({image:"/images/rknight-b.svg",x:1,y:7});
pieces.push({image:"/images/rknight-b.svg",x:6,y:7});
pieces.push({image:"/images/bishop-b.svg",x:2,y:7});
pieces.push({image:"/images/bishop-b.svg",x:5,y:7});
pieces.push({image:"/images/queen-b.svg",x:3,y:7});
pieces.push({image:"/images/king-b.svg",x:4,y:7});

pieces.push({image:"/images/rook-w.svg",x:0,y:0});
pieces.push({image:"/images/rook-w.svg",x:7,y:0});
pieces.push({image:"/images/rknight-w.svg",x:1,y:0});
pieces.push({image:"/images/rknight-w.svg",x:6,y:0});
pieces.push({image:"/images/bishop-w.svg",x:2,y:0});
pieces.push({image:"/images/bishop-w.svg",x:5,y:0});
pieces.push({image:"/images/queen-w.svg",x:3,y:0});
pieces.push({image:"/images/king-w.svg",x:4,y:0});

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
       board.push(<Tile image={image} number={number} />);
       
    }
}
    return <div id="chessboard">{board}
        
    </div>
}
