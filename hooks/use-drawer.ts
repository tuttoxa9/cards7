import { create } from 'zustand';
import React from 'react';

interface DrawerState {
  isOpen: boolean;
  Component: React.ElementType | null;
  props: Record<string, any>;
  size: 'default' | 'wide';
  title: string;
  openDrawer: (
    Component: React.ElementType,
    props?: Record<string, any>,
    options?: { size?: 'default' | 'wide'; title?: string }
  ) => void;
  closeDrawer: () => void;
}

export const useDrawer = create<DrawerState>((set) => ({
  isOpen: false,
  Component: null,
  props: {},
  size: 'default',
  title: '',
  openDrawer: (Component, props = {}, options = {}) =>
    set({
      isOpen: true,
      Component,
      props,
      size: options.size || 'default',
      title: options.title || '',
    }),
  closeDrawer: () =>
    set({
      isOpen: false,
      // Reset component after a delay to allow for exit animation
      Component: null,
      props: {},
    }),
}));