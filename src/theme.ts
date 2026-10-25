import { StyleSheet } from 'react-native';

export const colors = {
  cream: '#F7F5ED',
  paper: '#FFFDF7',
  forest: '#294938',
  green: '#385B43',
  sage: '#DDE5D5',
  pale: '#EAF0E4',
  brown: '#785B45',
  sand: '#EAE1D3',
  ink: '#2F382E',
  muted: '#687060',
  line: '#DCDDD0',
  error: '#91462D',
};
export const fonts = {
  regular: 'DMRegular',
  medium: 'DMMedium',
  bold: 'DMBold',
  display: 'Cormorant',
};
export const ui = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: {
    fontFamily: fonts.display,
    fontSize: 40,
    lineHeight: 43,
    letterSpacing: -0.8,
    color: colors.forest,
  },
  heading: {
    fontFamily: fonts.display,
    fontSize: 29,
    lineHeight: 33,
    letterSpacing: -0.5,
    color: colors.ink,
  },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 23, color: colors.muted },
  small: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 18, color: colors.muted },
  label: { fontFamily: fonts.medium, fontSize: 14, color: colors.ink },
  rule: { height: 1, backgroundColor: colors.line },
});
