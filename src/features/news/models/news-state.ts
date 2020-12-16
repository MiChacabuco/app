import { News, NewsKey } from './news';

export interface NewsState {
  news: {
    ids: string[];
    byId: {
      [id: string]: News;
    };
    lastEvaluatedKey?: NewsKey;
    lastFetch: number;
  };
}
