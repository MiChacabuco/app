import React from 'react';

const useConstant = (fn: () => any) => {
  return React.useState(fn)[0];
};

export default useConstant;
