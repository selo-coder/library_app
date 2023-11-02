export const getDropDownHeightByCount = (dropDownCount: number): string => {
  return dropDownCount === 0 || dropDownCount === 1 || !dropDownCount
    ? 'h-[80px]'
    : dropDownCount === 2
    ? 'h-[116px]'
    : dropDownCount === 3
    ? 'h-[152px]'
    : dropDownCount === 4
    ? 'h-[224px]'
    : dropDownCount === 5
    ? 'h-[260px]'
    : dropDownCount === 6
    ? 'h-[296px]'
    : dropDownCount === 7
    ? 'h-[332px]'
    : dropDownCount === 8
    ? 'h-[368px]'
    : ''
}
