import { MySimpleUsecase } from '../../my-simple-usecase';

describe(__filename, () => {
  const simpleUsecase = new MySimpleUsecase();
  describe('execute', () => {
    it('should pass', async () => {
      const res = await simpleUsecase.execute();

      expect(res).toEqual(1);
    });
  });
});
