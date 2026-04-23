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
        setFullLeaderboard(data);
        
        const top10 = data.slice(0, 10);
        const currentUserEntry = data.find(entry => entry.username === currentUser?.username);
        
        if (currentUserEntry && !top10.some(entry => entry.username === currentUser?.username)) {
          setDisplayLeaderboard([...top10, { ...currentUserEntry, isCurrentUser: true }]);
        } else {
          setDisplayLeaderboard(top10);
        }
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
        <h1 className="text-2xl font-bold text-primary">Leaderboard</h1>
        <p className="text-primary">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-primary">Leaderboard</h1>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-primary">Leaderboard</h1>
      <div className="space-y-2">
        {displayLeaderboard.map((entry, index) => {
          const actualRank = fullLeaderboard.findIndex(e => e.username === entry.username) + 1;
          
          return (
            <div key={entry.username}>
              {entry.isCurrentUser && index > 0 && (
                <div className="flex items-center my-2">
                  <div className="flex-1 border-t border-border"></div>
                  <span className="px-4 text-sm text-muted-foreground">Your Rank</span>
                  <div className="flex-1 border-t border-border"></div>
                </div>
              )}
              <div className={`flex justify-between items-center p-4 bg-card rounded ${entry.isCurrentUser ? 'ring-2 ring-primary' : ''}`}>
                <div className="flex items-center">
                  <span className="font-bold mr-4 text-primary">#{actualRank}</span>
                  <span className={`text-primary ${entry.isCurrentUser ? 'font-semibold' : ''}`}>{entry.username}</span>
                  {entry.isCurrentUser && <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">You</span>}
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