"use client";
import React, { useState, useEffect } from 'react';

interface ToastProps {
  title: string;
  description: string;
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ title, description, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-md shadow-lg">
      <h3 className="font-bold">{title}</h3>
      <p>{description}</p>
    </div>
  );
};

interface ToastOptions {
  title: string;
  description: string;
  duration?: number;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastOptions | null>(null);

  const showToast = (options: ToastOptions) => {
    setToast(options);
  };

  const ToastContainer = () => {
    if (!toast) return null;
    return (
      <Toast 
        title={toast.title}
        description={toast.description}
        duration={toast.duration}
        onClose={() => setToast(null)}
      />
    );
  };

  return { showToast, ToastContainer };
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const { showToast, ToastContainer } = useToast();
  
  useEffect(() => {
    setGlobalShowToast(showToast);
    return () => setGlobalShowToast(null);
  }, [showToast]);

  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
};

let globalShowToast: ((options: ToastOptions) => void) | null = null;

export const setGlobalShowToast = (showToastFunc: ((options: ToastOptions) => void) | null) => {
  globalShowToast = showToastFunc;
};

export const toast = (options: ToastOptions) => {
  if (globalShowToast) {
    globalShowToast(options);
  } else {
    console.log('Toast function not initialized');
  }
};
