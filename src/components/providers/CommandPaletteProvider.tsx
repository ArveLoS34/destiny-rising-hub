'use client';

import { CommandPalette, useCommandPalette } from '@/features/discovery/components/CommandPalette';

export function CommandPaletteProvider() {
  const { isOpen, close } = useCommandPalette();

  return <CommandPalette isOpen={isOpen} onClose={close} />;
}
