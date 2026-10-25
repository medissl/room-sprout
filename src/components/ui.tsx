import React from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, ui } from '../theme';
import { useRoom } from '../state';

export function Logo({ small = false }: { small?: boolean }) {
  return (
    <View style={[ui.row, { gap: 4 }]}>
      <Image
        source={require('../../assets/icon.png')}
        style={{ width: small ? 30 : 36, height: small ? 30 : 36 }}
        accessibilityElementsHidden
      />
      <Text
        style={{
          fontFamily: fonts.display,
          color: colors.forest,
          fontSize: small ? 25 : 29,
          letterSpacing: -0.4,
        }}
      >
        roomsprout.
      </Text>
    </View>
  );
}
export function Button({
  children,
  onPress,
  secondary = false,
  disabled = false,
  loading = false,
}: {
  children: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        s.button,
        secondary && s.secondary,
        { opacity: disabled ? 0.45 : pressed ? 0.78 : 1 },
      ]}
    >
      {loading && <ActivityIndicator color={secondary ? colors.forest : colors.paper} />}
      <Text style={[s.buttonText, secondary && { color: colors.forest }]}>{children}</Text>
    </Pressable>
  );
}
export function TextAction({
  children,
  label,
  onPress,
  selected = false,
}: {
  children: string;
  label?: string;
  onPress: () => void;
  selected?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [s.textAction, { opacity: pressed ? 0.5 : 1 }]}
    >
      <Text
        style={[
          ui.label,
          { color: colors.forest, fontFamily: selected ? fonts.bold : fonts.medium },
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}
export function Page({
  children,
  back,
  title,
  footer,
}: {
  children: React.ReactNode;
  back?: boolean;
  title?: string;
  footer?: React.ReactNode;
}) {
  const { storageError } = useRoom();
  return (
    <SafeAreaView style={s.page} edges={['top', 'left', 'right']}>
      {back && (
        <View style={s.topbar}>
          <TextAction
            label="Go back"
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/studio'))}
          >
            Back
          </TextAction>
          {title ? <Text style={ui.small}>{title}</Text> : null}
        </View>
      )}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.content}>
          {children}
          {storageError ? (
            <Text accessibilityRole="alert" style={[ui.small, { color: colors.error }]}>
              {storageError}
            </Text>
          ) : null}
        </View>
      </ScrollView>
      {footer && (
        <SafeAreaView edges={['bottom']} style={s.footer}>
          {footer}
        </SafeAreaView>
      )}
    </SafeAreaView>
  );
}
export function Photo({
  source,
  height,
  label,
}: {
  source: ImageSourcePropType;
  height: number;
  label: string;
}) {
  return (
    <View style={{ height, overflow: 'hidden', borderRadius: 12, backgroundColor: colors.sand }}>
      <Image
        source={source}
        accessibilityLabel={label}
        style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }]}
        resizeMode="cover"
      />
    </View>
  );
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.cream },
  content: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 28, gap: 24 },
  topbar: {
    paddingHorizontal: 24,
    paddingTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'web' ? 16 : 8,
    backgroundColor: colors.cream,
    gap: 6,
  },
  button: {
    minHeight: 54,
    backgroundColor: colors.forest,
    borderRadius: 28,
    paddingHorizontal: 14,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: { backgroundColor: colors.pale, borderWidth: 1, borderColor: colors.line },
  buttonText: { fontFamily: fonts.medium, fontSize: 14, color: colors.paper, flexShrink: 1 },
  textAction: { minWidth: 44, minHeight: 44, justifyContent: 'center' },
});
