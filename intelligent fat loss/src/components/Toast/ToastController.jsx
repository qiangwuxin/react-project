import mitt from 'mitt'

export const toastEvent = mitt();

export function showToast(data = { cart: 0, bell: 0, mail: 0 }) {
  toastEvent.emit('show', data);
}