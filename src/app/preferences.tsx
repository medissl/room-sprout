import React from 'react';
import { Redirect } from 'expo-router';
// Compatibility for old bookmarks; setup now lives in a single workspace.
export default function Preferences() {
  return <Redirect href="/capture" />;
}
