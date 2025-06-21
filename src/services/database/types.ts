
export interface DatabaseResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
