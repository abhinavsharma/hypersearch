describe('Darkmode tests', () => {

  afterEach(() => {
    jest.resetModules();
  });

  test('Darkmode.enable', async () => {
    const spy = jest.fn(() => {});

    jest.doMock('./darkmode.js', () => {
      return (object: any) => {
        expect(object).toBeInstanceOf(Document);
        return {
          auto: spy,
        }
      };
    });

    const Darkmode = require('.').default;

    // When
    Darkmode.enable(document);
    
    // Then
    expect(spy).toHaveBeenCalledWith(undefined, undefined, true);
  });

})
