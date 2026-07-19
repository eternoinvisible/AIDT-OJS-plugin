// ============================================================
// AITD GENERATOR – OJS READY (Single Language, Fallback Copy)
// ============================================================

// --- DOM refs ---
const $ = id => document.getElementById(id);
const title = $('title');
const subtitle = $('subtitle');
const authors = $('authors');
const aiTools = $('aiTools');
const toolVersions = $('toolVersions');
const promptLog = $('promptLog');
const customVal = $('customValidation');
const preview = $('declarationPreview');
const status = $('copyStatus');

// --- Helpers ---
function getChecked(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
        .map(cb => cb.value)
        .filter(v => !v.startsWith('no_'));
}

function getValidationText() {
    const selected = document.querySelector('input[name="validation"]:checked');
    if (!selected) return 'Standard validation applied.';
    if (selected.value === 'custom') {
        return customVal.value.trim() || 'Custom validation (no details provided).';
    }
    const texts = {
        minimal: 'All AI-generated content was reviewed and edited by the authors.',
        standard: 'All AI-generated content was reviewed, edited, and approved by at least two co-authors. The authors take full responsibility for the accuracy, integrity, and originality of this work.',
        rigorous: 'All AI-generated content was reviewed by two authors, independently verified against primary sources, benchmarked where applicable, and approved by all co-authors.'
    };
    return texts[selected.value] || texts.standard;
}

function getPhaseDesc(phase, values) {
    const map = {
        concept: {
            hypothesis: 'formulating research questions or hypotheses',
            framework: 'developing the theoretical or conceptual framework',
            gap: 'identifying gaps in existing literature',
            methodology: 'suggesting methodological approaches',
            design: 'assisting in overall study design or structure'
        },
        literature: {
            search: 'searching databases or identifying relevant papers',
            summarization: 'summarizing existing literature',
            citations: 'assisting with citation organization or formatting',
            thematic: 'identifying themes or patterns in literature',
            validation: 'verifying citations or references'
        },
        methodology: {
            code: 'writing or assisting in writing code/scripts',
            statistics: 'performing or assisting in statistical tests',
            data: 'cleaning, transforming, or processing data',
            viz: 'creating or assisting in creating figures/charts',
            methodsel: 'suggesting appropriate methods or techniques',
            simulation: 'creating or running simulations/models'
        },
        writing: {
            drafting: 'drafting portions of the manuscript text',
            paraphrase: 'rephrasing human-written content',
            grammar: 'checking grammar, spelling, or syntax',
            style: 'improving writing style or clarity',
            translation: 'translating text between languages',
            formatting: 'assisting with document formatting or structure'
        },
        interpretation: {
            interpret: 'interpreting research findings',
            implications: 'suggesting implications or applications',
            limitations: 'identifying study limitations',
            future: 'suggesting future research directions',
            conclusion: 'formulating conclusions'
        }
    };
    if (!values || values.length === 0) return null;
    const descs = values.map(v => map[phase]?.[v]).filter(Boolean);
    if (descs.length === 0) return null;
    if (descs.length === 1) return descs[0];
    if (descs.length === 2) return descs.join(' and ');
    const last = descs.pop();
    return descs.join(', ') + ', and ' + last;
}

function getPhaseName(phase) {
    const names = {
        concept: 'Conceptualization and Ideation',
        literature: 'Literature Review and Synthesis',
        methodology: 'Methodology and Analysis',
        writing: 'Writing and Composition',
        interpretation: 'Interpretation and Discussion'
    };
    return names[phase] || phase;
}

