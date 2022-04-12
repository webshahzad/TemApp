import React, { ReactNode } from "react";
import { ColorValue } from 'react-native'
import { Shadow } from "react-native-shadow-2";

interface shadowProps {
  children: ReactNode;
  startColor: string;
  distance: number;
  finalColor: string;
  viewStyle: object | undefined;
}

export function ShadowComp(p: shadowProps) {
  return (
    <Shadow
      startColor={p.startColor}
      distance={3}
      finalColor={p.finalColor}
      viewStyle={p.viewStyle}
    >
      {p.children}
    </Shadow>
  );
}
