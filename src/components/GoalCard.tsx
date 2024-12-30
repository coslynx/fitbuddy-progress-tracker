import React, { FC } from 'react';

interface GoalCardProps {
  id: string;
  name: string;
  target: number;
  progress: number;
}

const GoalCard: FC<GoalCardProps> = ({ id, name, target, progress }) => {
  // Validate props
  if (typeof id !== 'string' || id.trim() === '') {
    console.error('GoalCard: id prop must be a non-empty string.');
    return null;
  }
  if (typeof name !== 'string' || name.trim() === '') {
    console.error('GoalCard: name prop must be a non-empty string.');
    return null;
  }
  if (typeof target !== 'number' || target < 0) {
    console.error('GoalCard: target prop must be a number greater or equal to 0.');
    return null;
  }
  if (typeof progress !== 'number' || progress < 0) {
    console.error('GoalCard: progress prop must be a number greater or equal to 0.');
    return null;
  }

  const percentage = target === 0 ? 0 : (progress / target) * 100;
    const roundedPercentage = Math.min(100, Math.max(0, Math.round(percentage)));

  return (
    <div className="bg-background rounded shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold text-text mb-2">{name}</h3>
      <div className="bg-gray-200 rounded-full h-2 mb-2">
          <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${roundedPercentage}%` }}
          ></div>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
          <span>{progress}</span>
        <span>/</span>
        <span>{target}</span>
      </div>
    </div>
  );
};

export default GoalCard;