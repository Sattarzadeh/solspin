"use client";
import React from "react";

interface Bet {
  id: string;
  amount: number;
  gameType: string;
  outcome: string;
  time: string;
}

interface BetHistoryTableProps {
  bets: Bet[];
}

const BetHistoryTable: React.FC<BetHistoryTableProps> = ({ bets }) => {
  return (
    <div className="overflow-x-auto overflow-y-auto">
      <table className="min-w-full text-gray-300">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
              Outcome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
              Time
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-500">
          {bets.map((bet, index) => (
            <tr key={bet.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{bet.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className="flex items-center">
                  <span className="text-yellow-500 mr-1">◆</span>
                  {bet.amount.toFixed(2)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{bet.gameType}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span>
                  {bet.outcome}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{bet.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BetHistoryTable;
