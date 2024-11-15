import React from 'react';
import { Card } from '../Ui/Card';

export const InfoCard = ({ title, items }) => (
  <Card className="p-6">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    {items.map((item, index) => (
      <p key={index} className="text-gray-600 mb-2">
        {item.icon} {item.text}
      </p>
    ))}
  </Card>
);