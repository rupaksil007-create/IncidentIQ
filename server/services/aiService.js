/**
 * IncidentIQ AI Service
 * Handles dynamic incident analysis and contextual chat responses.
 */

const generateIncidentAnalysis = (incident) => {
  const { rootCause, affectedService, severity, logs = [], metrics = {} } = incident;
  
  // Intelligence Logic
  const isRedis = rootCause?.toLowerCase().includes('redis') || affectedService?.toLowerCase().includes('redis');
  const isOOM = rootCause?.toLowerCase().includes('oom') || metrics.health?.ram > 90;
  const isLatency = logs.some(l => l.msg?.toLowerCase().includes('timeout') || l.msg?.toLowerCase().includes('latency'));

  let analysis = "";
  let recommendations = [];

  if (isRedis) {
    analysis = `IncidentIQ detected abnormal persistence failures in Redis caused by elevated memory pressure. The ${affectedService} was unable to flush its AOF buffer, leading to potential data inconsistency.`;
    recommendations = [
      { action: 'Restart Redis replica', explanation: 'Triggers a clean AOF reload.', impact: 'Low', recovery: '2 mins' },
      { action: 'Increase persistence buffer', explanation: 'Prevent I/O blocking during high writes.', impact: 'Medium', recovery: 'Immediate' },
      { action: 'Enable Redis failover', explanation: 'Restore primary service availability.', impact: 'High', recovery: '30 secs' }
    ];
  } else if (isOOM) {
    analysis = `Critical resource exhaustion detected. The system kernel triggered an OOM-killer for the ${affectedService} process after RAM usage hit ${metrics.health?.ram || 98}%.`;
    recommendations = [
      { action: 'Scale memory limits', explanation: 'Increase K8s resource requests.', impact: 'Medium', recovery: '5 mins' },
      { action: 'Profile heap usage', explanation: 'Identify memory leaks in service code.', impact: 'High', recovery: 'Long-term' }
    ];
  } else if (isLatency) {
    analysis = `Network degradation or upstream timeout detected. Cascading failures in ${affectedService} are likely due to exhaustion of connection pools during the latency spike.`;
    recommendations = [
      { action: 'Adjust timeouts', explanation: 'Reduce client-side wait times.', impact: 'Low', recovery: 'Immediate' },
      { action: 'Enable circuit breaking', explanation: 'Prevent failure propagation.', impact: 'Medium', recovery: '30 secs' }
    ];
  } else {
    analysis = `Anomalous pattern detected in ${affectedService}. Correlating logs and metrics suggests a configuration mismatch or transient infrastructure failure.`;
    recommendations = [
      { action: 'Rollback last deploy', explanation: 'Revert to stable system state.', impact: 'High', recovery: '3 mins' },
      { action: 'Detailed trace audit', explanation: 'Inspect OpenTelemetry traces.', impact: 'Low', recovery: 'N/A' }
    ];
  }

  return { analysis, recommendations };
};

const generateChatResponse = (question, incident) => {
  const q = question.toLowerCase();
  const { rootCause, affectedService, metrics = {} } = incident;

  if (q.includes('cause') || q.includes('happen') || q.includes('why')) {
    return `The incident was triggered by ${rootCause} in the ${affectedService}. Specifically, telemetry shows ${metrics.health?.ram > 90 ? 'critical memory pressure' : 'abnormal service behavior'} which correlated with the error spikes.`;
  }

  if (q.includes('fix') || q.includes('resolve') || q.includes('how')) {
    return `I recommend the following steps: 1) Verify the health of ${affectedService}, 2) Check if any recent deployments occurred, and 3) ${metrics.health?.ram > 90 ? 'Increase the memory allocation for this node.' : 'Restart the service to clear connection pools.'}`;
  }

  if (q.includes('impact') || q.includes('blast') || q.includes('affect')) {
    return `The current blast radius is ${incident.metrics?.blastRadius || 'Medium'}. Users of the ${affectedService} are experiencing elevated error rates and latency. ${incident.metrics?.riskScore > 80 ? 'Immediate action is required to prevent total service outage.' : 'The system is partially degraded but stable.'}`;
  }

  if (q.includes('prevent') || q.includes('again')) {
    return `To prevent this in the future, we should implement auto-scaling based on memory thresholds and add more granular circuit breaking to the ${affectedService} gateway layer.`;
  }

  return `I've analyzed the ${rootCause} incident. Based on the logs and current node health (${metrics.health?.healthScore}%), the system is under stress. Is there a specific part of the telemetry you'd like me to explain?`;
};

module.exports = {
  generateIncidentAnalysis,
  generateChatResponse
};
