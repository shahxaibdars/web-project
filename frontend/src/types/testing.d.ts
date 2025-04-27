import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R = void> extends jest.Matchers<R> {
      toBeInTheDocument(): R;
      toHaveBeenCalledWith(...args: any[]): R;
    }
  }
} 