import React from 'react';
import { Image, View } from 'react-native';
import { colors } from '../theme';

export function Materials({ size = 58 }: { size?: number }) {
  return (
    <View
      accessibilityLabel="Sage linen, walnut, and cream linen"
      style={{ flexDirection: 'row', width: size * 2.6, height: size + 4 }}
    >
      {[0, 1, 2].map((index) => (
        <View
          key={index}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            overflow: 'hidden',
            borderWidth: 1.5,
            borderColor: colors.cream,
            marginLeft: index ? -size * 0.2 : 0,
            zIndex: 3 - index,
          }}
        >
          <Image
            source={require('../../assets/materials.jpg')}
            style={{
              position: 'absolute',
              left: -index * size,
              top: 0,
              width: size * 3,
              height: size,
            }}
          />
        </View>
      ))}
    </View>
  );
}
