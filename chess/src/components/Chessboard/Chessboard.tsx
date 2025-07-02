// Chessboard.tsx
import React, { useRef, useState } from 'react';
import './Chessboard.css';
import Tile from '../Tile/tile';
import Referee from "../../referee/Referee";

const verticalaxis = [1, 2, 3, 4, 5, 6, 7, 8];
const horizontalaxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const SQUARES = 8;

export enum TeamType {
  OPPONENT,
  OUR
}
export enum PieceType {
  PAWN,
  BISHOP,
  KNIGHT,
  ROOK,
  QUEEN,
  KING
}

interface Piece {
  image: string;
  x: number;
  y: number;
  type: PieceType;
  team: TeamType;
}

function fileFromCursor(x: number, boardLeft: number, squareSize: number) {
  return Math.floor((x - boardLeft) / squareSize);
}
function rankFromCursor(y: number, boardTop: number, squareSize: number) {
  return SQUARES - 1 - Math.floor((y - boardTop) / squareSize);
}

const initialBoardState: Piece[] = [];
for (let p = 0; p < 2; p++) {
  const teamType = (p === 0) ? TeamType.OPPONENT : TeamType.OUR;
  const type = p === 0 ? 'b' : 'w';
  const y = p === 0 ? 7 : 0;

  initialBoardState.push({ image: `/images/rook-${type}.svg`, x: 0, y, type: PieceType.ROOK, team: teamType });
  initialBoardState.push({ image: `/images/rook-${type}.svg`, x: 7, y, type: PieceType.ROOK, team: teamType });
  initialBoardState.push({ image: `/images/knight-${type}.svg`, x: 1, y, type: PieceType.KNIGHT, team: teamType });
  initialBoardState.push({ image: `/images/knight-${type}.svg`, x: 6, y, type: PieceType.KNIGHT, team: teamType });
  initialBoardState.push({ image: `/images/bishop-${type}.svg`, x: 2, y, type: PieceType.BISHOP, team: teamType });
  initialBoardState.push({ image: `/images/bishop-${type}.svg`, x: 5, y, type: PieceType.BISHOP, team: teamType });
  initialBoardState.push({ image: `/images/queen-${type}.svg`, x: 3, y, type: PieceType.QUEEN, team: teamType });
  initialBoardState.push({ image: `/images/king-${type}.svg`, x: 4, y, type: PieceType.KING, team: teamType });
}
for (let i = 0; i < 8; i++) {
  initialBoardState.push({ image: '/images/pawn-b.svg', x: i, y: 6, type: PieceType.PAWN, team: TeamType.OPPONENT });
  initialBoardState.push({ image: '/images/pawn-w.svg', x: i, y: 1, type: PieceType.PAWN, team: TeamType.OUR });
}

export default function Chessboard() {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [gridX, setGridX] = useState(0);
  const [gridY, setGridY] = useState(0);
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const chessboardRef = useRef<HTMLDivElement | null>(null);
  const referee = new Referee();

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

      const currentPiece = pieces.find(p => p.x === gridX && p.y === gridY);
      if (!currentPiece) return;

      const isValid = referee.isValidMove(gridX, gridY, newX, newY, currentPiece.type, currentPiece.team);

      if (isValid) {
        // Update state
        setPieces(prev =>
          prev.map(p =>
            p.x === gridX && p.y === gridY ? { ...p, x: newX, y: newY } : p
          )
        );
      }

      // Snap piece to grid (valid or not)
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
      onMouseMove={movePiece}
      onMouseDown={grabPiece}
      onMouseUp={dropPiece}
      id="chessboard"
      ref={chessboardRef}
    >
      {board}
    </div>
  );
}
