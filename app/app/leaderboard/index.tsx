import React, { useEffect, useState } from 'react';
import { LeaderboardEntry } from '../../../types/leaderboard';
import { getApiDomain } from '../../../utils/domain';
import { useAuth } from '../../../hooks/useAuth';

export default function LeaderboardPage() {
  const [fullLeaderboard, setFullLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [displayLeaderboard, setDisplayLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${getApiDomain()}/api/leaderboard`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard');
        }
        const data: LeaderboardEntry[] = await response.json();
        const currentUsername = currentUser?.username;
        const sortedLeaderboard = [...data].sort((a, b) => {
          if (b.level !== a.level) return b.level - a.level;
          if (b.experience !== a.experience) return b.experience - a.experience;
          return a.username.localeCompare(b.username);
        });
        setFullLeaderboard(sortedLeaderboard);
        
        const top10 = sortedLeaderboard.slice(0, 10);
        setDisplayLeaderboard(top10);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [currentUser?.username]);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
        <p className="text-primary">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="font-bold mb-4 text-white">Leaderboard</h2>
      <div className="space-y-2">
        {displayLeaderboard.map((entry) => {
          const actualRank = fullLeaderboard.findIndex(e => e.username === entry.username) + 1;
          
          return (
            <div key={entry.username}>
              <div className="flex justify-between items-center p-4 bg-card rounded">
                <div className="flex items-center">
                  <span className="font-bold mr-4 text-primary">#{actualRank}</span>
                  <span className="text-primary">{entry.username}</span>
                </div>
                <div className="text-right">
                  <span className="text-primary">Level {entry.level}</span>
                  <span className="ml-4 text-primary">{entry.experience} XP</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}