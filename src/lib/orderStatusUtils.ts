export const ORDER_STATUS_LABELS: Record<string, string> = {
  new: 'New',
  preparing: 'Preparing',
  on_the_way: 'On the way',
  ready: 'Ready for Pickup',
  delivered: 'Delivered',
  completed: 'Completed',
  cancelled: 'Cancelled',
  canceled: 'Cancelled',
};

export const getOrderStatusLabel = (status: string): string => {
  return ORDER_STATUS_LABELS[status.toLowerCase()] || status;
};