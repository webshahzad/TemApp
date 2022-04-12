//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React from "react";
import { View, Text, Image } from "react-native";
import { Theme } from "components/Theme";

import SplashImage from "assets/images/dashboard/da3b8469-7454-4f80-9267-b6863cd2f849.png";

export interface SplashHeaderProps {
  title: string;
}

export function SplashHeader(p: SplashHeaderProps): JSX.Element {
  return (
    <View style={Theme.splash}>
      <Image source={SplashImage} style={Theme.splashImage} />
      <Text style={Theme.splashText}>{p.title}</Text>
    </View>
  );
}
