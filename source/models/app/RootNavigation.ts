//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import { NavigationAction, NavigationState } from "@react-navigation/native";
import { RootStackNavigation, RootStackPropsPerPath } from "navigation/params";

export class RootNavigation {
  private root: RootStackNavigation | undefined = undefined;

  set(navigation: RootStackNavigation): void {
    this.root = navigation;
  }

  push<RouteName extends keyof RootStackPropsPerPath>(
    ...args: undefined extends RootStackPropsPerPath[RouteName]
      ? [RouteName] | [RouteName, RootStackPropsPerPath[RouteName]]
      : [RouteName, RootStackPropsPerPath[RouteName]]
  ): void {
    this.root?.push(...args);
  }

  replace<RouteName extends keyof RootStackPropsPerPath>(
    ...args: undefined extends RootStackPropsPerPath[RouteName]
      ? [RouteName] | [RouteName, RootStackPropsPerPath[RouteName]]
      : [RouteName, RootStackPropsPerPath[RouteName]]
  ): void {
    this.root?.replace(...args);
  }

  pop(count?: number): void {
    this.root?.pop(count);
  }

  popToTop(): void {
    this.root?.popToTop();
  }

  canGoBack(): boolean {
    return this.root?.canGoBack() ?? false;
  }

  dispatch(
    action: NavigationAction | ((state: NavigationState) => NavigationAction)
  ): void {
    this.root?.dispatch(action);
  }
}
