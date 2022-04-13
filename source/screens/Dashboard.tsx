//----------------------------------------------------//
// Copyright © 2020 Capovela LLC.                     //
// Proprietary and Confidential. All rights reserved. //
//----------------------------------------------------//

import React, { useEffect } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { DashboardStackPropsPerPath } from "navigation/params";
import { App } from "models/app/App";
import { HeaderButton, HeaderRight } from "components/HeaderRight";
import { HomeContainer } from "components/ImageContainer/HomeContainer";
import SwiperComp from "components/Swiper";
import { MyHealth } from "./Home/MyHealth";
import { MySchedule } from "./Home/MySchedule";
import { Ref } from "reactronic";
import { MyJourney } from "screens/Home/MyJourney";
import { MyCommunity } from "screens/Home/MyCommunity";
import { StoredLeaderboard } from "models/data/Leaderboard";

export function Dashboard(
  p: StackScreenProps<DashboardStackPropsPerPath, "Dashboard">
): JSX.Element {
  const [changeText, setChangeText] = React.useState("ADD/TRACK ACTIVITY");
  const [screenNAme, setScreenNAme] = React.useState("SelectActivity");
  const [indexNumber, setIndexNumber] = React.useState("0");
  React.useLayoutEffect(() => {
    p.navigation.setOptions({
      headerRight: (props) => (
        <HeaderRight
          tintColor={props.tintColor}
          buttons={[HeaderButton.globalSearch]}
        />
      ),
    });
  }, []);
  // return reactive(() => {
  useEffect(() => {
      void App?.user.report.load();
      void App?.user.extraHoneyCombs.load();
      void App?.user.hais.load();
      void App.googleFit.askToEnableActivitiesSync();
      let leaderboard: StoredLeaderboard;
      if (App.leaderboard.stored) leaderboard = App.leaderboard.stored;
      else leaderboard = App.leaderboard.initializeStoredLeaderboard();
      void leaderboard?.load();
    App.dashboard.saveNavigation(p.navigation);
  });
  const onChangeLabel = (label: any, screen:any, index:any) => {
    setScreenNAme(screen)
    setChangeText(label);
    setIndexNumber(index)

  };
  return (
    <HomeContainer   slider hexagonText={changeText} screenName={screenNAme} indexNumber={indexNumber} >
      <SwiperComp onChangeLabel={onChangeLabel}>
        <MyHealth />
        <MySchedule />
        <MyJourney />
        <MyCommunity />
      </SwiperComp>
    </HomeContainer>
    
  );
}
