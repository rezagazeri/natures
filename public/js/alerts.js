export const hideAlert = () => {
    const alerter = document.querySelector('.alert');
    if (alerter) alerter.parentElement.removeChild(alerter)
};

export const showAlert = (type, msg) => {
    hideAlert()
    const marker = `<div class = "alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', marker);
    window.setTimeout(hideAlert, 2000);
}