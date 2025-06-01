// components/TabBarIcon.tsx
import React from 'react';
import { FontAwesome } from '@expo/vector-icons'; // Or any other icon library

interface TabBarIconProps {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}

export default function TabBarIcon({ name, color }: TabBarIconProps) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} name={name} color={color} />;
}
