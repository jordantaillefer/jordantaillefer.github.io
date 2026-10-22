// Le monogramme JT, dans l'ordre où la main l'écrit. La barre ne coiffe que le T :
// commune aux deux lettres, elle se lisait « π ».
export const MONOGRAM = {
  viewBox: '0 0 140 110',
  strokes: [
    {
      id: 'j',
      d: 'M 20 31 C 27 21 42 17 53 23 C 55 40 53 62 48 77 C 44 91 32 98 24 91 C 18 85 23 75 35 77 C 46 79 54 85 64 81',
      durMs: 700,
      delayMs: 80,
    },
    { id: 'tBar', d: 'M 68 31 C 77 22 90 22 101 26 C 113 31 123 28 133 19', durMs: 460, delayMs: 820 },
    { id: 'tStem', d: 'M 101 27 C 99 44 97 61 95 73 C 93 83 97 89 104 87 C 110 85 114 80 117 75', durMs: 420, delayMs: 1300 },
  ],
} as const satisfies {
  viewBox: string;
  strokes: readonly { id: 'j' | 'tBar' | 'tStem'; d: string; durMs: number; delayMs: number }[];
};
