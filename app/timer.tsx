// app/timer.tsx (Timer Screen)
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TimerDisplay } from "../components/TimerDisplay";
import { TimerService } from "../services/TimerService";
import { TimerModel } from "../types/timer.types";

export default function TimerScreen() {
  const [, forceUpdate] = useState({});
  const timerService = TimerService.getInstance();
  const presenter = timerService.getPresenter();

  useEffect(() => {
    const model = (presenter as any).model as TimerModel;
    const unsubscribe = model.subscribe(() => {
      forceUpdate({});
    });

    return unsubscribe;
  }, [presenter]);

  const isRunning = presenter.isRunning();

  const handlePlayPause = () => {
    if (isRunning) {
      presenter.pauseTimer();
    } else {
      presenter.startTimer();
    }
  };

  const handleReset = () => {
    presenter.resetTimer();
  };

  const handleBack = () => {
    presenter.resetTimer();
    router.back();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.timerSection}>
        <TimerDisplay presenter={presenter} />
      </View>

      <View style={styles.controlsSection}>
        <TouchableOpacity
          style={styles.playPauseButton}
          onPress={handlePlayPause}
        >
          <Text style={styles.playPauseButtonText}>
            {isRunning ? "Pause" : "Play"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fe9a8a",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  timerSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  controlsSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
    gap: 20,
  },
  playPauseButton: {
    backgroundColor: "#660000",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 100,
    alignItems: "center",
  },
  playPauseButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  resetButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    minWidth: 100,
    alignItems: "center",
  },
  resetButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
