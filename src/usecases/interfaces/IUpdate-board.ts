
export type UpdateBoardResponse = {
    result: 'win' | 'draw' | 'continue';
    player?: 'X' | 'O';
  }

export interface IUpdateBoardUsecase {
    execute(input: {
      session: string;
      x: 0 | 1 | 2;
      y: 0 | 1 | 2;
      playerIcon: 'X' | 'O';
    }): Promise<UpdateBoardResponse>;
}
