declare global {
  namespace bitecs {
    interface IWorld {
      time?: {
        delta: number;
        elapsed: number;
        then: number;
      }
    }
  }
}