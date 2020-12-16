import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import base64 from 'react-native-base64';

import { NewsState } from './models/news-state';
import { News, NewsKey } from './models/news';
import { DynamoDbResponse } from '../../models/response';
import { newsClient } from '../../utils';
import appSlice from '../../reducers/slices';

const initialState: NewsState = {
  news: {
    ids: [],
    byId: {},
    lastEvaluatedKey: null,
    lastFetch: null,
  },
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    fetchNewsSuccess(
      state: NewsState,
      action: PayloadAction<{
        response: DynamoDbResponse<News, NewsKey>;
        append: boolean;
      }>
    ) {
      state.news.lastFetch = new Date().getTime();
      const { response, append } = action.payload;
      const { Items, LastEvaluatedKey } = response.body;
      if (!append) {
        state.news.ids = [];
        state.news.byId = {};
      }
      Items.forEach(news => {
        const id = news.Id;
        if (!state.news.byId[id]) {
          // Add id only if it doesn't exist yet
          state.news.ids.push(id);
        }
        state.news.byId[id] = news;
      });
      state.news.lastEvaluatedKey = LastEvaluatedKey;
    },
  },
});

const { actions } = newsSlice;

export type FetchNewsParams = Partial<{
  Source: string;
  CreatedAt: string;
  Limit: number;
  ProjectionExpression: string;
  ExclusiveStartKey: string;
}>;

const fetchNews = (params: FetchNewsParams = {}) => async (
  dispatch
): Promise<DynamoDbResponse<News, NewsKey>> => {
  return doFetchNews(params, false, dispatch);
};

const fetchNextNews = () => async (
  dispatch,
  getState
): Promise<DynamoDbResponse<News, NewsKey>> => {
  const state: { news: NewsState } = getState();
  const { lastEvaluatedKey } = state.news.news;
  if (!lastEvaluatedKey) {
    return;
  }
  const keyBase64: string = base64.encode(JSON.stringify(lastEvaluatedKey));
  const params: FetchNewsParams = {
    ExclusiveStartKey: keyBase64,
  };

  return doFetchNews(params, true, dispatch);
};

const doFetchNews = (params: FetchNewsParams, append: boolean, dispatch) => {
  params = {
    Source: 'gobierno', // TODO: Remove default
    ...params,
  };
  return newsClient
    .get('/news', { params })
    .then((response: DynamoDbResponse<News, NewsKey>) => {
      dispatch(actions.fetchNewsSuccess({ response, append }));
      return response;
    })
    .catch(e => {
      dispatch(
        appSlice.actions.showSnackbar({
          text: 'Error al obtener la información',
          type: 'error',
        })
      );
      throw e;
    });
};

actions['fetchNews'] = fetchNews;
actions['fetchNextNews'] = fetchNextNews;

export default newsSlice;
