import type { DashboardStats, TimeSeriesData } from '@/types/domain';

/**
 * Admin Dashboard Service
 * Provides statistics and metrics for the admin dashboard
 */

class DashboardService {
  // Mock data - in production, this would come from analytics database
  private getMockStats(): DashboardStats {
    return {
      dailyActiveUsers: 1247,
      onlineUsers: 89,
      newRegistrations: 45,
      newBuilds: 23,
      newGuides: 8,
      newComments: 156,
      reportedContent: 3,
      pendingReports: 2,
      aiUsageCount: 892,
      systemHealth: 'healthy',
      lastUpdated: new Date().toISOString(),
    };
  }

  getStats(): DashboardStats {
    return this.getMockStats();
  }

  getUserGrowth(days: number = 30): TimeSeriesData[] {
    const data: TimeSeriesData[] = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      data.push({
        timestamp: date.toISOString(),
        value: Math.floor(Math.random() * 50) + 20, // Mock: 20-70 new users per day
        label: date.toLocaleDateString(),
      });
    }
    
    return data;
  }

  getContentGrowth(days: number = 30): {
    builds: TimeSeriesData[];
    guides: TimeSeriesData[];
    comments: TimeSeriesData[];
  } {
    const builds: TimeSeriesData[] = [];
    const guides: TimeSeriesData[] = [];
    const comments: TimeSeriesData[] = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const timestamp = date.toISOString();
      
      builds.push({
        timestamp,
        value: Math.floor(Math.random() * 30) + 10,
        label: date.toLocaleDateString(),
      });
      
      guides.push({
        timestamp,
        value: Math.floor(Math.random() * 10) + 2,
        label: date.toLocaleDateString(),
      });
      
      comments.push({
        timestamp,
        value: Math.floor(Math.random() * 200) + 50,
        label: date.toLocaleDateString(),
      });
    }
    
    return { builds, guides, comments };
  }

  getTopContent(type: 'characters' | 'builds' | 'guides' | 'weapons', limit: number = 10): any[] {
    // Mock data
    const mockData = {
      characters: [
        { id: 'dr-char-001', name: 'Nova', views: 45230, likes: 2340 },
        { id: 'dr-char-015', name: 'Phantom', views: 38920, likes: 1980 },
        { id: 'dr-char-003', name: 'Aurora', views: 32150, likes: 1650 },
      ],
      builds: [
        { id: 'build-001', name: 'Nova Burst Build', views: 12450, likes: 890 },
        { id: 'build-002', name: 'Phantom Max Build', views: 10230, likes: 756 },
      ],
      guides: [
        { id: 'guide-001', name: "Beginner's Guide", views: 15420, likes: 892 },
        { id: 'guide-002', name: 'Farming Guide', views: 8930, likes: 567 },
      ],
      weapons: [
        { id: 'dr-weap-001', name: 'Stellar Inferno', views: 28340, likes: 1450 },
        { id: 'dr-weap-002', name: 'Void Reaper', views: 24560, likes: 1230 },
      ],
    };
    
    return mockData[type].slice(0, limit);
  }

  getRecentActivity(limit: number = 20): any[] {
    const activities = [
      { type: 'user_registered', userId: 'user-123', userName: 'Player1', timestamp: new Date().toISOString() },
      { type: 'build_created', userId: 'user-456', userName: 'Builder1', contentTitle: 'Nova Burst', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { type: 'guide_published', userId: 'user-789', userName: 'Writer1', contentTitle: 'Farming Guide', timestamp: new Date(Date.now() - 7200000).toISOString() },
      { type: 'comment_added', userId: 'user-101', userName: 'Commenter1', contentTitle: 'Nova Build', timestamp: new Date(Date.now() - 10800000).toISOString() },
    ];
    
    return activities.slice(0, limit);
  }

  getSystemHealth(): {
    status: 'healthy' | 'warning' | 'critical';
    components: Record<string, { status: string; value: string; message?: string }>;
  } {
    return {
      status: 'healthy',
      components: {
        database: { status: 'healthy', value: '45ms', message: 'PostgreSQL' },
        api: { status: 'healthy', value: '12ms', message: 'Response time' },
        search: { status: 'healthy', value: '23ms', message: 'Search index' },
        cache: { status: 'healthy', value: '2ms', message: 'Redis' },
        ai: { status: 'healthy', value: '892', message: 'Requests today' },
      },
    };
  }
}

export const dashboardService = new DashboardService();
