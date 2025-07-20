// Chessboard.tsx
import React, { useRef, useState } from 'react';
import './Chessboard.css';
import Tile from '../Tile/tile';
import Referee from "../../referee/Referee";
import { verticalaxis,horizontalaxis,Piece,PieceType,TeamType,Position,samePosition } from '../../Constants';

const SQUARES = 8;



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

  initialBoardState.push({ image: `/images/rook-${type}.svg`,position: {x: 0, y} , type: PieceType.ROOK, team: teamType });
  initialBoardState.push({ image: `/images/rook-${type}.svg`,position:{ x: 7, y}, type: PieceType.ROOK, team: teamType });
  initialBoardState.push({ image: `/images/knight-${type}.svg`,position:{x: 1, y} , type: PieceType.KNIGHT, team: teamType });
  initialBoardState.push({ image: `/images/knight-${type}.svg`, position:{x: 6, y}, type: PieceType.KNIGHT, team: teamType });
  initialBoardState.push({ image: `/images/bishop-${type}.svg`, position:{x: 2, y}, type: PieceType.BISHOP, team: teamType });
  initialBoardState.push({ image: `/images/bishop-${type}.svg`,position:{ x: 5, y}, type: PieceType.BISHOP, team: teamType });
  initialBoardState.push({ image: `/images/queen-${type}.svg`, position:{x: 3, y}, type: PieceType.QUEEN, team: teamType });
  initialBoardState.push({ image: `/images/king-${type}.svg`, position:{x: 4, y}, type: PieceType.KING, team: teamType });
}
for (let i = 0; i < 8; i++) {
  initialBoardState.push({ image: '/images/pawn-b.svg', position:{x: i, y: 6}, type: PieceType.PAWN, team: TeamType.OPPONENT });
  initialBoardState.push({ image: '/images/pawn-w.svg', position:{x: i, y: 1 }, type: PieceType.PAWN, team: TeamType.OUR });
}

export default function Chessboard() {
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [grabposition,setgrabposition] = useState<Position>({x: -1, y: -1});
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const chessboardRef = useRef<HTMLDivElement | null>(null);
  const referee = new Referee();

  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;
    if (element.classList.contains('chess-piece') && chessboard) {
      const square = chessboard.clientWidth / SQUARES;
      const grabX = fileFromCursor(e.clientX, chessboard.offsetLeft, square);
      const grabY = rankFromCursor(e.clientY, chessboard.offsetTop, square);
      setgrabposition({ x:grabX, y:grabY });
      

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
  
  const [lastMove, setLastMove] = useState<{
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    piece: Piece;
  } | undefined>(undefined);


  function dropPiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const square = chessboard.clientWidth / SQUARES;
      const newX = fileFromCursor(e.clientX, chessboard.offsetLeft, square);
      const newY = rankFromCursor(e.clientY, chessboard.offsetTop, square);

      const currentPiece = pieces.find(p => samePosition(p.position, grabposition));
      if (!currentPiece) return;

      const isValid = referee.isValidMove(grabposition, {x:newX, y:newY}, currentPiece.type, currentPiece.team,pieces,lastMove);

      if (isValid) {
        const movingPiece = pieces.find(p =>samePosition(p.position, grabposition));
        if (!movingPiece) return;

        const updatedPieces = pieces
          // Remove captured piece (normal or en passant)
          .filter(p => {
            const isCapture = samePosition(p.position,{x: newX, y: newY});
            const isEnPassantCapture =
            currentPiece.type === PieceType.PAWN &&
            Math.abs(newX - grabposition.x) === 1 &&
            newY - grabposition.y === (currentPiece.team === TeamType.OUR ? 1 : -1) &&
            p.position.x === newX &&
            p.position.y === grabposition.y &&
            p.team !== currentPiece.team &&
            p.type === PieceType.PAWN &&
            lastMove &&
            lastMove.piece.type === PieceType.PAWN &&
            lastMove.fromY === (currentPiece.team === TeamType.OUR ? 6 : 1) &&
            lastMove.toY === grabposition.y &&
            lastMove.toX === newX;

          return !isCapture && !isEnPassantCapture;
        })
          // Move active piece
          .map(p =>
            samePosition(p.position, grabposition) ? { ...p, position:{x: newX, y: newY} } : p
          );

        setPieces(updatedPieces);

        setLastMove({
          fromX: grabposition.x,
          fromY: grabposition.y,
          toX: newX,
          toY: newY,
          piece: movingPiece
        });
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
      const piece = pieces.find(p => samePosition(p.position, {x: i,y:j}));
      let image = piece ? piece.image : undefined;

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
