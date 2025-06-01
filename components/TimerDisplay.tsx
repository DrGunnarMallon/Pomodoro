// components/TimerDisplay.tsx
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Circle, Line, Svg, Text as SvgText } from "react-native-svg";
import { TimerModel, TimerPresenter } from "../types/timer.types";

interface TimerDisplayProps {
  presenter: TimerPresenter;
}

export function TimerDisplay({ presenter }: TimerDisplayProps) {
  const [, forceUpdate] = useState({});
  const radius = 25;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // Force re-render when timer updates
    const model = (presenter as any).model as TimerModel;
    const unsubscribe = model.subscribe(() => {
      forceUpdate({});
    });

    return unsubscribe;
  }, [presenter]);

  const progressRatio = presenter.getProgressRatio();
  const arcLength = progressRatio * circumference;
  const gapLength = circumference - arcLength;
  const displayTime = presenter.getDisplayTime();

  const tickCount = 25;
  const tickAngleIncrement = 360 / tickCount;

  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const angleDeg = i * tickAngleIncrement - 90;
    const angleRad = (angleDeg * Math.PI) / 180;

    const cx = 50;
    const cy = 50;

    const hasLabel = i % 5 === 0;
    const tickLengthLabeled = 2;
    const tickLengthUnlabeled = 1;
    const currentTickLength = hasLabel
      ? tickLengthLabeled
      : tickLengthUnlabeled;

    const tickStartL = radius + 5;
    const x2 = cx + tickStartL * Math.cos(angleRad);
    const y2 = cy + tickStartL * Math.sin(angleRad);

    const tickStartR = tickStartL - currentTickLength;
    const x1 = cx + tickStartR * Math.cos(angleRad);
    const y1 = cy + tickStartR * Math.sin(angleRad);

    const labelR = radius - 1;
    const lx = cx + labelR * Math.cos(angleRad);
    const ly = cy + labelR * Math.sin(angleRad);

    const label = String(tickCount - i);
    return { x1, y1, x2, y2, lx, ly, label, hasLabel };
  });

  return (
    <View style={styles.timerContainer}>
      <Svg
        height="100%"
        width="100
      
      %"
        viewBox="0 0 100 100"
      >
        <Circle
          cx="50"
          cy="50"
          r={radius + radius / 2 - 5}
          strokeWidth="25"
          fill="#990000"
        />

        <Circle
          cx="50"
          cy="50"
          r={radius - 1}
          fill="none"
          stroke="red"
          strokeWidth={radius / 2 + 6}
          strokeDasharray={`${arcLength} ${gapLength}`}
          strokeDashoffset="0"
          transform="rotate(-90 50 50)"
          strokeLinecap="butt"
        />

        <Circle
          cx="50"
          cy="50"
          r={radius + radius / 2 - 6}
          strokeWidth="3"
          stroke="#ccc"
          fill="none"
          opacity={0.15}
        />
        <Circle
          cx="50"
          cy="50"
          r={radius - radius / 2 + 5}
          strokeWidth="3"
          fill="#ccc"
          opacity={0.1}
        />
        <Circle
          cx="50"
          cy="50"
          r={radius / 2 + 3}
          strokeWidth="25"
          fill="#660000"
        />

        <SvgText
          x="50"
          y="51.5"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize="9"
          fill="white"
          fontWeight="bold"
        >
          {displayTime}
        </SvgText>

        {ticks.map((t, idx) => (
          <React.Fragment key={idx}>
            <Line
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke="#ffcccc"
              strokeWidth="0.5"
              opacity={0.6}
            />
            {idx % 5 === 0 && (
              <SvgText
                x={t.lx}
                y={t.ly}
                fill="#ffcccc"
                fontSize="2.5"
                fontWeight="bold"
                textAnchor="middle"
                alignmentBaseline="middle"
                opacity={0.8}
              >
                {t.label}
              </SvgText>
            )}
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  timerContainer: {
    width: "100%",
    height: "100%",
  },
});
