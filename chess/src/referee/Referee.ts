import { PieceType, TeamType } from "../components/Chessboard/Chessboard";

export interface Piece {
  x: number;
  y: number;
  type: PieceType;
  team: TeamType;
}

export default class Referee {
  isValidMove(
    px: number,
    py: number,
    x: number,
    y: number,
    type: PieceType,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    if (type !== PieceType.PAWN) return true;

    const direction = team === TeamType.OUR ? 1 : -1;
    const startRow = team === TeamType.OUR ? 1 : 6;

    const deltaX = x - px;
    const deltaY = y - py;

    const destinationOccupied = this.tileIsOccupied(x, y, boardState);

    // Move forward one square
    if (deltaX === 0 && deltaY === direction && !destinationOccupied) {
      return true;
    }

    // Move forward two squares from starting position
    if (
      deltaX === 0 &&
      deltaY === 2 * direction &&
      py === startRow &&
      !this.tileIsOccupied(px, py + direction, boardState) &&
      !destinationOccupied
    ) {
      return true;
    }

    // Diagonal capture
    if (
      Math.abs(deltaX) === 1 &&
      deltaY === direction &&
      this.tileIsOccupiedByEnemy(x, y, team, boardState)
    ) {
      return true;
    }

    // TODO: Add en passant and promotion logic

    return false;
  }

  private tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean {
    return boardState.some(p => p.x === x && p.y === y);
  }

  private tileIsOccupiedByEnemy(
    x: number,
    y: number,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    return boardState.some(p => p.x === x && p.y === y && p.team !== team);
  }
}
