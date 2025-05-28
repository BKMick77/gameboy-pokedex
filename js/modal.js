let modalModule = (function () {
    let currentModal;

    function showModal(title, text) {
        let template = document.querySelector('#gameboy-template');
        let clone = template.content.cloneNode(true);
        let modalContainer = clone.querySelector('.gameboy-modal');

        modalContainer.querySelector('h1').innerText = title;
        modalContainer.querySelector('p').innerText = text;
        // console.log('pixelUrl:', pixelUrl);
        // modalContainer.querySelector('.pokemon-img').src = pixelUrl;
        // modalContainer.querySelector('.pokemon-img').src = imgURL;

        document.body.appendChild(clone);
        modalContainer.classList.add('is-visible');
        currentModal = modalContainer;

        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) {
                hideModal();
            }
        });
    }

    function hideModal() {
        if (currentModal) {
            currentModal.classList.remove('is-visible');
            setTimeout(() => {
                currentModal.remove();
                currentModal = null;
            }, 200);
        }
    }

    window.addEventListener('keydown', (e) => {
        if (
            e.key === 'Escape' &&
            currentModal.classList.contains('is-visible')
        ) {
            hideModal();
        }
    });

    return {
        showModal: showModal,
    };
})();
