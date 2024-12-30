import React, { FC, ReactNode, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const [isInternalOpen, setIsInternalOpen] = useState(isOpen);

  useEffect(() => {
    setIsInternalOpen(isOpen);
  }, [isOpen]);


  // Validate props
  if (typeof isOpen !== 'boolean') {
    console.error('Modal: isOpen prop must be a boolean.');
    return null;
  }
  if (typeof onClose !== 'function') {
    console.error('Modal: onClose prop must be a function.');
    return null;
  }
  if (title && typeof title !== 'string') {
    console.error('Modal: title prop must be a string.');
      return null;
  }

    const handleClose = () => {
        setIsInternalOpen(false);
        onClose();
    };


  return (
      <Transition appear show={isInternalOpen} as={React.Fragment}>
          <Dialog as="div" className="relative z-50" onClose={handleClose}>
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-150"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-50" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={React.Fragment}
                  enter="ease-out duration-150"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-150"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-background p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-text"
                    >
                      {title || 'Modal'}
                    </Dialog.Title>
                    <div className="mt-2 overflow-auto max-h-[70vh]">
                      {children}
                    </div>

                    <div className="mt-4">
                      <Button text="Close" onClick={handleClose} variant="secondary" />
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
  );
};

export default Modal;