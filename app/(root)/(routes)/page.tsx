'use client'

import { Modal } from '@/components/ui/modal';
import { UserButton } from '@clerk/nextjs';
import { useStoreModal } from '../../hooks/useStoreModal';
import { useEffect } from 'react';

const SetupPage = () => {

  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if(!isOpen){
      onOpen();
    }
  },[isOpen,onOpen]);

  return null;
}

export default SetupPage;
