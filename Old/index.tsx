import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Circle, Line, Svg, Text as SvgText } from "react-native-svg";

type TimerProps = {
  duration?: number;
};

function formatMinutesSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function Timers({ duration = 60 * 25 }: TimerProps) {
  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  const [arcLength, setArcLength] = useState(0);

  const incrementPerSecond = circumference / duration;

  useEffect(() => {
    const interval = setInterval(() => {
      setArcLength((prev) => {
        const next = prev + incrementPerSecond;
        return next > circumference ? 0 : next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [circumference, incrementPerSecond]);

  const gapLength = circumference - arcLength;

  const progressRatio = arcLength / circumference;
  const elapsedSeconds = progressRatio * duration;
  const secondsLeft = Math.ceil(duration - elapsedSeconds);
  const displayTime = formatMinutesSeconds(secondsLeft);

  const tickCount = 25;
  const tickAngleIncrement = 360 / tickCount;

  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const angleDeg = i * tickAngleIncrement - 90;
    const angleRad = (angleDeg * Math.PI) / 180;

    const cx = 50;
    const cy = 50;

    const hasLabel = i % 5 === 0;

    const tickLengthLabeled = 3;
    const tickLengthUnlabeled = 1.5;

    const currentTickLength = hasLabel
      ? tickLengthLabeled
      : tickLengthUnlabeled;

    const tickStartL = radius + 11 - 4;
    const x2 = cx + tickStartL * Math.cos(angleRad);
    const y2 = cy + tickStartL * Math.sin(angleRad);

    const tickStartR = tickStartL - currentTickLength;
    const x1 = cx + tickStartR * Math.cos(angleRad);
    const y1 = cy + tickStartR * Math.sin(angleRad);

    const labelR = radius + 11 - 10;
    const lx = cx + labelR * Math.cos(angleRad);
    const ly = cy + labelR * Math.sin(angleRad);

    const label = String(tickCount - i);
    return { x1, y1, x2, y2, lx, ly, label, hasLabel };
  });

  return (
    <View style={styles.container}>
      <Svg height="100%" width="100%" viewBox="0 0 100 100">
        <Circle cx="50" cy="50" r={37} strokeWidth="25" fill="#990000" />

        <Circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="red"
          strokeWidth="25"
          strokeDasharray={`${arcLength} ${gapLength}`}
          strokeDashoffset="0"
          transform="rotate(-90 50 50)"
          strokeLinecap="butt"
        />

        <Circle
          cx="50"
          cy="50"
          r={37}
          strokeWidth="3"
          stroke="#ccc"
          fill={"none"}
          opacity={0.1}
        />
        <Circle
          cx="50"
          cy="50"
          r={21}
          strokeWidth="25"
          fill="#ccc"
          opacity={0.1}
        />
        <Circle cx="50" cy="50" r={20} strokeWidth="25" fill="#660000" />

        <SvgText
          x="50"
          y="51.5"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize="10"
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
                fontSize="3"
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
  container: {
    backgroundColor: "#fe9a8a",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
