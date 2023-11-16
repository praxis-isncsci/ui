export const validCellNameRegex =
  /^(right|left)-(light-touch|pin-prick|motor)-(c|t|l|s)(4_5|\d{1,2})$/;
export const lightTouchCellRegex =
  /^(right|left)-light-touch-(c|t|l|s)(4_5|\d{1,2})$/;
export const pinPrickCellRegex =
  /^(right|left)-pin-prick-(c|t|l|s)(4_5|\d{1,2})$/;
export const motorCellRegex = /^(right|left)-motor-\d$/;
export const cellLevelRegex = /((?!-)(c|t|l|s)(4_5|\d{1,2}))$/;