// --- Generate plain text declaration ---
function generateDeclaration() {
    const t = title.value.trim() || '[Manuscript Title]';
    const s = subtitle.value.trim();
    const a = authors.value.trim() || '[Authors]';
    const tools = aiTools.value.trim() || '[AI Tools]';
    const tVers = toolVersions.value.trim();
    const pLog = promptLog.value.trim();

    const conceptVals = getChecked('concept');
    const litVals = getChecked('literature');
    const methodVals = getChecked('methodology');
    const writeVals = getChecked('writing');
    const interpVals = getChecked('interpretation');

    const valText = getValidationText();

    const cDesc = getPhaseDesc('concept', conceptVals);
    const lDesc = getPhaseDesc('literature', litVals);
    const mDesc = getPhaseDesc('methodology', methodVals);
    const wDesc = getPhaseDesc('writing', writeVals);
    const iDesc = getPhaseDesc('interpretation', interpVals);

    const total = conceptVals.length + litVals.length + methodVals.length + writeVals.length + interpVals.length;

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { year:'numeric', month:'long', day:'numeric' });

    let lines = [];
    lines.push('MANUSCRIPT INFORMATION');
    lines.push('='.repeat(50));
    lines.push(`Title: ${t}`);
    if (s) lines.push(`Subtitle: ${s}`);
    lines.push(`Authors:\n${a}`);
    lines.push(`Declaration date: ${dateStr}`);
    lines.push('');

    lines.push('AI TRANSPARENCY DECLARATION');
    lines.push('='.repeat(50));
    lines.push('In accordance with the AI Transparency Declaration (AITD) framework v1.1, the authors disclose the following use of generative artificial intelligence in this research:');
    lines.push('');

    if (cDesc) lines.push(`• ${getPhaseName('concept')}: ${cDesc}.`);
    if (lDesc) lines.push(`• ${getPhaseName('literature')}: ${lDesc}.`);
    if (mDesc) lines.push(`• ${getPhaseName('methodology')}: ${mDesc}.`);
    if (wDesc) lines.push(`• ${getPhaseName('writing')}: ${wDesc}.`);
    if (iDesc) lines.push(`• ${getPhaseName('interpretation')}: ${iDesc}.`);

    if (total === 0) {
        lines.push('No artificial intelligence tools were used in the preparation of this manuscript.');
    }
    lines.push('');

    lines.push('HUMAN OVERSIGHT AND VERIFICATION');
    lines.push('-'.repeat(40));
    lines.push(valText);
    lines.push('');

    if (total > 0) {
        let toolsLine = `AI tools and versions: `;
        toolsLine += tVers ? tVers : tools;
        lines.push(toolsLine);
    }

    if (pLog) {
        lines.push(`Prompt transparency: A representative log of prompts and outputs is archived at: ${pLog}`);
    }

    lines.push('');
    lines.push('-'.repeat(50));
    lines.push('This declaration was prepared using the open-source, privacy-preserving AITD web tool (https://ssantamarina.codeberg.page). No tracking or data storage occurred.');
    lines.push('Repository: https://codeberg.org/ssantamarina/AI-Transparency-Declaration');

    return lines.join('\n');
}

// --- Generate BibTeX ---
function generateBibTeX() {
    const t = title.value.trim() || '[Manuscript Title]';
    const a = authors.value.trim() || '[Authors]';
    const tools = aiTools.value.trim() || '[AI Tools]';
    const tVers = toolVersions.value.trim();
    const pLog = promptLog.value.trim();
    const val = getValidationText();

    const conceptVals = getChecked('concept');
    const litVals = getChecked('literature');
    const methodVals = getChecked('methodology');
    const writeVals = getChecked('writing');
    const interpVals = getChecked('interpretation');
    const total = conceptVals.length + litVals.length + methodVals.length + writeVals.length + interpVals.length;

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth()+1).padStart(2,'0');
    const day = String(now.getDate()).padStart(2,'0');

    let bib = `@misc{aitd_${year}_${month}_${day},\n`;
    bib += `  title        = {${t}},\n`;
    bib += `  author       = {${a.replace(/\n/g, ' and ')}},\n`;
    bib += `  year         = {${year}},\n`;
    bib += `  ai_used              = {${total > 0 ? 'yes' : 'no'}},\n`;
    bib += `  ai_declaration_version = {AITD 1.1},\n`;
    bib += `  ai_tools             = {${tools}},\n`;
    if (tVers) bib += `  ai_tool_versions    = {${tVers}},\n`;
    if (pLog) bib += `  ai_prompt_log_url   = {${pLog}},\n`;
    bib += `  ai_validation        = {${val}},\n`;
    bib += `  note = {AI Transparency Declaration generated with AITD v1.1}\n`;
    bib += `}`;
    return bib;
}

