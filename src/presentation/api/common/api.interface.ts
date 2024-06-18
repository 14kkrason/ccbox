export interface ApiResponse<T> {
  data: T;
  success: boolean;
  statusCode?: number;
  message?: string;
  error?: string;
}