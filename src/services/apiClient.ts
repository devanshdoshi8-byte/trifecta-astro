import {
  ResolvedTarget,
  TrifectaAssessmentReport,
  AnalysisProgressEvent
} from '../types/astrophysics';

const getBackendBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return '/api';
    }
  }
  return 'http://127.0.0.1:8000/api';
};

const BACKEND_BASE_URL = getBackendBaseUrl();

export class TrifectaApiClient {
  /**
   * Health check to see if local Python scientific backend is running
   */
  public static async checkHealth(): Promise<boolean> {
    try {
      const resp = await fetch(`${BACKEND_BASE_URL}/health`, { signal: AbortSignal.timeout(1500) });
      return resp.ok;
    } catch {
      return false;
    }
  }

  /**
   * Resolve any target identifier
   */
  public static async resolveTarget(query: string, sector?: number): Promise<ResolvedTarget> {
    const resp = await fetch(`${BACKEND_BASE_URL}/targets/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, requested_sector: sector })
    });
    if (!resp.ok) {
      throw new Error(`Failed to resolve target (${resp.statusText})`);
    }
    return await resp.json();
  }

  /**
   * Start a full 13-stage scientific analysis
   */
  public static async startAnalysis(
    query: string,
    sector?: number,
    onProgress?: (event: AnalysisProgressEvent) => void
  ): Promise<TrifectaAssessmentReport> {
    const startResp = await fetch(`${BACKEND_BASE_URL}/analysis/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, requested_sector: sector })
    });

    if (!startResp.ok) {
      throw new Error(`Failed to start analysis (${startResp.statusText})`);
    }

    const { analysis_id } = await startResp.json();

    // Poll or stream progress until complete
    return new Promise<TrifectaAssessmentReport>((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const progResp = await fetch(`${BACKEND_BASE_URL}/analysis/${analysis_id}/progress`);
          if (progResp.ok) {
            const progEvent: AnalysisProgressEvent = await progResp.json();
            onProgress?.(progEvent);

            if (progEvent.stage === 'COMPLETE') {
              clearInterval(interval);
              const resultResp = await fetch(`${BACKEND_BASE_URL}/analysis/${analysis_id}/result`);
              if (resultResp.ok) {
                const report: TrifectaAssessmentReport = await resultResp.json();
                resolve(report);
              } else {
                reject(new Error('Failed to retrieve finalized analysis report.'));
              }
            } else if (progEvent.stage === 'ERROR') {
              clearInterval(interval);
              reject(new Error(progEvent.message || 'Analysis failed.'));
            }
          }
        } catch (err) {
          clearInterval(interval);
          reject(err);
        }
      }, 350);
    });
  }
}
