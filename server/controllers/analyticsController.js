const { BetaAnalyticsDataClient } = require('@google-analytics/data');

let analyticsClient;

function getAnalyticsClient() {
  if (analyticsClient) return analyticsClient;
  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  if (credentialsJson) {
    try {
      const creds = JSON.parse(credentialsJson);
      analyticsClient = new BetaAnalyticsDataClient({ credentials: creds });
    } catch (err) {
      // Fallback to default ADC if parsing fails
      analyticsClient = new BetaAnalyticsDataClient();
    }
  } else {
    analyticsClient = new BetaAnalyticsDataClient();
  }
  return analyticsClient;
}

function parseMetric(rows, metricName) {
  if (!rows || !rows[0] || !rows[0].metricValues) return 0;
  const headers = rows[0].metricValues.map((_, idx) => idx);
  // Try to find metric by position when single metric, else rely on name mapping below
  if (rows[0].metricValues.length === 1) {
    const v = rows[0].metricValues[0]?.value;
    return v ? Number(v) : 0;
  }
  // When multiple metrics, try to find index by name from metadata (not available in simple response),
  // so assume ordering matches request
  return 0; // unused in multi-metric parsing below
}

exports.getAnalyticsOverview = async (req, res) => {
  const propertyId = process.env.GA4_PROPERTY_ID || process.env.GA_PROPERTY_ID;
  if (!propertyId) {
    return res.status(400).json({ msg: 'GA4 property ID is not configured (set GA4_PROPERTY_ID)' });
  }
  try {
    const client = getAnalyticsClient();
    const property = `properties/${propertyId}`;

    const [realtimeResp, todayResp, last7Resp, last7EngagementResp] = await Promise.all([
      client.runRealtimeReport({
        property,
        metrics: [{ name: 'activeUsers' }],
      }),
      client.runReport({
        property,
        dateRanges: [{ startDate: 'today', endDate: 'today' }],
        metrics: [
          { name: 'totalUsers' },
          { name: 'newUsers' },
          { name: 'sessions' },
        ],
      }),
      client.runReport({
        property,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        metrics: [
          { name: 'totalUsers' },
          { name: 'newUsers' },
          { name: 'sessions' },
        ],
      }),
      client.runReport({
        property,
        dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
        metrics: [
          { name: 'engagedSessions' },
          { name: 'engagementRate' },
          { name: 'averageSessionDuration' },
          { name: 'screenPageViews' },
          { name: 'bounceRate' },
        ],
      }),
    ]);

    const realtime = {
      activeUsers: Number(realtimeResp[0]?.rows?.[0]?.metricValues?.[0]?.value || 0),
    };

    const trafficToday = {
      users: Number(todayResp[0]?.rows?.[0]?.metricValues?.[0]?.value || 0),
      newUsers: Number(todayResp[0]?.rows?.[0]?.metricValues?.[1]?.value || 0),
      sessions: Number(todayResp[0]?.rows?.[0]?.metricValues?.[2]?.value || 0),
    };

    const traffic7d = {
      users: Number(last7Resp[0]?.rows?.[0]?.metricValues?.[0]?.value || 0),
      newUsers: Number(last7Resp[0]?.rows?.[0]?.metricValues?.[1]?.value || 0),
      sessions: Number(last7Resp[0]?.rows?.[0]?.metricValues?.[2]?.value || 0),
    };

    const engagement7d = {
      engagedSessions: Number(last7EngagementResp[0]?.rows?.[0]?.metricValues?.[0]?.value || 0),
      engagementRate: Number(last7EngagementResp[0]?.rows?.[0]?.metricValues?.[1]?.value || 0),
      averageSessionDuration: Number(last7EngagementResp[0]?.rows?.[0]?.metricValues?.[2]?.value || 0),
      screenPageViews: Number(last7EngagementResp[0]?.rows?.[0]?.metricValues?.[3]?.value || 0),
      bounceRate: Number(last7EngagementResp[0]?.rows?.[0]?.metricValues?.[4]?.value || 0),
    };

    res.json({ realtime, trafficToday, traffic7d, engagement7d });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch analytics', error: err.message });
  }
};


