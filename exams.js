/* ==========================================================
   exams.js  —  single source of truth for the Study Vault
   Edit exam data HERE only; index.html and datesheet.html
   both read from this file. Keep all 3 files in one folder.
   All times are India Standard Time (IST, UTC+05:30).
   ========================================================== */
window.VAULT = (function () {
    'use strict';
    const TZ = '+05:30';

    const PROGRAMS = {
        bca: {
            label: 'BCA · IGNOU',
            board: 'IGNOU Term End Examination — December 2026',
            holder: 'Enrollment No. 2552739030',
            mode: 'Pen & Paper Test',
            centreCode: '0601',
            centre: 'UIET Block-2, Panjab University, South Campus, Sector 25, Chandigarh – 160014',
            short: 'UIET Block-2, Sector 25, Chandigarh',
            map: 'https://maps.app.goo.gl/QPuAFTxJ2CRYivxe9',
            reportMin: 0,
            checklist: [
                'Printed IGNOU Hall Ticket (with photo pasted if not visible)',
                'Valid photo ID card',
                'Blue/black pens and basic stationery',
                'Reach the centre well before the start time'
            ]
        },
        pharm: {
            label: 'Pharmacy · PSBTE',
            board: 'Punjab State Board of Technical Education & Industrial Training — Nov 2026',
            holder: 'Registration No. 242071901229',
            mode: 'Theory',
            centreCode: '',
            centre: 'Govt. Polytechnic College, Khooni Mazra',
            short: 'Govt. Polytechnic College, Khooni Mazra',
            map: 'https://www.google.com/maps/search/?api=1&query=' +
                 encodeURIComponent('Government Polytechnic College Khooni Majra Kharar Punjab'),
            reportMin: 30,
            checklist: [
                'Printed Admit Card (entry is NOT allowed without it)',
                'Original photo Registration Card issued by the Board',
                'Fill the same 4-digit subject code on the answer sheet as on the admit card',
                'Fill details on the answer sheet as the invigilator instructs',
                'Sign the attendance sheet',
                'Reach the centre 30 minutes before the exam',
                'No mobile phones or electronic devices inside the centre'
            ]
        }
    };

    const EXAMS = [
        { id: 'bcs131',   code: 'BCS131',   name: '',                             program: 'bca',   date: '2026-12-04', start: '10:00', end: '13:00', cls: 'Term End Exam',
          topics: ['Unit 1: Programming Basics', 'Unit 2: Data Types & Control', 'Unit 3: Functions & Arrays'] },
        { id: 'bcs040',   code: 'BCS040',   name: '',                             program: 'bca',   date: '2026-12-05', start: '10:00', end: '13:00', cls: 'Term End Exam',
          topics: ['Unit 1: Statistical Concepts', 'Unit 2: Probability Theory', 'Unit 3: Sampling & Estimation'] },
        { id: 'mcs207',   code: 'MCS207',   name: '',                             program: 'bca',   date: '2026-12-07', start: '14:00', end: '17:00', cls: 'Term End Exam',
          topics: ['Unit 1: Database Architecture', 'Unit 2: SQL & Relational Algebra', 'Unit 3: Normalization & Transactions'] },
        { id: 'mcs208',   code: 'MCS208',   name: '',                             program: 'bca',   date: '2026-12-08', start: '14:00', end: '17:00', cls: 'Term End Exam',
          topics: ['Unit 1: Data Structures Basics', 'Unit 2: Trees & Graphs', 'Unit 3: Sorting & Searching'] },
        { id: 'bevae181', code: 'BEVAE181', name: '',                             program: 'bca',   date: '2027-01-13', start: '10:00', end: '13:00', cls: 'Term End Exam',
          topics: ['Unit 1: Ecosystems & Biodiversity', 'Unit 2: Natural Resources', 'Unit 3: Environmental Issues'] },
        // ---- Pharmacy (from paper Admit Card + Nov-2026 date sheet) ----
        { id: '3012',     code: '3012',     name: 'Pharmaceutical Chemistry',     program: 'pharm', date: '2026-11-27', start: '13:30', end: '16:30', cls: '1st Year', topics: [] },
        { id: '3014',     code: '3014',     name: 'Human Anatomy & Physiology',   program: 'pharm', date: '2026-12-08', start: '13:30', end: '16:30', cls: '1st Year', topics: [] }
    ];

    // Complete PSBTE Pharmacy date sheet (reference only; your papers are 3012 & 3014)
    const FULL_PSBTE = [
        ['2026-11-26', 'Pharmacology', '3031', '2nd'],
        ['2026-11-27', 'Pharmaceutical Chemistry', '3012', '1st'],
        ['2026-11-30', 'Community Pharmacy & Management', '3032', '2nd'],
        ['2026-12-01', 'Pharmaceutics', '3011', '1st'],
        ['2026-12-02', 'Hospital & Clinical Pharmacy', '3035', '2nd'],
        ['2026-12-03', 'Social Pharmacy', '3015', '1st'],
        ['2026-12-04', 'Pharmacy Law & Ethics', '3036', '2nd'],
        ['2026-12-07', 'Bio Chemistry & Clinical Pathology', '3033', '2nd'],
        ['2026-12-08', 'Human Anatomy & Physiology', '3014', '1st'],
        ['2026-12-09', 'Pharmacotherapeutics', '3034', '2nd'],
        ['2026-12-10', 'Pharmacognosy', '3013', '1st']
    ];

    const at = (d, t) => new Date(`${d}T${t}:00${TZ}`);
    const examStart = e => at(e.date, e.start);
    const examEnd = e => at(e.date, e.end);
    const sorted = () => EXAMS.slice().sort((a, b) => examStart(a) - examStart(b));
    const byId = id => EXAMS.find(e => e.id === id);

    function status(e, now) {
        now = now || new Date();
        if (now < examStart(e)) return 'upcoming';
        if (now <= examEnd(e)) return 'live';
        return 'completed';
    }

    function clashes() {
        const out = [], list = sorted();
        for (let i = 0; i < list.length; i++) {
            for (let j = i + 1; j < list.length; j++) {
                const a = list[i], b = list[j];
                if (examStart(a) < examEnd(b) && examStart(b) < examEnd(a)) out.push([a, b]);
            }
        }
        return out;
    }

    function fmt12(t) {
        let [h, m] = t.split(':').map(Number);
        const ap = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return `${h}:${String(m).padStart(2, '0')} ${ap}`;
    }
    const fmtDate = d => d.split('-').reverse().join('-');
    const dayName = d => new Date(`${d}T12:00:00${TZ}`)
        .toLocaleDateString('en-US', { weekday: 'long', timeZone: 'Asia/Kolkata' }).toUpperCase();
    const timeRange = e => `${fmt12(e.start)} - ${fmt12(e.end)}`;
    const label = e => e.name ? `${e.code} · ${e.name}` : e.code;

    function fmtDur(ms) {
        if (ms < 0) ms = 0;
        const d = Math.floor(ms / 86400000);
        const h = Math.floor(ms % 86400000 / 3600000);
        const m = Math.floor(ms % 3600000 / 60000);
        const s = Math.floor(ms % 60000 / 1000);
        return (d > 0 ? d + 'd ' : '') + `${h}h ${m}m ${s}s`;
    }

    const stamp = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

    function googleCalUrl(e) {
        const p = PROGRAMS[e.program];
        const details = `${p.board}\n${p.holder}` +
            (p.reportMin ? `\nReach the centre ${p.reportMin} minutes early (by ${fmt12(shiftTime(e.start, -p.reportMin))}).` : '');
        return 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
            `&text=${encodeURIComponent(label(e) + ' Exam')}` +
            `&dates=${stamp(examStart(e))}/${stamp(examEnd(e))}` +
            `&location=${encodeURIComponent(p.centre)}` +
            `&details=${encodeURIComponent(details)}`;
    }

    function shiftTime(t, minutes) {
        const [h, m] = t.split(':').map(Number);
        let total = h * 60 + m + minutes;
        total = (total + 1440) % 1440;
        return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
    }

    const icsEsc = s => String(s).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');

    function icsEvent(e) {
        const p = PROGRAMS[e.program];
        const desc = `${p.board}\n${p.holder}` + (p.reportMin ? `\nReach ${p.reportMin} min early.` : '');
        return [
            'BEGIN:VEVENT',
            `UID:${e.id}-${e.date}@study-vault`,
            `DTSTAMP:${stamp(new Date())}`,
            `DTSTART:${stamp(examStart(e))}`,
            `DTEND:${stamp(examEnd(e))}`,
            `SUMMARY:${icsEsc(label(e) + ' Exam')}`,
            `LOCATION:${icsEsc(p.centre)}`,
            `DESCRIPTION:${icsEsc(desc)}`,
            'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:Exam tomorrow', 'END:VALARM',
            'BEGIN:VALARM', 'TRIGGER:-PT2H', 'ACTION:DISPLAY', 'DESCRIPTION:Exam in 2 hours', 'END:VALARM',
            'END:VEVENT'
        ];
    }

    function downloadICS(list, filename) {
        const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Study Vault//EN', 'CALSCALE:GREGORIAN'];
        list.forEach(e => icsEvent(e).forEach(l => lines.push(l)));
        lines.push('END:VCALENDAR');
        const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }

    const store = {
        get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
        set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} }
    };

    return { PROGRAMS, EXAMS, FULL_PSBTE, at, examStart, examEnd, sorted, byId, status, clashes,
             fmt12, fmtDate, dayName, timeRange, label, fmtDur, shiftTime, googleCalUrl, downloadICS, store };
})();
