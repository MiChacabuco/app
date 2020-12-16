import React from 'react';

import { createStackNavigator } from 'react-navigation-stack';

import HomeScreen from './screens/home/HomeScreen';
import EventsListScreen from '../events/screens/events-list/EventsListScreen';
import HeaderMenu from './screens/home/components/HeaderMenu';
import { defaultNavigationOptions } from '../../config';
import EventDetailScreen from '../events/screens/event-detail/EventDetailScreen';
import WebViewScreen from '../../screens/WebViewScreen';
import NewsScreen from '../news/screens/news/NewsScreen';
import BusinessesListScreen from '../businesses/screens/businesses-list/BusinessesListScreen';
import { BusinessDetail } from '../businesses/stack';
import AboutUsScreen from './screens/contact/AboutUsScreen';

const HomeStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        title: 'MiChacabuco',
        headerRight: () => <HeaderMenu />,
      },
    },
    Pharmacies: {
      screen: BusinessesListScreen,
      navigationOptions: {
        title: 'Farmacias',
      },
      params: {
        isSlim: true,
        subtitleField: 'address',
        queryParams: { search: 'farmacias' },
      },
    },
    IceCreams: {
      screen: BusinessesListScreen,
      navigationOptions: {
        title: 'Heladerías',
      },
      params: {
        queryParams: { search: 'heladerias' },
      },
    },
    Deliveries: {
      screen: BusinessesListScreen,
      navigationOptions: {
        title: 'Delivery',
      },
      params: {
        queryParams: { 'filter{has_delivery}': true },
      },
    },
    Taxi: {
      screen: BusinessesListScreen,
      navigationOptions: {
        title: 'Remiserías',
      },
      params: {
        queryParams: { search: 'remiserias' },
      },
    },
    UsefulNumbers: {
      screen: BusinessesListScreen,
      navigationOptions: {
        title: 'Números útiles',
      },
      params: {
        queryParams: { 'filter{is_useful}': true },
      },
    },
    EventsList: {
      screen: EventsListScreen,
      path: 'events/:source',
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam('title', ''),
      }),
    },
    EventDetail: {
      screen: EventDetailScreen,
      path: 'events/:source/:eventId',
      navigationOptions: {
        title: 'Información',
      },
    },
    News: {
      screen: NewsScreen,
      path: 'news',
    },
    NewsDetail: {
      screen: NewsScreen,
      path: 'news/:createdAt',
    },
    BusinessDetail,
    AboutUs: {
      screen: AboutUsScreen,
    },
    WebViewScreen,
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions,
  }
);

export default HomeStack;
