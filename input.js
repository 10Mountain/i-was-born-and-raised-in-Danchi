class InputHandler {
    constructor() {
        this.keys = [];
        window.addEventListener('keydown', e => {
            if ((e.key === 'ArrowDown' ||
                e.key === 'ArrowUp' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight' ||
                e.key === ' ' ||
                e.key === 'Enter') && this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
            }
        });
        window.addEventListener('keyup', e => {
            if (e.key === 'ArrowDown' ||
                e.key === 'ArrowUp' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight' ||
                e.key === ' ' ||
                e.key === 'Enter') {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        });

        // Touch Controls
        this.touchY = '';
        this.touchThreshold = 30;

        const btnLeft = document.getElementById('btnLeft');
        const btnRight = document.getElementById('btnRight');
        const btnJump = document.getElementById('btnJump');

        const addTouchListener = (btn, key) => {
            if (!btn) return;
            const start = (e) => {
                e.preventDefault();
                if (this.keys.indexOf(key) === -1) this.keys.push(key);
            };
            const end = (e) => {
                e.preventDefault();
                this.keys.splice(this.keys.indexOf(key), 1);
            };
            btn.addEventListener('touchstart', start);
            btn.addEventListener('touchend', end);
            btn.addEventListener('mousedown', start);
            btn.addEventListener('mouseup', end);
        };

        addTouchListener(btnLeft, 'ArrowLeft');
        addTouchListener(btnRight, 'ArrowRight');
        addTouchListener(btnJump, 'ArrowUp');
    }
}
