import { PieceType,TeamType,Piece,Position } from "../Constants";


export default class Referee {
  isValidMove(
    initialposition : Position,// git-change-check
    desiredposition : Position,
    type: PieceType,
    team: TeamType,
    boardState: Piece[],
    lastMove?: { fromX: number; fromY: number; toX: number; toY: number; piece: Piece }
  ): boolean {

    if (
      initialposition.x === desiredposition.x &&
      initialposition.y === desiredposition.y
    ) {
      return false;
    }

    if (type === PieceType.KNIGHT) {
      return this.isValidKnightMove(initialposition, desiredposition, team, boardState);
    }
    if (type === PieceType.BISHOP) {
      return this.isValidBishopMove(initialposition, desiredposition, team, boardState);
    }
    if (type === PieceType.ROOK) {
      return this.isValidRookMove(initialposition, desiredposition, team, boardState);
    }
    if(type === PieceType.QUEEN) {
      return this.isValidQueenMove(initialposition, desiredposition, team, boardState);
    }
    if(type === PieceType.KING) {
      return this.isValidKingMove(initialposition, desiredposition, team, boardState);
    }
    if (type === PieceType.PAWN) {
      return this.isValidPawnMove(initialposition,desiredposition,team,boardState,lastMove);
    }

    return false;
  }
  private isValidPawnMove(
  initial: Position,
  desired: Position,
  team: TeamType,
  board: Piece[],
  lastMove?: { fromX: number; fromY: number; toX: number; toY: number; piece: Piece }
): boolean {

  const direction = team === TeamType.OUR ? 1 : -1;
  const startRow = team === TeamType.OUR ? 1 : 6;

  const deltaX = desired.x - initial.x;
  const deltaY = desired.y - initial.y;

  const destinationOccupied = this.tileIsOccupied(desired.x, desired.y, board);

  // Forward one
  if (deltaX === 0 && deltaY === direction && !destinationOccupied) {
    return true;
  }

  // Forward two (first move)
  if (
    deltaX === 0 &&
    deltaY === 2 * direction &&
    initial.y === startRow &&
    !this.tileIsOccupied(initial.x, initial.y + direction, board) &&
    !destinationOccupied
  ) {
    return true;
  }

  // Diagonal capture
  if (
    Math.abs(deltaX) === 1 &&
    deltaY === direction &&
    this.tileIsOccupiedByEnemy(desired.x, desired.y, team, board)
  ) {
    return true;
  }

  // En passant
  if (
    Math.abs(deltaX) === 1 &&
    deltaY === direction &&
    !destinationOccupied &&
    lastMove &&
    lastMove.piece.type === PieceType.PAWN &&
    lastMove.piece.team !== team &&
    Math.abs(lastMove.fromY - lastMove.toY) === 2 &&
    lastMove.toY === initial.y &&
    lastMove.toX === desired.x
  ) {
    return true;
  }

  return false;
}

  private isValidKnightMove(
    initial: Position,
    desired: Position,
    team: TeamType,
    board: Piece[]
  ): boolean {

    const deltaX = Math.abs(desired.x - initial.x);
    const deltaY = Math.abs(desired.y - initial.y);

    console.log(`Knight move from (${initial.x},${initial.y}) to (${desired.x},${desired.y})`);

    const isLShaped =
      (deltaX === 2 && deltaY === 1) || // Right/Left horizontal L
      (deltaX === 1 && deltaY === 2);  // Up/Down vertical L
    
    if (!isLShaped) return false;

    const destinationPiece = board.find(
      p => p.position.x === desired.x && p.position.y === desired.y
    );

    if (!destinationPiece) return true;

    if (destinationPiece.team === team) return false;

    return true;
  }

  private isValidBishopMove(
    initial: Position,
    desired: Position,
    team: TeamType,
    board: Piece[]
  ): boolean {
    const deltaX = desired.x - initial.x;
    const deltaY = desired.y - initial.y;

    console.log(`Bishop: (${initial.x},${initial.y}) → (${desired.x},${desired.y})`);

    // Check if the move is diagonally valid
    if (Math.abs(deltaX) !== Math.abs(deltaY)) return false;

    const stepX = deltaX > 0 ? 1 : -1;
    const stepY = deltaY > 0 ? 1 : -1;

    let x = initial.x + stepX;
    let y = initial.y + stepY;

    while (x !== desired.x || y !== desired.y) {
      if (this.tileIsOccupied(x, y, board)) {
        return false;
      }
      x += stepX;
      y += stepY;
    }

    const destinationPiece = board.find(
      p => p.position.x === desired.x && p.position.y === desired.y
    );

    if (!destinationPiece) return true;
    return destinationPiece.team !== team;
  }

  private isValidRookMove(
    initial: Position,
    desired: Position,
    team: TeamType,
    board: Piece[]
  ): boolean {
    const deltaX = desired.x - initial.x;
    const deltaY = desired.y - initial.y;
    if(deltaX !==0 && deltaY !== 0) return false;
    const stepX = deltaX === 0 ? 0 : (deltaX > 0 ? 1 : -1);
    const stepY = deltaY === 0 ? 0 : (deltaY > 0 ? 1 : -1);

    console.log(`Rook: (${initial.x},${initial.y}) → (${desired.x},${desired.y})`);

    let x = initial.x + stepX;
    let y = initial.y + stepY;

    while(x !== desired.x || y !== desired.y){
      if(this.tileIsOccupied(x,y,board)){
        return false;
      }
      x+= stepX;
      y+= stepY;
    }
    const destinationPiece = board.find(
      p => p.position.x === desired.x && p.position.y === desired.y
    );

    if (!destinationPiece) return true;
    return destinationPiece.team !== team;

  }

  private isValidQueenMove(
    initial: Position,
    desired: Position,
    team: TeamType,
    board: Piece[]
  ): boolean {
     return (
      this.isValidBishopMove(initial, desired, team, board) || this.isValidRookMove(initial, desired, team, board)
     );
  }

  private isValidKingMove(
    initial: Position,
    desired: Position,
    team: TeamType,
    board: Piece[]
  ): boolean {
      const deltaX = Math.abs(desired.x - initial.x);
      const deltaY = Math.abs(desired.y - initial.y);

      if (deltaX > 1 || deltaY > 1) return false;

      const destinationPiece = board.find(
        p => p.position.x === desired.x && p.position.y === desired.y
      );

      if (!destinationPiece) return true;
      return destinationPiece.team !== team;
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
