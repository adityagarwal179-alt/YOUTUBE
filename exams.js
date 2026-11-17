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


    /* ---------- Admit cards (PDFs live in the admit_cards folder) ---------- */
    const pharmFirst = EXAMS.filter(e => e.program === 'pharm').sort((a, b) => examStart(a) - examStart(b))[0];
    const pharmReach = fmt12(shiftTime(pharmFirst.start, -30));
    const ADMIT_CARDS = {
        pharm: {
            title: 'PSBTE Admit Card — Nov 2026 Examination',
            file: 'admit_cards/PSBTE_Admit_Card_242071901229.pdf',
            downloadName: 'PSBTE_Admit_Card_242071901229.pdf',
            details: [
                ['Student Name', 'ADITYA AGARWAL'],
                ["Father's Name", 'RAJEEV AGARWAL'],
                ['Registration No.', '242071901229'],
                ['Institute', 'Chandigarh Pharmacy College, Jhanjeri, Mohali'],
                ['Issued by', 'Punjab State Board of Technical Education & Industrial Training, Plot No. 1A, Sector 36A, Chandigarh – 160036'],
                ['Exam Centre', 'GOVT. POLYTECHNIC COLLEGE, KHOONI MAZRA']
            ],
            before: [
                'Print the admit card (it is the entry pass — no admit card, no entry)',
                'Paste a recent photograph and get it attested by the Principal',
                'Sign as candidate in the space provided',
                'Get the Principal\'s signature with the institution\'s seal',
                'Check that your name, subjects and centre match your exam form',
                'Keep your original photo Registration Card ready'
            ],
            instructions: [
                { imp: true,  t: 'Appear <b>only in the papers/subjects specified in the admit card</b>. Make sure the subjects listed are according to the examination form you filled.' },
                { imp: true,  t: 'Follow the invigilator\'s instructions when filling details on the answer sheet. <b>Fill the circles/ovals with the same four-digit subject code</b> as on the admit card (3012 and 3014) — otherwise your <b>result may be declared late</b>.' },
                { imp: true,  t: 'You will <b>not be allowed to enter the examination centre without the admit card</b>.' },
                { imp: true,  t: 'Bring the <b>original photo Registration Card</b> issued by the Board to the venue of the examination.' },
                { imp: false, t: 'Visit the Board\'s websites, <b>www.punjabteched.net</b> and <b>www.punjabteched.com</b>, regularly for the latest information related to the examination.' },
                { imp: true,  t: 'Reach the Examination Centre <b>30 minutes before the exam time</b> (' + pharmReach + ' for your ' + fmt12(pharmFirst.start) + ' papers).' },
                { imp: false, t: 'Enter the required details in the <b>Attendance Sheet</b> and put your <b>signature</b>.' },
                { imp: true,  t: '<b>Mobile phones and other electronic devices are not permitted</b> inside the examination centre. If a candidate adopts <b>unfair means</b> or indulges in any unfair practice, the candidature will be <b>cancelled</b> and action taken as per the examination rules.' },
                { imp: false, t: 'For any problem in the details on the admit card, <b>contact your Institute</b>.' },
                { imp: true,  t: '<b>Declaration:</b> by signing, you confirm all particulars are correct and true. If any particular is found incorrect, your <b>result may be cancelled</b>.' }
            ]
        },
        bca: {
            title: 'IGNOU Hall Ticket — December 2026 TEE',
            file: 'admit_cards/IGNOU_Hall_Ticket_2552739030.pdf',
            downloadName: 'IGNOU_Hall_Ticket_2552739030.pdf',
            details: [
                ['Student Name', 'ADITYA AGARWAL'],
                ['Enrollment No.', '2552739030'],
                ['Programme', 'BCA_NEWOL — Bachelor of Computer Applications'],
                ['Examination', '2026-DECEMBER-THEORY, Term End Examination (TEE)'],
                ['Mode of Exam', 'Pen and Paper Test'],
                ['Exam Centre', '0601 : UIET, Block-2, PU, Sector 25, Chandigarh — Univ. Institute of Engg. & Tech. (UIET), Academic Block-2, Panjab University, South Campus, Sector 25, Chandigarh – 160014'],
                ['Printed on', '06-11-2026, 08:07 PM']
            ],
            before: [
                'Print the hall ticket (keep a spare copy)',
                'Check that the photo on it is visible (yours is)',
                'Check your enrollment number, course codes, dates and centre',
                'Carry a valid photo ID along with the hall ticket',
                'Visit the centre once before the exam day to know the way'
            ],
            instructions: [
                { imp: true,  t: 'The <b>duration of the examination is mentioned on the first page of the question paper</b>.' },
                { imp: true,  t: 'This Hall Ticket is <b>valid subject to fulfilling the conditions mentioned in Para No. 18</b>. That paragraph is not on the copy you uploaded (it is page 1 of 4) — read the full hall ticket on the IGNOU portal.' },
                { imp: true,  t: 'If the photo is <b>not visible</b> on the hall ticket, <b>paste your latest passport-size photograph, self-attested</b>, to appear in the December 2026 TEE. <i>(Your photo is visible, so this should not apply to you.)</i>' },
                { imp: false, t: 'The <b>dates for practical exams</b> will be communicated separately by the concerned <b>Regional Centre</b>.' },
                { imp: false, na: true, t: '<b>DECE learners only:</b> DECE01, DECE02 and DECE03 exams are OMR based, with no change of centre. <i>Not applicable to BCA.</i>' }
            ]
        }
    };

    const GLANCE = [
        { icon: '🎫', title: 'No admit card = no entry', text: 'PSBTE will not let you into the centre without the printed admit card.' },
        { icon: '🪪', title: 'Original photo Registration Card', text: 'Carry the original card issued by the Board (PSBTE).' },
        { icon: '⏰', title: 'Reach 30 minutes early', text: 'PSBTE papers start at ' + fmt12(pharmFirst.start) + ' — be at the centre by ' + pharmReach + '.' },
        { icon: '🔢', title: 'Fill the 4-digit subject code', text: 'Same code as the admit card on the answer sheet: 3012 / 3014. A mismatch can delay your result.' },
        { icon: '📵', title: 'No phones or electronics', text: 'Not allowed inside the centre. Unfair means = candidature cancelled.' },
        { icon: '✍️', title: 'Photo, signatures, seal', text: 'PSBTE card needs your photo attested by the Principal, your signature, and the Principal\'s signature with seal.' },
        { icon: '⚠️', title: 'Clash on 08-12-2026', text: '3014 (1:30–4:30 PM) overlaps MCS208 (2:00–5:00 PM). Talk to your institute and IGNOU now.' }
    ];

    const store = {
        get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
        set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} }
    };

    return { PROGRAMS, EXAMS, ADMIT_CARDS, GLANCE, at, examStart, examEnd, sorted, byId, status, clashes,
             fmt12, fmtDate, dayName, timeRange, label, fmtDur, shiftTime, googleCalUrl, downloadICS, store };
})();
