import { UpdateBase } from "./base";

export type CombatUpdateBase<T, D = {}> = UpdateBase<"combat", D & { type: T }>;

// export type CombatUpdate = | CombatUpdateBase<
//     "attack",
//     { attacker: number; defender: number; damage: number }> |
//     CombatUpdateBase<"heal", { target: number; amount: number }> |
//     CombatUpdateBase<"outcome", { winner: number; loser: number }>;
