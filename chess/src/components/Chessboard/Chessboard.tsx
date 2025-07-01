import React, { useEffect, useRef, useState } from 'react';
import './Chessboard.css';
import Tile from '../Tile/tile';

const verticalaxis = [1, 2, 3, 4, 5, 6, 7, 8];
const horizontalaxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const SQUARES = 8;

interface Piece {
  image: string;
  x: number;
  y: number;
}

function fileFromCursor(x: number, boardLeft: number, squareSize: number) {
  return Math.floor((x - boardLeft) / squareSize);
}

function rankFromCursor(y: number, boardTop: number, squareSize: number) {
  return SQUARES - 1 - Math.floor((y - boardTop) / squareSize);
}

const intialBoardState: Piece[] = [];
for (let p = 0; p < 2; p++) {
  const type = p === 0 ? 'b' : 'w';
  const y = p === 0 ? 7 : 0;

  intialBoardState.push({ image: `/images/rook-${type}.svg`, x: 0, y });
  intialBoardState.push({ image: `/images/rook-${type}.svg`, x: 7, y });
  intialBoardState.push({ image: `/images/knight-${type}.svg`, x: 1, y });
  intialBoardState.push({ image: `/images/knight-${type}.svg`, x: 6, y });
  intialBoardState.push({ image: `/images/bishop-${type}.svg`, x: 2, y });
  intialBoardState.push({ image: `/images/bishop-${type}.svg`, x: 5, y });
  intialBoardState.push({ image: `/images/queen-${type}.svg`, x: 3, y });
  intialBoardState.push({ image: `/images/king-${type}.svg`, x: 4, y });
}
for (let i = 0; i < 8; i++) {
  intialBoardState.push({ image: '/images/pawn-b.svg', x: i, y: 6 });
  intialBoardState.push({ image: '/images/pawn-w.svg', x: i, y: 1 });
}

export default function Chessboard() {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [gridX, setGridX] = useState(0);
  const [gridY, setGridY] = useState(0);
  const [pieces, setPieces] = useState<Piece[]>(intialBoardState);
  const chessboardRef = useRef<HTMLDivElement | null>(null);

  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if (element.classList.contains('chess-piece') && chessboard) {
      const square = chessboard.clientWidth / SQUARES;
      setGridX(fileFromCursor(e.clientX, chessboard.offsetLeft, square));
      setGridY(rankFromCursor(e.clientY, chessboard.offsetTop, square));

      element.style.position = 'absolute';
      element.style.zIndex = '1000';
      element.style.left = `${e.clientX - square / 2}px`;
      element.style.top = `${e.clientY - square / 2}px`;
      setActivePiece(element);
    }
  }

  function movePiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const square = chessboard.clientWidth / SQUARES;
      const minX = chessboard.offsetLeft;
      const minY = chessboard.offsetTop;
      const maxX = minX + chessboard.clientWidth - square;
      const maxY = minY + chessboard.clientHeight - square;

      let x = e.clientX - square / 2;
      let y = e.clientY - square / 2;
      x = Math.max(minX, Math.min(x, maxX));
      y = Math.max(minY, Math.min(y, maxY));

      activePiece.style.left = `${x}px`;
      activePiece.style.top = `${y}px`;
    }
  }

  function dropPiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const square = chessboard.clientWidth / SQUARES;
      const newX = fileFromCursor(e.clientX, chessboard.offsetLeft, square);
      const newY = rankFromCursor(e.clientY, chessboard.offsetTop, square);

      setPieces((prev) =>
        prev.map((p) =>
          p.x === gridX && p.y === gridY ? { ...p, x: newX, y: newY } : p
        )
      );

      activePiece.style.position = 'relative';
      activePiece.style.left = '0';
      activePiece.style.top = '0';
      activePiece.style.zIndex = 'auto';
      setActivePiece(null);
    }
  }

  let board = [];
  for (let j = verticalaxis.length - 1; j >= 0; j--) {
    for (let i = 0; i < horizontalaxis.length; i++) {
      const number = i + j + 2;
      let image = undefined;
      pieces.forEach((p) => {
        if (p.x === i && p.y === j) {
          image = p.image;
        }
      });
      board.push(<Tile key={`${j},${i}`} image={image} number={number} />);
    }
  }

  return (
    <div
      onMouseMove={(e) => movePiece(e)}
      onMouseDown={(e) => grabPiece(e)}
      onMouseUp={(e) => dropPiece(e)}
      id="chessboard"
      ref={chessboardRef}
    >
      {board}
    </div>
  );
}
