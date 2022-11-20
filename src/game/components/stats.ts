import { defineComponent, Types } from 'bitecs'

export const Stats = defineComponent({
  level: Types.ui32,
  health: Types.ui32,
  attack: Types.ui32,
  armor: Types.ui32,
  shields: Types.ui32
})

export default Stats
