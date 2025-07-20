export const verticalaxis = [1, 2, 3, 4, 5, 6, 7, 8];
export const horizontalaxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export function samePosition(p1: Position, p2: Position){
    return p1.x === p2.x && p1.y === p2.y;
}
export interface Position {
    x: number;
    y: number;
}

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

export interface Piece {
  image: string;
  position: Position;
  type: PieceType;
  team: TeamType;
}

