import { Linking } from 'react-native';

import firebase from 'react-native-firebase';
import URI from 'urijs';

import environment from '../environment';

export const LinksHelper = {
  init() {
    firebase.links().onLink(this.handleLinkOpened);
  },
  handleLinkOpened(link: string) {
    const route = URI(link)
      .path()
      .slice(1); // Get path and remove first slash
    const url = `${environment.schema}${route}`;
    Linking.openURL(url);
  },
};
