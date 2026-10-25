import React from 'react';
import { Text } from 'react-native';
import { router } from 'expo-router';
import { Button, Page } from '../components/ui';
import { ui } from '../theme';
export default function Missing() {
  return (
    <Page>
      <Text accessibilityRole="header" style={ui.title}>
        That page isn’t here.
      </Text>
      <Button onPress={() => router.replace('/studio')}>Open my studio</Button>
    </Page>
  );
}
