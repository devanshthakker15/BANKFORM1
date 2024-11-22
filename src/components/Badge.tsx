import React from "react";

interface BadgeProps {
  badgeType?: string;
  badgeText: string;
  badgeColor?: string;
  badgeBackgroundColor?: string;
}

const Badge: React.FC<BadgeProps> = ({
  badgeType,
  badgeText,
  badgeColor,
  badgeBackgroundColor,
}) => {
  return (
    <span
      className={`badge bg-${badgeType}`}
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