// --- Generate HTML preview (for display) ---
function generatePreviewHTML() {
    const t = title.value.trim() || '[Manuscript Title]';
    const s = subtitle.value.trim();
    const a = authors.value.trim() || '[Authors]';
    const tools = aiTools.value.trim() || '[AI Tools]';
    const tVers = toolVersions.value.trim();
    const pLog = promptLog.value.trim();

    const conceptVals = getChecked('concept');
    const litVals = getChecked('literature');
    const methodVals = getChecked('methodology');
    const writeVals = getChecked('writing');
    const interpVals = getChecked('interpretation');

    const valText = getValidationText();

    const cDesc = getPhaseDesc('concept', conceptVals);
    const lDesc = getPhaseDesc('literature', litVals);
    const mDesc = getPhaseDesc('methodology', methodVals);
    const wDesc = getPhaseDesc('writing', writeVals);
    const iDesc = getPhaseDesc('interpretation', interpVals);

    const total = conceptVals.length + litVals.length + methodVals.length + writeVals.length + interpVals.length;

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { year:'numeric', month:'long', day:'numeric' });

    let html = `<div style="font-family: 'Georgia', serif; line-height:1.7; color:#1a1e24;">`;
    html += `<h2 style="font-size:1.6rem; border-bottom:2px solid #2d3748; padding-bottom:8px; margin-top:0;">Manuscript Information</h2>`;
    html += `<p><strong>Title:</strong> ${t}</p>`;
    if (s) html += `<p><strong>Subtitle:</strong> ${s}</p>`;
    html += `<p><strong>Authors:</strong><br>${a.replace(/\n/g, '<br>')}</p>`;
    html += `<p><strong>Declaration date:</strong> ${dateStr}</p>`;

    html += `<h2 style="font-size:1.6rem; border-bottom:2px solid #2d3748; padding-bottom:8px; margin-top:40px;">AI Transparency Declaration</h2>`;
    html += `<p style="font-style:italic;">In accordance with the AI Transparency Declaration (AITD) framework v1.1, the authors disclose the following use of generative artificial intelligence in this research:</p>`;

    if (cDesc) html += `<p><strong>• ${getPhaseName('concept')}:</strong> ${cDesc}.</p>`;
    if (lDesc) html += `<p><strong>• ${getPhaseName('literature')}:</strong> ${lDesc}.</p>`;
    if (mDesc) html += `<p><strong>• ${getPhaseName('methodology')}:</strong> ${mDesc}.</p>`;
    if (wDesc) html += `<p><strong>• ${getPhaseName('writing')}:</strong> ${wDesc}.</p>`;
    if (iDesc) html += `<p><strong>• ${getPhaseName('interpretation')}:</strong> ${iDesc}.</p>`;

    if (total === 0) {
        html += `<p><em>No artificial intelligence tools were used in the preparation of this manuscript.</em></p>`;
    }

    html += `<div style="background:#f0f9ff; border-left:4px solid #2c5282; padding:20px; margin:25px 0; border-radius:0 8px 8px 0;">`;
    html += `<h3 style="margin-top:0;">Human Oversight and Verification</h3>`;
    html += `<p><strong>${valText}</strong></p>`;
    html += `</div>`;

    if (total > 0) {
        html += `<p><strong>AI tools and versions:</strong> ${tVers ? tVers : tools}</p>`;
    }

    if (pLog) {
        html += `<p><strong>Prompt transparency:</strong> A representative log of prompts and outputs is archived at: <a href="${pLog}" target="_blank">${pLog}</a></p>`;
    }

    html += `<div style="margin-top:30px; padding-top:15px; border-top:1px dashed #a0aec0; font-size:0.85rem; color:#4a5568; font-style:italic;">`;
    html += `This declaration was prepared using the open-source, privacy-preserving AITD web tool (https://ssantamarina.codeberg.page). No tracking or data storage occurred.`;
    html += `</div>`;
    html += `</div>`;
    return html;
}

