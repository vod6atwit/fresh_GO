/* eslint-disable */
import 'core-js/stable'; // polyfilling all new features
import 'regenerator-runtime/runtime'; // polyfiling async/await
import { login, logout } from './login';
import { signup } from './signup';
import { updateSettings } from './updateSettings';
import { buyProduct } from './stripe';

// DOM ELEMENTS
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const buyBtn = document.getElementById('buy-product');
const userDataform = document.querySelector('.form-user-data');
const userPasswordform = document.querySelector('.form-user-password');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    document.querySelector('.btn--join-now').textContent = 'Joining...';

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    await signup(name, email, password, passwordConfirm);

    document.querySelector('.btn--join-now').textContent = 'Done';
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

if (userDataform) {
  userDataform.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');
  });
}

if (userPasswordform) {
  userPasswordform.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (buyBtn) {
  buyBtn.addEventListener('click', (e) => {
    e.target.textContent = 'processing...';
    const { productId } = e.target.dataset;
    buyProduct(productId);
  });
}

// "passwordCurrent":"pass1234",
// "password": "newpassword",
// "passwordConfirm": "newpassword"

// features
//////////////////////////////////////
//Refresh Scrolling
(() => {
  window.scrollTo(0, 0);
  // window.scrollTo({ top: 0, behavior: 'smooth' });
})();

// window.onbeforeunload = function (e) {
//   // e.preventDefault();
//   window.scrollTo(0, 0);
// };
//////////////////////////////////////
// sticky navigation: Intersection Observer API
const header = document.querySelector('header');
const headerSection = document.querySelector('body');

const stickyHeader = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) header.classList.add('sticky');
  else header.classList.remove('sticky');
};

const heroObserver = new IntersectionObserver(stickyHeader, {
  root: null,
  threshold: 1,
  // rootMargin: `-120px`,
});

heroObserver.observe(headerSection);
