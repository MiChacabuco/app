export interface Environment {
  apiHost: string;
  apiVersion: string;
  getApiUrl: () => string;
  getAdminUrl: () => string;
  adminHost: string;
  adminVersion: string;
  schema: string;
  contactEmail: string;
  cityLocation: number[];
  androidStoreUrl: string;
  subscriptionFormUrl: string;
  taxiCategory: string;
  iceCreamsCategory: string;
  pharmaciesCategory: string;
}

const common = {
  apiVersion: 'v2',
  adminVersion: 'v1',
  schema: 'michacabuco://',
  contactEmail: 'hola@michacabuco.com',
  cityLocation: [-34.64201, -60.471279],
  androidStoreUrl:
    'https://play.google.com/store/apps/details?id=com.abeleyra.michacabuco',
  subscriptionFormUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLSe5DJUOlBMdxDw0ZSiwYuheZ-ZaSk8yraCVhWBSx4Y7lPz7yw/viewform',
  taxiCategory: '5e2b7e837873c536855e3bea',
  iceCreamsCategory: '5e2908b834357cd1aabba6da',
  pharmaciesCategory: '5e4fea87df27824c74a43255',
};

const localIp = '192.168.0.131';

const ENV = {
  dev: {
    ...common,
    apiHost: `http://${localIp}:5000`,
    adminHost: `http://${localIp}:8000/api`,
    getApiUrl: () => `${ENV.dev.apiHost}/${common.apiVersion}`,
    getAdminUrl: () => `${ENV.dev.adminHost}/${common.adminVersion}/`,
  },
  prod: {
    ...common,
    apiHost: `https://api.michacabuco.com`,
    adminHost: `https://admin.michacabuco.com/api`,
    getApiUrl: () => `${ENV.prod.apiHost}/${common.apiVersion}`,
    getAdminUrl: () => `${ENV.prod.adminHost}/${common.adminVersion}/`,
  },
};

const environment: Environment = __DEV__ ? ENV.dev : ENV.prod;
export default environment;