// --- Update preview ---
function updatePreview() {
    preview.innerHTML = generatePreviewHTML();
}

// --- Copy with fallback ---
function copyToClipboard(text, successMsg, errorMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => showStatus(successMsg, 'success'))
            .catch(() => fallbackCopy(text, successMsg, errorMsg));
    } else {
        fallbackCopy(text, successMsg, errorMsg);
    }
}

function fallbackCopy(text, successMsg, errorMsg) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
        document.execCommand('copy');
        showStatus(successMsg, 'success');
    } catch (e) {
        showStatus(errorMsg || 'Copy failed', 'error');
    }
    document.body.removeChild(ta);
}

function showStatus(msg, type = 'success') {
    status.textContent = msg;
    status.style.background = type === 'success' ? '#38a169' : '#e53e3e';
    status.style.display = 'block';
    setTimeout(() => { status.style.display = 'none'; }, 3000);
}

// --- Download helpers ---
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
}

function downloadHTML() {
    const plain = generateDeclaration();
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>AI Transparency Declaration</title>
<style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;padding:20px;line-height:1.7;}</style>
</head>
<body>${generatePreviewHTML()}</body>
</html>`;
    downloadFile(htmlContent, 'declaration.html', 'text/html');
}

function downloadXML() {
    const t = title.value.trim() || '[Manuscript Title]';
    const a = authors.value.trim() || '[Authors]';
    const tools = aiTools.value.trim() || '[AI Tools]';
    const tVers = toolVersions.value.trim();
    const pLog = promptLog.value.trim();
    const val = getValidationText();
    const plain = generateDeclaration();
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<declaration version="AITD 1.1">
    <manuscript>
        <title>${t}</title>
        <authors>${a}</authors>
        <date>${new Date().toISOString().split('T')[0]}</date>
    </manuscript>
    <ai_use>
        <tools>${tools}</tools>
        ${tVers ? `<versions>${tVers}</versions>` : ''}
        ${pLog ? `<prompt_log>${pLog}</prompt_log>` : ''}
        <validation>${val}</validation>
    </ai_use>
    <declaration_text>${plain.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</declaration_text>
</declaration>`;
    downloadFile(xml, 'declaration.xml', 'application/xml');
}

function downloadPDF() {
    window.print();
}

// --- Event listeners ---
document.getElementById('previewBtn').addEventListener('click', updatePreview);

document.getElementById('resetBtn').addEventListener('click', function() {
    if (confirm('Reset all fields?')) {
        document.getElementById('aitdForm').reset();
        document.querySelector('input[name="validation"][value="standard"]').checked = true;
        customVal.disabled = true;
        customVal.value = '';
        preview.innerHTML = `<div class="placeholder"><i class="fas fa-file-alt fa-3x" style="color:#adb5bd; margin-bottom:15px;"></i><br>Your declaration will appear here.<br>Fill the form and click "Generate Declaration".</div>`;
    }
});

document.getElementById('copyBtn').addEventListener('click', function() {
    const text = generateDeclaration();
    copyToClipboard(text, '✓ Declaration copied!', 'Copy failed.');
});

document.getElementById('copyBibtexBtn').addEventListener('click', function() {
    const bib = generateBibTeX();
    copyToClipboard(bib, '✓ BibTeX copied!', 'Copy failed.');
});

document.getElementById('downloadHtmlBtn').addEventListener('click', downloadHTML);
document.getElementById('downloadXmlBtn').addEventListener('click', downloadXML);
document.getElementById('downloadPdfBtn').addEventListener('click', downloadPDF);

// Enable custom validation field
document.querySelectorAll('input[name="validation"]').forEach(radio => {
    radio.addEventListener('change', function() {
        customVal.disabled = this.value !== 'custom';
        if (this.value === 'custom') customVal.focus();
    });
});

// No automatic preview on load.
