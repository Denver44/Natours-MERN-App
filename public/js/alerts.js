/* eslint-disable */

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el); // this will remove the element 
};

// type is 'success' or 'error'
export const showAlert = (type, msg, time = 7) => {
  hideAlert(); // if any alert is there then stop it and show this current one
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup); // this means inside of body but right at beginning
  window.setTimeout(hideAlert, time * 1000); // Hide alert after 1Sec.
};

// Here we create markup for us.

// THis is BASIC DOM MANIPULATION