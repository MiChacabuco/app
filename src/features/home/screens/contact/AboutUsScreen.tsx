import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Text, Paragraph, Subheading } from 'react-native-paper';

import Link from '../../../../components/Link';
import { openLocation } from '../../../../utils';
import { theme } from '../../../../theme';
import environment from '../../../../environment';

const AboutUsScreen = () => (
  <View style={styles.container}>
    <View style={{ alignItems: 'center' }}>
      <Paragraph style={{ textAlign: 'center', marginBottom: 16 }}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
          MiChacabuco
        </Text>{' '}
        es una app con información sobre la ciudad de Chacabuco, Buenos Aires.
      </Paragraph>
      <Button
        mode="outlined"
        icon="map"
        onPress={() => openLocation(environment.cityLocation, 'Chacabuco')}
        style={{ borderColor: theme.colors.primary }}
      >
        Ubicación
      </Button>
    </View>

    <View style={{ alignItems: 'center', marginTop: 56 }}>
      <Subheading style={{ letterSpacing: 1 }}>CONTACTO</Subheading>
      <Paragraph style={{ textAlign: 'center' }}>
        Si tenés alguna duda o sugerencia podés escribirnos al siguiente email.
      </Paragraph>
      <View style={{ marginTop: 8 }}>
        <Link
          text={environment.contactEmail}
          url={`mailto:${environment.contactEmail}`}
          style={styles.email}
        />
      </View>
    </View>
  </View>
);
AboutUsScreen.navigationOptions = {
  title: 'Sobre nosotros',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 40,
  },
  email: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AboutUsScreen;
