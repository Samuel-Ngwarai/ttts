
export type UpdateBoardResponse = {
    result: 'win' | 'draw' | 'continue';
    player?: 'X' | 'O';
    playerXSocketId: string,
    playerOSocketId: string
  }

export interface IUpdateBoardUsecase {
    execute(input: {
      session: string;
      x: 0 | 1 | 2;
      y: 0 | 1 | 2;
      icon: 'X' | 'O';
    }): Promise<UpdateBoardResponse>;
}
