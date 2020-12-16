import React from 'react';

import { Button, Dialog, Portal } from 'react-native-paper';
import { theme } from '../theme';

interface ConfirmationDialogProps {
  title: string;
  isVisible: boolean;
  onConfirm: () => void;
  onReject: () => void;
  confirmText?: string;
  rejectText?: string;
  children: React.ReactNode;
}

const ConfirmationDialog = (props: ConfirmationDialogProps) => (
  <Portal>
    <Dialog visible={props.isVisible} onDismiss={props.onReject}>
      <Dialog.Title>{props.title}</Dialog.Title>
      <Dialog.Content>{props.children}</Dialog.Content>
      <Dialog.Actions>
        <Button onPress={props.onReject} color={theme.colors.error}>
          {props.rejectText || 'Cancelar'}
        </Button>
        <Button onPress={props.onConfirm} color={theme.colors.accent}>
          {props.confirmText || 'Aceptar'}
        </Button>
      </Dialog.Actions>
    </Dialog>
  </Portal>
);

export default ConfirmationDialog;
