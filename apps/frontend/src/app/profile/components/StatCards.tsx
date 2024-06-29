"use client";
import React from 'react';
import Image from 'next/image';

interface StatCardProps {
  image: string;
  title: string;
  value: number | string;
  unit?: string;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ image, title, value, unit, description }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col items-center space-y-4">
      <div className="relative w-32 h-32">
        <Image src={image} alt={title} layout="fill" objectFit="contain" />
      </div>
      <div className="text-center">
        <p className="text-gray-400">{description}</p>
        <p className="text-white font-bold text-xl">
          {unit && <span className="text-yellow-500">{unit}</span>}
          {value}
        </p>
      </div>
    </div>
  );
};

const StatCards: React.FC = () => {
  const cardsData = [
    {
        image: '/coins.png', // Example image path
        title: 'Total Wagered',
        value: '15,527.56',
        unit: '🪙', // Replace with the appropriate icon
        description: 'Total wagered',
    },
    {
        image: '/coins.png', // Example image path
        title: 'Total Profit',
        value: '2000.00',
        unit: '🪙', // Replace with the appropriate icon
        description: 'Total Profit',
    },
    {
        image: '/coins.png', //xample image path
        title: 'Total Deposited',
        value: '5141.31',
        unit: '🪙', // Replace with the appropriate icon
        description: 'Total Deposited',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {cardsData.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
};

export default StatCards;
