import React from 'react';
import { Card } from '../Ui/Card';

export const ProfileCard = ({ image, alt = "Profile" }) => (
  <Card className="p-6">
    <div className="w-32 h-32 mx-auto rounded-full bg-gray-200 overflow-hidden">
      <img
        src={image}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  </Card>
);