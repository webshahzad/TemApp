import React, { ReactNode } from "react";
import { ColorValue } from "react-native";
import { Neomorph } from "react-native-neomorph-shadows";
interface shadowProps {
  children: ReactNode;
  shadowStyle: object | undefined;
  isSwapShadow:boolean
}

export function MorphShadow(p: shadowProps) {
  return (
    <Neomorph
      inner // <- enable shadow inside of neomorph
      swapShadows={p.isSwapShadow ? true :false}
      style={[
        p.shadowStyle,
        {
          shadowRadius: 1,
          shadowOffset: { width: 4, height: 4 },
          elevation: 2,
        },
      ]}
    >
      {p.children}
    </Neomorph>
  );
}
