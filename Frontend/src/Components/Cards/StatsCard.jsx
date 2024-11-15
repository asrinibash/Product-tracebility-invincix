import React from 'react';
import { Card } from '../Ui/Card';

export const StatsCard = ({ stats }) => (
  <Card className="p-6">
    <div className="grid grid-cols-3 gap-4 text-center">
      {stats.map((stat, index) => (
        <div key={index}>
          <p className="text-3xl font-bold">{stat.value}</p>
          <p className="text-sm text-gray-600">{stat.label}</p>
        </div>
      ))}
    </div>
  </Card>
);