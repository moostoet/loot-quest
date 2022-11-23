import { defineComponent, Types } from 'bitecs'

export const Stats = defineComponent({
  level: Types.ui32,
  maxHealth: Types.ui32,
  currentHealth: Types.ui32,
  attack: Types.ui32,
  armor: Types.ui32,
  currentShields: Types.ui32,
  maxShields: Types.ui32
})

export default Stats
