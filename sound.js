class SoundController {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.tempo = 95; // Nujabes style tempo (approx 90-100 BPM)
        this.beatDuration = 60 / this.tempo;
        this.nextNoteTime = 0;
        this.currentStep = 0;
        this.totalSteps = 16; // 4 bars of 4/4

        // Lo-fi / Jazzy Hip Hop Chord Progression (Dm9 - G13 - CMaj9 - A7alt)
        this.chords = [
            // Bar 1: Dm9
            { step: 0, notes: ['D4', 'F4', 'A4', 'C5', 'E5'], duration: 4 },
            // Bar 2: G13
            { step: 4, notes: ['G3', 'F4', 'B4', 'E5'], duration: 4 },
            // Bar 3: CMaj9
            { step: 8, notes: ['C4', 'E4', 'G4', 'B4', 'D5'], duration: 4 },
            // Bar 4: A7alt (A7#9)
            { step: 12, notes: ['A3', 'G4', 'C5', 'F5'], duration: 4 }
        ];

        // Drum Pattern (16 steps)
        // K = Kick, S = Snare, H = Hi-hat
        this.drumPattern = {
            kick: [1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0],
            snare: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
            hihat: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        };

        this.frequencies = {
            'G3': 196.00, 'A3': 220.00,
            'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
            'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
            'C#5': 554.37, 'D#5': 622.25
        };
    }

    init() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
        this.nextNoteTime = this.audioContext.currentTime;
    }

    play() {
        if (!this.audioContext) this.init();
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        this.isPlaying = true;
        this.currentStep = 0;
        this.nextNoteTime = this.audioContext.currentTime;
        this.scheduler();
    }

    stop() {
        this.isPlaying = false;
        if (this.audioContext) {
            this.audioContext.suspend();
        }
    }

    scheduler() {
        if (!this.isPlaying) return;

        const secondsPerStep = this.beatDuration / 4; // 16th notes

        while (this.nextNoteTime < this.audioContext.currentTime + 0.1) {
            this.playStep(this.currentStep, this.nextNoteTime);
            this.nextNoteTime += secondsPerStep;
            this.currentStep++;
            if (this.currentStep >= this.totalSteps) {
                this.currentStep = 0;
            }
        }

        setTimeout(() => this.scheduler(), 25);
    }

    playStep(step, time) {
        // Play Drums
        if (this.drumPattern.kick[step]) this.playKick(time);
        if (this.drumPattern.snare[step]) this.playSnare(time);
        if (this.drumPattern.hihat[step]) this.playHiHat(time);

        // Play Chords
        const chord = this.chords.find(c => c.step === step);
        if (chord) {
            this.playChord(chord.notes, time, chord.duration * (this.beatDuration / 4));
        }
    }

    playKick(time) {
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.frequency.setValueAtTime(150, time);
        osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
        gain.gain.setValueAtTime(0.8, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

        osc.start(time);
        osc.stop(time + 0.5);
    }

    playSnare(time) {
        const noiseBuffer = this.createNoiseBuffer();
        const noise = this.audioContext.createBufferSource();
        noise.buffer = noiseBuffer;
        const noiseFilter = this.audioContext.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 1000;
        const noiseGain = this.audioContext.createGain();

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.audioContext.destination);

        noiseGain.gain.setValueAtTime(0.5, time);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
        noise.start(time);
        noise.stop(time + 0.2);

        // Add a tone for body
        const osc = this.audioContext.createOscillator();
        const oscGain = this.audioContext.createGain();
        osc.connect(oscGain);
        oscGain.connect(this.audioContext.destination);
        osc.frequency.setValueAtTime(250, time);
        oscGain.gain.setValueAtTime(0.2, time);
        oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
        osc.start(time);
        osc.stop(time + 0.1);
    }

    playHiHat(time) {
        const noiseBuffer = this.createNoiseBuffer();
        const noise = this.audioContext.createBufferSource();
        noise.buffer = noiseBuffer;
        const noiseFilter = this.audioContext.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 5000;
        const noiseGain = this.audioContext.createGain();

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.audioContext.destination);

        // Swing feel: delay every other hihat slightly? 
        // For now straight 16ths, maybe accent off-beats
        const volume = (this.currentStep % 4 === 2) ? 0.1 : 0.05;

        noiseGain.gain.setValueAtTime(volume, time);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
        noise.start(time);
        noise.stop(time + 0.05);
    }

    playChord(notes, time, duration) {
        notes.forEach(note => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            // Electric Piano-ish sound (Triangle + Sine mix usually, here just Triangle)
            osc.type = 'triangle';
            osc.frequency.value = this.frequencies[note];

            osc.connect(gain);
            gain.connect(this.audioContext.destination);

            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.1, time + 0.05); // Attack
            gain.gain.exponentialRampToValueAtTime(0.01, time + duration); // Decay

            osc.start(time);
            osc.stop(time + duration);
        });
    }

    createNoiseBuffer() {
        const bufferSize = this.audioContext.sampleRate * 2; // 2 seconds
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        return buffer;
    }

    // SFX methods remain same
    playJump() {
        if (!this.audioContext) return;
        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        osc.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        osc.type = 'square';
        osc.frequency.setValueAtTime(150, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.1);
    }

    playHit() {
        if (!this.audioContext) return;
        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        osc.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.3);
    }

    playScore() {
        if (!this.audioContext) return;
        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        osc.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        osc.frequency.setValueAtTime(1500, this.audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.2);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.2);
    }
    playGameOver() {
        if (!this.audioContext) return;
        this.stop(); // Stop background music

        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        osc.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, this.audioContext.currentTime);
        osc.frequency.linearRampToValueAtTime(50, this.audioContext.currentTime + 1.5);

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1.5);

        osc.start();
        osc.stop(this.audioContext.currentTime + 1.5);
    }
}
