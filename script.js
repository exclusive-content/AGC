document.addEventListener('DOMContentLoaded', function() {
    
    const contentContainer = document.getElementById('auto-content-container');

    /**
     * Fungsi untuk mengambil keywords dari file .txt dan menampilkan di homepage
     */
    async function loadKeywordsFromFile() {
        try {
            const response = await fetch('keyword.txt');
            if (!response.ok) {
                throw new Error('Gagal memuat file keyword.txt');
            }
            const text = await response.text();
            
            // Pisahkan teks menjadi array per baris, dan hapus baris kosong
            const keywords = text.split('\n').filter(k => k.trim() !== '');

            if (keywords.length === 0) {
                contentContainer.innerHTML = '<div class="loading-placeholder">Tidak ada keyword di dalam file.</div>';
                return;
            }

            // Kosongkan placeholder loading
            contentContainer.innerHTML = '';
            
            // Buat kartu untuk setiap keyword
            keywords.forEach(keyword => {
                const encodedTerm = encodeURIComponent(keyword);
                const imageUrl = `https://tse1.mm.bing.net/th?q=${encodedTerm}`;
                // Link mengarah ke halaman detail
                const linkUrl = `detail.html?q=${encodedTerm}`; 

                const cardHTML = `
                    <article class="content-card">
                        <a href="${linkUrl}">
                            <img src="${imageUrl}" alt="${keyword}" loading="lazy">
                            <div class="content-card-body">
                                <h3>${keyword}</h3>
                            </div>
                        </a>
                    </article>
                `;
                
                contentContainer.innerHTML += cardHTML;
            });

        } catch (error) {
            console.error('Error:', error);
            contentContainer.innerHTML = `<div class="loading-placeholder">${error.message}. Pastikan file ada dan dapat diakses.</div>`;
        }
    }

    // Panggil fungsi utama untuk memulai proses
    loadKeywordsFromFile();

});
