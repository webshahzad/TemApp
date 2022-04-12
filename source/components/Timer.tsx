import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

export function CountDown() {
  let timer = () => {};

  const [timeLeft, setTimeLeft] = useState(60);

  const startTimer = () => {
    timer = setTimeout(() => {
      if (timeLeft <= 0) {
        clearTimeout(timer);
        return false;
      }
      setTimeLeft(timeLeft - 1);
    }, 1000);
  };

  useEffect(() => {
    startTimer();
    return () => clearTimeout(timer);
  });

  const start = () => {
    setTimeLeft(60);
    clearTimeout(timer);
    startTimer();
  };
  return (
    <View style={{ marginTop: 10 }}>
      <Text style={styles.time}>{timeLeft}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  time: {
    color: "#FFFFFF",
    fontWeight: "normal",
    fontSize: 10,
    position: "absolute",
    top: -10,
    marginLeft: 5,
  },
});
