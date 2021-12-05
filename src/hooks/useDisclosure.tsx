import { useState } from 'react';

const useDisclosure = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onOpen = () => setIsOpen(true);

  const onClose = () => setIsOpen(false);

  const onToggle = () => setIsOpen((prevState) => !prevState);

  return { onOpen, onClose, onToggle, isOpen };
};

export default useDisclosure;
