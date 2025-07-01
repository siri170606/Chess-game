import { PieceType, TeamType } from "../components/Chessboard/Chessboard";

export default class Referee{
    isValidMove(px: number ,py: number ,x: number ,y: number ,type: PieceType,team: TeamType) {
        console.log("Referee is checking the move...");
        
        if(type === PieceType.PAWN){

        }

        return false;
        
    }
}  