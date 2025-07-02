// Referee.ts
import { PieceType, TeamType } from "../components/Chessboard/Chessboard";

export default class Referee {
  isValidMove(
    px: number,
    py: number,
    x: number,
    y: number,
    type: PieceType,
    team: TeamType
  ): boolean {
    if (type !== PieceType.PAWN) return true;

    const direction = team === TeamType.OUR ? 1 : -1;
    const startRow = team === TeamType.OUR ? 1 : 6;

    // Move one square forward
    if (x === px && y === py + direction) return true;

    // Move two squares forward from starting rank
    if (x === px && py === startRow && y === py + 2 * direction) return true;

    return false;
  }
}
