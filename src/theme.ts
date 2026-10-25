import { StyleSheet } from 'react-native';

export const colors = {
  cream: '#F5F1E7',
  paper: '#FFFCF5',
  forest: '#263E2E',
  green: '#385B43',
  sage: '#CCD6B5',
  pale: '#E3E7D5',
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
  display: 'DMBold',
};
export const ui = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: {
    fontFamily: fonts.display,
    fontSize: 36,
    lineHeight: 38,
    letterSpacing: -1.7,
    color: colors.forest,
  },
  heading: {
    fontFamily: fonts.display,
    fontSize: 23,
    lineHeight: 27,
    letterSpacing: -0.8,
    color: colors.ink,
  },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 23, color: colors.muted },
  small: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 18, color: colors.muted },
  label: { fontFamily: fonts.medium, fontSize: 14, color: colors.ink },
  rule: { height: 1, backgroundColor: colors.line },
});
