import { Linking, PixelRatio, Platform } from 'react-native';

import { format, isToday, isTomorrow } from 'date-fns';
import { es } from 'date-fns/locale';
const Frisbee = require('frisbee');

import { Pagination } from './models/Pagination';
import environment from './environment';
import { Point } from './features/businesses/models/business';

export const api = new Frisbee({
  baseURI: environment.getApiUrl(),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const admin = new Frisbee({
  baseURI: environment.getAdminUrl(),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  stringify: {
    addQueryPrefix: true,
    arrayFormat: 'brackets',
  },
});

export const newsClient = new Frisbee({
  baseURI: 'https://q978aqlz8b.execute-api.sa-east-1.amazonaws.com/v1',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const openURL = (url: string) => {
  return Linking.openURL(url);
};

export const call = (number: string): Promise<any> => {
  return openURL(`tel:${number}`);
};

export const sendWhatsapp = (to: string): Promise<any> => {
  // Clean number
  // INPUT: (0123) 15-456789 | OUTPUT: 123456789
  const regex = new RegExp(/\((?:0)?(.*)\) (?:15-)?(.*)/);
  // Join groups
  to = regex
    .exec(to)
    .slice(1)
    .join('');
  const url = `https://wa.me/549${to}`;
  return openURL(url);
};

export const sendEmail = (to: string): Promise<any> => {
  const url = `mailto:${to}`;
  return openURL(url);
};

export const openInstagram = (instagram: string): Promise<any> => {
  const url = `https://instagram.com/${instagram}`;
  return openURL(url);
};

export const openFacebook = (pageId: string): Promise<any> => {
  // Try to open the app
  const noun = Platform.select({
    ios: 'profile',
    android: 'page',
  });
  let url = `fb://${noun}/${pageId}`;
  return openURL(url).catch(() => {
    // Fallback to web version
    url = `https://facebook.com/${pageId}`;
    return openURL(url);
  });
};

export const openLocation = (location: Point, label = ''): Promise<any> => {
  const [lon, lat] = location;
  const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
  const latLng = `${lat},${lon}`;
  let url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`,
  });
  return openURL(url).catch(() => {
    // No Geo app installed, open Google Maps web.
    url = `https://www.google.com/maps/search/?api=1&query=${latLng}`;
    return openURL(url);
  });
};

interface GetImageParams {
  dimensions: {
    width?: number;
    height?: number;
  };
  quality: number;
}

export const getImage = (
  url: string,
  params: Partial<GetImageParams> = {}
): string => {
  const regex = new RegExp(/^(http[s]?:\/\/[^/]+)(.*)/);
  const [origin, path] = regex.exec(url).slice(1);
  let output = [origin];
  if (params.dimensions) {
    const { width = 0, height = 0 } = params.dimensions;
    const pixelRatio = Math.round(PixelRatio.get()); // Rounded
    output.push(`/fit-in/${width * pixelRatio}x${height * pixelRatio}`);
  }
  if (params.quality) {
    const quality = Math.min(params.quality, 100);
    output.push(`/filters:quality(${quality})`);
  }
  output.push(path);
  return output.join('');
};

export const titleCase = (input: string): string => {
  return `${input[0].toUpperCase()}${input.slice(1)}`;
};

export const prettyDate = (date: Date, withHour = true): string => {
  let result = '';
  let day: string;
  if (isToday(date)) {
    day = 'hoy';
  } else if (isTomorrow(date)) {
    day = 'mañana';
  } else {
    day = format(date, 'EEEE d/M', { locale: es });
  }
  result = day;
  if (withHour) {
    const hour = format(date, 'H:mm');
    result += `, ${hour}hs`;
  }
  return titleCase(result);
};

export const formatDistance = (distance: number) => {
  if (distance < 1000) {
    // Meters
    return `${Math.round(distance)}m`;
  } else {
    // Kilometers
    const kilometers = distance / 1000;
    return `${kilometers.toFixed(1)}km`;
  }
};

export const embedYouTube = (url: string) => {
  return url.replace('watch?v=', 'embed/');
};

export const setTimeoutWorkaround = func => {
  setTimeout(() => {
    func();
  }, 0);
};
