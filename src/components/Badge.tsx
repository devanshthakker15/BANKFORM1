import React from "react";

interface BadgeProps {
  badgeType?: string;
  badgeSize?: string;
  badgeText: string;
  badgeColor?: string;
  badgeBackgroundColor?: string;
}

const Badge: React.FC<BadgeProps> = ({
  badgeType,
  badgeSize,
  badgeText,
  badgeColor,
  badgeBackgroundColor,
}) => {
  return (
    <span
      className={`badge bg-${badgeType} text-${badgeSize}`}
      style={{
        backgroundColor: badgeBackgroundColor,
        color: badgeColor,
      }}
    >
      {badgeText}
    </span>
  );
};

export default Badge;
