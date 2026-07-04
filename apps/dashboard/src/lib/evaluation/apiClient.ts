import { API_BASE_URL } from '@/services/api';
import { EvaluationRequest, EvaluationError, EvaluationErrorCodes } from './types';

export class EvaluationApiClient {
  static async evaluate(request: EvaluationRequest, signal: AbortSignal): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/rules/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: request.prompt,
          rule: request.rule,
          simulate: true,
        }),
        signal
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw this.createError(EvaluationErrorCodes.UNAUTHORIZED, 'Unauthorized request.', false);
        }
        if (response.status === 400) {
          const data = await response.json().catch(() => ({}));
          throw this.createError(EvaluationErrorCodes.VALIDATION_ERROR, data.detail?.msg || data.detail || 'Validation error from server.', false);
        }
        throw this.createError(EvaluationErrorCodes.SERVER_ERROR, `Server error: ${response.status}`, true);
      }

      return await response.json();
    } catch (e: any) {
      if (e.name === 'AbortError') {
        throw this.createError(EvaluationErrorCodes.CANCELLED, 'Request was cancelled.', false);
      }
      if (e.code && e.message) {
        throw e; // Already an EvaluationError
      }
      throw this.createError(EvaluationErrorCodes.NETWORK_ERROR, e.message || 'A network error occurred.', true);
    }
  }

  private static createError(code: string, message: string, retryable: boolean): EvaluationError {
    return { code, message, retryable };
  }
}
