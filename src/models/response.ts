export interface AdminPaginatedResponse<T> {
  body: {
    count: number;
    next: string;
    previous: string;
    results: T[];
  };
}

export interface AdminDynamicRestMeta {
  page: number;
  perPage: number;
  totalPages: number;
  totalResults: number;
}

export interface DynamoDbResponse<T, K> {
  body: {
    Count: number;
    Items: T[];
    ScannedCount: number;
    LastEvaluatedKey?: K;
  };
}
