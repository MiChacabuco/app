interface FullApiRequestParams {
  where: any;
  page: number;
  max_results: number;
  sort: string;
  aggregate: any;
}

export type ApiRequestParams = Partial<FullApiRequestParams>;

interface FullAdminRequestParams {
  limit: number;
  offset: number;
}

export type AdminRequestParams = Partial<FullAdminRequestParams>;
