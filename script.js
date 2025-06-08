document.addEventListener('DOMContentLoaded', function() {
    
    // Variabel untuk mengelola state
    let allKeywords = [];
    let currentIndex = 0;
    const batchSize = 15;
    let isLoading = false;

    // Elemen DOM
    const contentContainer = document.getElementById('auto-content-container');
    const loader = document.getElementById('loader');

    /**
     * Fungsi untuk memuat dan menampilkan batch keyword berikutnya.
     */
    function loadNextBatch() {
        if (isLoading) return;
        isLoading = true;
        loader.style.display = 'block';

        // Ambil batch keyword berikutnya dari array allKeywords
        const batch = allKeywords.slice(currentIndex, currentIndex + batchSize);
        
        // Simulasikan sedikit jeda (seperti mengambil dari network) agar loader terlihat
        setTimeout(() => {
            batch.forEach(keyword => {
                const encodedTerm = encodeURIComponent(keyword);
                const imageUrl = `https://tse1.mm.bing.net/th?q=${encodedTerm}`;
                const linkUrl = `detail.html?q=${encodedTerm}`; 

               const cardHTML = `
                <article class="content-card">
                    <a href="<span class="math-inline">\{linkUrl\}"\>
                    <img src\="</span>{imageUrl}" alt="<span class="math-inline">\{keyword\}" loading\="lazy"\>
                    <div class\="content\-card\-body"\>
                        \{/\* Ubah baris ini \*/\}
                        <h3\></span>{capitalizeEachWord(keyword)}</h3>
                                    </div>
                                </a>
                    </article>
                    `;
                contentContainer.innerHTML += cardHTML;
            });

            // Update index untuk batch berikutnya
            currentIndex += batch.length;
            
            // Sembunyikan loader setelah selesai
            loader.style.display = 'none';
            isLoading = false;

            // Jika semua keyword sudah dimuat, hapus event listener scroll
            if (currentIndex >= allKeywords.length) {
                window.removeEventListener('scroll', handleInfiniteScroll);
                loader.style.display = 'none'; // Pastikan loader benar-benar hilang
            }

        }, 500); // Jeda 0.5 detik
    }

    /**
     * Fungsi yang menangani event scroll
     */
    function handleInfiniteScroll() {
        // Cek jika pengguna sudah scroll mendekati bagian bawah halaman
        // (window.innerHeight + window.scrollY) = posisi bawah viewport
        // document.documentElement.offsetHeight = tinggi total halaman
        if ((window.innerHeight + window.scrollY) >= document.documentElement.offsetHeight - 100) {
            loadNextBatch();
        }
    }

    /**
     * Fungsi inisialisasi: mengambil semua keyword dari file.
     */
    async function initialize() {
        try {
            const response = await fetch('keyword.txt');
            if (!response.ok) throw new Error('File keyword.txt tidak ditemukan.');
            
            const text = await response.text();
            allKeywords = text.split('\n').filter(k => k.trim() !== '');

            if (allKeywords.length > 0) {
                // Muat batch pertama
                loadNextBatch();
                // Pasang event listener untuk scroll
                window.addEventListener('scroll', handleInfiniteScroll);
            } else {
                contentContainer.innerHTML = '<p>Tidak ada keyword untuk ditampilkan.</p>';
                loader.style.display = 'none';
            }
        } catch (error) {
            console.error('Error:', error);
            contentContainer.innerHTML = `<p style="text-align:center; color:red;">${error.message}</p>`;
            loader.style.display = 'none';
        }
    }

    // Mulai semuanya
    initialize();
});

function capitalizeEachWord(str) {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}
