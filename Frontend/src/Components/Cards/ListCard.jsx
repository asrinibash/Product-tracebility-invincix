import React from 'react';
import { Card } from '../Ui/Card';

export const ListCard = ({ 
  title, 
  icon: Icon,
  action,
  items,
  renderItem 
}) => (
  <Card>
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5" />}
          {title}
        </h2>
        {action}
      </div>
      <div className="space-y-4">
        {items.map((item) => renderItem(item))}
      </div>
    </div>
  </Card>
);