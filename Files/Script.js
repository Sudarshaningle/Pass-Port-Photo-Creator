(() => {
    const $ = id => document.getElementById(id);

    // State
    let state = {
        imgSrc: null,
        photoW: 50.8, photoH: 50.8,
        paperW: 210, paperH: 297,
        gap: 1,
        margin: 10,
        bgColor: '#ffffff',
        cutlines: true,
        photoBorder: false,
        quantity: 0,   // 0 = auto/fill page
        dpi: 600,      // print resolution
    };

    // ── Upload ────────────────────────────────────────────────────────
    const zone = $('uploadZone');
    const fileInput = $('fileInput');

    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) loadFile(file);
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files[0]) loadFile(fileInput.files[0]);
    });

    function loadFile(file) {
        const reader = new FileReader();
        reader.onload = e => {
            state.imgSrc = e.target.result;
            $('preview-img').src = e.target.result;
            zone.classList.add('has-image');
            $('genBtn').disabled = false;
            updateStatus('ready');
            renderPreview();
        };
        reader.readAsDataURL(file);
    }

    // ── Option buttons ────────────────────────────────────────────────
    document.querySelectorAll('#standardBtns .opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#standardBtns .opt-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.photoW = parseFloat(btn.dataset.w);
            state.photoH = parseFloat(btn.dataset.h);
            updateMaxQtyUI();
            if (state.imgSrc) renderPreview();
        });
    });

    document.querySelectorAll('#paperBtns .opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#paperBtns .opt-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.paperW = parseFloat(btn.dataset.pw);
            state.paperH = parseFloat(btn.dataset.ph);
            updateMaxQtyUI();
            if (state.imgSrc) renderPreview();
        });
    });

    // ── Quantity input ────────────────────────────────────────────────
    function getMaxQty() {
        const { cols, rows } = calcLayout();
        return cols * rows;
    }

    function updateMaxQtyUI() {
        const { cols, rows } = calcLayout();
        const max = cols * rows;
        $('qtyMax').textContent = max;
        $('qtyGrid').textContent = `${cols} × ${rows}`;
        $('qtyMaxWarn').textContent = max;
        // Update the number input's max attribute
        $('qtyInput').max = max;
        // If a custom qty is set and exceeds new max, cap it
        if (state.quantity > 0 && state.quantity > max) {
            state.quantity = max;
            $('qtyInput').value = max;
            $('qtyWarning').classList.remove('hidden');
            setTimeout(() => $('qtyWarning').classList.add('hidden'), 3000);
        }
        $('qtyDec').disabled = (state.quantity <= 1 || state.quantity === 0);
        $('qtyInc').disabled = (state.quantity >= max);
    }

    function setQtyAuto() {
        state.quantity = 0;
        $('qtyInput').value = '';
        $('qtyInput').placeholder = 'Auto';
        $('qtyAutoBtn').classList.add('active');
        $('qtyDec').disabled = true;
        $('qtyInc').disabled = false;
        $('qtyWarning').classList.add('hidden');
        if (state.imgSrc) renderPreview();
    }

    function setQtyValue(val) {
        const max = getMaxQty();
        if (val < 1) val = 1;
        if (val > max) {
            val = max;
            $('qtyWarning').classList.remove('hidden');
            setTimeout(() => $('qtyWarning').classList.add('hidden'), 3000);
        } else {
            $('qtyWarning').classList.add('hidden');
        }
        state.quantity = val;
        $('qtyInput').value = val;
        $('qtyAutoBtn').classList.remove('active');
        $('qtyDec').disabled = val <= 1;
        $('qtyInc').disabled = val >= max;
        if (state.imgSrc) renderPreview();
    }

    $('qtyAutoBtn').addEventListener('click', setQtyAuto);

    $('qtyInput').addEventListener('input', e => {
        const raw = e.target.value.trim();
        if (raw === '' || raw === '0') { setQtyAuto(); return; }
        const val = parseInt(raw);
        if (!isNaN(val)) setQtyValue(val);
    });

    $('qtyDec').addEventListener('click', () => {
        const cur = state.quantity > 0 ? state.quantity : getMaxQty();
        setQtyValue(cur - 1);
    });

    $('qtyInc').addEventListener('click', () => {
        const cur = state.quantity > 0 ? state.quantity : 1;
        setQtyValue(cur + 1);
    });

    // ── DPI / quality buttons ─────────────────────────────────────────
    document.querySelectorAll('#dpiBtns .opt-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#dpiBtns .opt-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.dpi = parseInt(btn.dataset.dpi);
        });
    });

    // ── Color chips ───────────────────────────────────────────────────
    document.querySelectorAll('#bgColors .color-chip[data-color]').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('#bgColors .color-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            state.bgColor = chip.dataset.color;
            if (state.imgSrc) renderPreview();
        });
    });

    $('customBgColor').addEventListener('input', e => {
        document.querySelectorAll('#bgColors .color-chip').forEach(c => c.classList.remove('active'));
        e.target.closest('.color-chip').classList.add('active');
        state.bgColor = e.target.value;
        if (state.imgSrc) renderPreview();
    });

    // ── Sliders ───────────────────────────────────────────────────────
    $('gapSlider').addEventListener('input', e => {
        state.gap = parseFloat(e.target.value);
        $('gapVal').textContent = state.gap + ' mm';
        updateMaxQtyUI();
        if (state.imgSrc) renderPreview();
    });
    $('marginSlider').addEventListener('input', e => {
        state.margin = parseFloat(e.target.value);
        $('marginVal').textContent = state.margin + ' mm';
        updateMaxQtyUI();
        if (state.imgSrc) renderPreview();
    });

    // ── Toggles ───────────────────────────────────────────────────────
    $('toggleCutlines').addEventListener('click', () => {
        state.cutlines = !state.cutlines;
        $('cutlineToggle').classList.toggle('on', state.cutlines);
        if (state.imgSrc) renderPreview();
    });
    $('toggleBorder').addEventListener('click', () => {
        state.photoBorder = !state.photoBorder;
        $('borderToggle').classList.toggle('on', state.photoBorder);
        if (state.imgSrc) renderPreview();
    });

    // ── Layout calc ───────────────────────────────────────────────────
    function calcLayout() {
        const usableW = state.paperW - state.margin * 2;
        const usableH = state.paperH - state.margin * 2;
        const cols = Math.floor((usableW + state.gap) / (state.photoW + state.gap));
        const rows = Math.floor((usableH + state.gap) / (state.photoH + state.gap));
        return { cols: Math.max(1, cols), rows: Math.max(1, rows) };
    }

    // ── Preview render ────────────────────────────────────────────────
    function renderPreview() {
        if (!state.imgSrc) return;

        const { cols, rows } = calcLayout();
        updateMaxQtyUI();
        const maxTotal = cols * rows;
        const total = state.quantity > 0 ? Math.min(state.quantity, maxTotal) : maxTotal;

        // Update chips
        $('chipCount').innerHTML = `<span>${total}</span> photos`;
        $('chipSize').innerHTML = `<span>${state.photoW}×${state.photoH}</span> mm`;
        const paperName = document.querySelector('#paperBtns .opt-btn.active').textContent.trim().split('\n')[0].trim();
        $('chipPaper').innerHTML = `<span>${paperName}</span>`;

        // Grid meta
        $('gridMeta').classList.remove('hidden');
        $('metaLayout').textContent = `${cols} × ${rows}`;
        $('metaCount').textContent = total;
        $('metaSize').textContent = `${state.photoW} × ${state.photoH} mm`;
        $('metaDpi').textContent = '300 dpi (PDF)';

        // Draw canvas preview (scaled)
        const DPX = 2; // preview px per mm (72 dpi equiv)
        const cw = state.paperW * DPX;
        const ch = state.paperH * DPX;
        const canvas = $('previewCanvas');
        canvas.width = cw;
        canvas.height = ch;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, cw, ch);

        const img = new Image();
        img.onload = () => {
            const pw = state.photoW * DPX;
            const ph = state.photoH * DPX;
            const gap = state.gap * DPX;
            const mgn = state.margin * DPX;

            let placed = 0;
            for (let r = 0; r < rows; r++) {
                if (placed >= total) break;
                for (let c = 0; c < cols; c++) {
                    if (placed >= total) break;
                    placed++;
                    const x = mgn + c * (pw + gap);
                    const y = mgn + r * (ph + gap);

                    // BG fill
                    ctx.fillStyle = state.bgColor;
                    ctx.fillRect(x, y, pw, ph);

                    // Draw image (cover crop)
                    const imgAR = img.width / img.height;
                    const boxAR = pw / ph;
                    let sx, sy, sw, sh;
                    if (imgAR > boxAR) {
                        sh = img.height; sw = sh * boxAR;
                        sx = (img.width - sw) / 2; sy = 0;
                    } else {
                        sw = img.width; sh = sw / boxAR;
                        sx = 0; sy = (img.height - sh) / 2;
                    }
                    ctx.drawImage(img, sx, sy, sw, sh, x, y, pw, ph);

                    // Border
                    if (state.photoBorder) {
                        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
                        ctx.lineWidth = 0.5;
                        ctx.strokeRect(x + 0.25, y + 0.25, pw - 0.5, ph - 0.5);
                    }

                    // Cut lines
                    if (state.cutlines) {
                        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
                        ctx.lineWidth = 0.5;
                        ctx.setLineDash([3, 3]);
                        drawCutLine(ctx, x, y, pw, ph);
                        ctx.setLineDash([]);
                    }
                }
            }

            $('emptyState').style.display = 'none';
            canvas.style.display = 'block';
        };
        img.src = state.imgSrc;
    }

    function drawCutLine(ctx, x, y, pw, ph) {
        const ext = 5;
        // top
        ctx.beginPath(); ctx.moveTo(x - ext, y); ctx.lineTo(x + pw + ext, y); ctx.stroke();
        // bottom
        ctx.beginPath(); ctx.moveTo(x - ext, y + ph); ctx.lineTo(x + pw + ext, y + ph); ctx.stroke();
        // left
        ctx.beginPath(); ctx.moveTo(x, y - ext); ctx.lineTo(x, y + ph + ext); ctx.stroke();
        // right
        ctx.beginPath(); ctx.moveTo(x + pw, y - ext); ctx.lineTo(x + pw, y + ph + ext); ctx.stroke();
    }

    // ── Status ────────────────────────────────────────────────────────
    function updateStatus(s) {
        const badge = $('statusBadge');
        if (s === 'ready') {
            badge.className = 'status-badge ready';
            badge.innerHTML = '<div class="dot"></div>Photo ready';
        } else if (s === 'generating') {
            badge.className = 'status-badge';
            badge.innerHTML = '<div class="dot"></div>Generating PDF…';
        } else if (s === 'done') {
            badge.className = 'status-badge ready';
            badge.innerHTML = '<div class="dot"></div>PDF ready to download';
        }
    }

    // ── Generate PDF ──────────────────────────────────────────────────
    $('genBtn').addEventListener('click', generatePDF);

    async function generatePDF() {
        if (!state.imgSrc) return;
        updateStatus('generating');
        $('genBtn').disabled = true;

        await new Promise(r => setTimeout(r, 30)); // let UI update

        const { jsPDF } = window.jspdf;
        const orientation = state.paperH >= state.paperW ? 'portrait' : 'landscape';
        const pdf = new jsPDF({ orientation, unit: 'mm', format: [state.paperW, state.paperH] });

        const { cols, rows } = calcLayout();
        const DPI = state.dpi;           // 300 or 600
        const MM_TO_PX = DPI / 25.4;

        const pw_px = Math.round(state.photoW * MM_TO_PX);
        const ph_px = Math.round(state.photoH * MM_TO_PX);

        const img = new Image();
        img.src = state.imgSrc;
        await new Promise(r => { img.onload = r; if (img.complete) r(); });

        // Build high-res photo tile on offscreen canvas
        const off = $('offscreen');
        off.width = pw_px;
        off.height = ph_px;
        const octx = off.getContext('2d');

        octx.fillStyle = state.bgColor;
        octx.fillRect(0, 0, pw_px, ph_px);

        const imgAR = img.width / img.height;
        const boxAR = pw_px / ph_px;
        let sx, sy, sw, sh;
        if (imgAR > boxAR) {
            sh = img.height; sw = sh * boxAR;
            sx = (img.width - sw) / 2; sy = 0;
        } else {
            sw = img.width; sh = sw / boxAR;
            sx = 0; sy = (img.height - sh) / 2;
        }
        octx.drawImage(img, sx, sy, sw, sh, 0, 0, pw_px, ph_px);

        if (state.photoBorder) {
            octx.strokeStyle = 'rgba(0,0,0,0.2)';
            octx.lineWidth = 2;
            octx.strokeRect(1, 1, pw_px - 2, ph_px - 2);
        }

        // Encode tile: PNG (lossless) for Ultra HD, JPEG high-quality for Standard
        const usePNG = state.dpi >= 600;
        const tileData = usePNG
            ? off.toDataURL('image/png')
            : off.toDataURL('image/jpeg', 0.99);
        const imgFmt = usePNG ? 'PNG' : 'JPEG';

        const maxTotalPdf = cols * rows;
        const totalPdf = state.quantity > 0 ? Math.min(state.quantity, maxTotalPdf) : maxTotalPdf;

        // Place tiles
        let placedPdf = 0;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (placedPdf >= totalPdf) break;
                placedPdf++;
                const x = state.margin + c * (state.photoW + state.gap);
                const y = state.margin + r * (state.photoH + state.gap);
                pdf.addImage(tileData, imgFmt, x, y, state.photoW, state.photoH);
            }
        }

        // Cut lines
        if (state.cutlines) {
            pdf.setDrawColor(150, 150, 150);
            pdf.setLineWidth(0.1);
            pdf.setLineDashPattern([0.8, 0.8], 0);

            let placedCut = 0;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    if (placedCut >= totalPdf) break;
                    placedCut++;
                    const x = state.margin + c * (state.photoW + state.gap);
                    const y = state.margin + r * (state.photoH + state.gap);
                    const ext = 2;
                    // top
                    pdf.line(x - ext, y, x + state.photoW + ext, y);
                    // bottom
                    pdf.line(x - ext, y + state.photoH, x + state.photoW + ext, y + state.photoH);
                    // left
                    pdf.line(x, y - ext, x, y + state.photoH + ext);
                    // right
                    pdf.line(x + state.photoW, y - ext, x + state.photoW, y + state.photoH + ext);
                }
            }
        }

        const pdfBlob = pdf.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        const dl = $('downloadLink');
        dl.href = url;
        dl.classList.remove('hidden');
        $('genBtn').disabled = false;
        updateStatus('done');

        // Auto-trigger download
        dl.click();
    }

    // Init
    $('gapVal').textContent = state.gap + ' mm';
    $('marginVal').textContent = state.margin + ' mm';
    updateMaxQtyUI();

})();
