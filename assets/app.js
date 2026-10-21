/* Offline reader: classic scripts work when opened through file://. */
const search = document.getElementById('search')
const reading = document.getElementById('reading')
const results = document.getElementById('search-results')
const status = document.getElementById('status')
const rootPrefix = document.body.dataset.rootPrefix || ''
const documents = window.QA_KT_SEARCH || []
const escapeHtml = (value) =>
    String(value).replace(
        /[&<>"']/g,
        (character) =>
            ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
            })[character]
    )

function showReading() {
    reading.hidden = false
    results.hidden = true
    status.textContent = `${documents.length} documents · works offline`
}

function showResults() {
    const query = search.value.trim().toLowerCase()
    if (!query) {
        showReading()
        return
    }
    const terms = query.split(/\s+/)
    const matches = documents
        .filter((doc) => terms.every((term) => doc.search.includes(term)))
        .sort(
            (a, b) =>
                Number(b.title.toLowerCase().includes(query)) -
                Number(a.title.toLowerCase().includes(query))
        )
    status.textContent = `${matches.length} documents match`
    reading.hidden = true
    results.hidden = false
    results.innerHTML =
        '<h1>Search results</h1><p>All search words must match. Open a page, then use your browser’s Find to locate each occurrence.</p>' +
        (matches.length
            ? matches
                  .map((doc) => {
                      const position = doc.text.toLowerCase().indexOf(terms[0])
                      const start = Math.max(0, position - 90)
                      return `<div class="result"><a href="${escapeHtml(rootPrefix + doc.id)}">${escapeHtml(doc.title)}</a><div class="meta">${escapeHtml(doc.id)}</div><p>${escapeHtml(doc.text.slice(start, start + 330))}…</p></div>`
                  })
                  .join('')
            : '<p>No matching documents. Try a field name, file name, or shorter phrase.</p>')
}

let timer
search.addEventListener('input', () => {
    clearTimeout(timer)
    timer = setTimeout(showResults, 150)
})
search.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        clearTimeout(timer)
        search.value = ''
        showReading()
    }
})
document.getElementById('print').addEventListener('click', () => window.print())
showReading()
