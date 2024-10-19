export interface BaseResponse<T> {
  info: {
    count: number;
    pages: number;
    next: string;
    prev: null;
  };
  results: T[];
}
