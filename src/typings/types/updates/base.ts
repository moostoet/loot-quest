export type UpdateBase<S extends string, D> = {
    source: S;
} & D;