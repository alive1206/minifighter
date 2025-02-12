export const formatCurrency = (value: any) => {
  const formattedCurrency = value
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return formattedCurrency;
};
