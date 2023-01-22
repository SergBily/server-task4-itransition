export const getDate = (t = '') => {
  if (t) {
    return new Date().toLocaleString("en-US");
  } else {
    return new Date().toDateString();
  };
};