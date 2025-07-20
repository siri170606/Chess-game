import { PieceType,TeamType,Piece,Position } from "../Constants";


export default class Referee {
  isValidMove(
    initialposition : Position,
    desiredposition : Position,
    type: PieceType,
    team: TeamType,
    boardState: Piece[],
    lastMove?: { fromX: number; fromY: number; toX: number; toY: number; piece: Piece }
  ): boolean {
    if (type !== PieceType.PAWN) return true;

    const direction = team === TeamType.OUR ? 1 : -1;
    const startRow = team === TeamType.OUR ? 1 : 6;

    const deltaX = desiredposition.x - initialposition.x;
    const deltaY = desiredposition.y - initialposition.y;

    const destinationOccupied = this.tileIsOccupied(desiredposition.x, desiredposition.y, boardState);

    // Move forward one square
    if (deltaX === 0 && deltaY === direction && !destinationOccupied) {
      return true;
    }

    // Move forward two squares from starting position
    if (
      deltaX === 0 &&
      deltaY === 2 * direction &&
      initialposition.y === startRow &&
      !this.tileIsOccupied(initialposition.x, initialposition.y + direction, boardState)&&
      !destinationOccupied
    ) {
      return true;
    }

    // Diagonal capture
    if (
      Math.abs(deltaX) === 1 &&
      deltaY === direction &&
      this.tileIsOccupiedByEnemy(desiredposition.x, desiredposition.y, team, boardState)
    ) {
      return true;
    }
     
    // En Passant
    if (
      type === PieceType.PAWN &&
      Math.abs(desiredposition.x - initialposition.x) === 1 &&
      desiredposition.y - initialposition.y === (team === TeamType.OUR ? 1 : -1)
    ) {
      if (
        lastMove &&
        lastMove.piece.type === PieceType.PAWN &&
        lastMove.piece.team !== team &&
        lastMove.fromY === (team === TeamType.OUR ? 6 : 1) &&
        lastMove.toY === (team === TeamType.OUR ? 4 : 3) &&
        lastMove.toX === desiredposition.x &&
        lastMove.toY === initialposition.y
      ) {
        return true;
      }
    }

    // TODO: Add en passant and promotion logic

    return false;
  }

  private tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean {
    return boardState.some(p => p.position.x === x && p.position.y === y);
  }

  private tileIsOccupiedByEnemy(
    x: number,
    y: number,
    team: TeamType,
    boardState: Piece[]
  ): boolean {
    return boardState.some(p => p.position.x === x && p.position.y === y && p.team !== team);
  }
}
