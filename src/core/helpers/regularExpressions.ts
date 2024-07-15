export const validCellNameRegex =
  /^(right|left)-(light-touch|pin-prick|motor)-(c|t|l|s)(4_5|\d{1,2})$/;
export const lightTouchCellRegex =
  /^(right|left)-light-touch-(c|t|l|s)(4_5|\d{1,2})$/;
export const pinPrickCellRegex =
  /^(right|left)-pin-prick-(c|t|l|s)(4_5|\d{1,2})$/;
export const sensoryCellRegex =
  /^(right|left)-(light-touch|pin-prick)-(c[2-8]|t1[0-2]|t[1-9]|l[1-5]|s[1-3]|s4_5)$/;
export const motorCellRegex = /^(right|left)-motor-(c|t|l|s)\d$/;
export const cellLevelRegex = /((?!-)(c|t|l|s)(4_5|\d{1,2}))$/;
export const motorValueRegex = /^([0-4](\*{0,2})|5|UNK|NT(\*{0,2})|\s?)$/;
export const sensoryValueRegex = /^(0(\*?)|1(\*{0,2})|2|UNK|NT(\*{0,2})|\s?)$/;
export const levelNameRegex = /((?!-)(c|t|l|s)1?[0-9]$)|((?!-)s4_5)/;
