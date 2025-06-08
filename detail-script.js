document.addEventListener('DOMContentLoaded', function() {

    const detailTitle = document.getElementById('detail-title');
    const detailImageContainer = document.getElementById('detail-image-container');
    const detailBody = document.getElementById('detail-body');
    const relatedPostsContainer = document.getElementById('related-posts-container');

    const params = new URLSearchParams(window.location.search);
    const keyword = params.get('q');

    function capitalizeEachWord(str) {
        return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    if (!keyword) {
        detailTitle.textContent = 'Konten Tidak Ditemukan';
        detailBody.innerHTML = '<p>Maaf, kata kunci tidak ditemukan. Silakan kembali ke <a href="index.html">halaman utama</a>.</p>';
        if (relatedPostsContainer) {
            relatedPostsContainer.closest('.related-posts-section').style.display = 'none';
        }
        return;
    }

    function populateMainContent(term) {
        const decodedTerm = decodeURIComponent(term).replace(/\+/g, ' ');
        const capitalizedTerm = capitalizeEachWord(decodedTerm);

        document.title = `${capitalizedTerm} | DekorInspirasi`;
        detailTitle.textContent = capitalizedTerm;

        const imageUrl = `https://tse1.mm.bing.net/th?q=${encodeURIComponent(decodedTerm)}&w=800&h=500&c=7&rs=1&p=0`;
        detailImageContainer.innerHTML = `<img src="<span class="math-inline">\{imageUrl\}" alt\="</span>{capitalizedTerm}">`;

        detailBody.innerHTML = `
            <p>Selamat datang di galeri inspirasi kami yang membahas tentang <strong>${capitalizedTerm}</strong>. Menemukan ide yang tepat untuk ${capitalizedTerm} terkadang menjadi tantangan tersendiri. Di sini, kami telah mengumpulkan berbagai referensi visual terbaik untuk membantu Anda mendapatkan gambaran yang lebih jelas dan detail.</p>
            <p>Setiap detail dalam ${capitalizedTerm} memiliki peranan penting dalam menciptakan suasana yang Anda inginkan. Mulai dari pemilihan warna, tekstur, hingga penataan elemen, semua berkontribusi pada hasil akhir. Perhatikan bagaimana para ahli memadukan berbagai komponen untuk menghasilkan sebuah karya yang harmonis dan fungsional terkait <span class="math-inline">\{capitalizedTerm\}\.</p\>
<p\>Kami berharap koleksi gambar dan ide mengenai <strong\></span>{capitalizedTerm}</strong> ini dapat memicu kreativitas Anda. Jangan ragu untuk menyimpan gambar yang Anda sukai sebagai referensi untuk proyek Anda selanjutnya. Selamat berkreasi!</p>
        `;
    }

    function generateRelatedPosts(term) {
        const script = document.createElement('script');
        script.src = `https://suggestqueries.google.com/complete/search?jsonp=handleRelatedSuggest&hl=en&client=firefox&q=${encodeURIComponent(term)}`;
        document.head.appendChild(script);

        script.onload = () => script.remove();
        script.onerror = () => {
            relatedPostsContainer.innerHTML = '<div class="loading-placeholder">Gagal memuat inspirasi terkait.</div>';
            script.remove();
        }
    }

    window.handleRelatedSuggest = function(data) {
        const suggestions = data ? data.shift() : []; // Remove the query term
        relatedPostsContainer.innerHTML = '';

        if (!suggestions || suggestions.length === 0) {
            relatedPostsContainer.closest('.related-posts-section').style.display = 'none';
            return;
        }

        const originalKeyword = decodeURIComponent(keyword).replace(/\+/g, ' ').toLowerCase();
        let relatedCount = 0;

        suggestions.forEach(relatedTerm => {
            if (relatedTerm.toLowerCase() === originalKeyword || relatedCount >= 8) return;

            relatedCount++;
            const encodedTerm = encodeURIComponent(relatedTerm);
            const imageUrl = `https://tse1.mm.bing.net/th?q=${encodedTerm}`;
            const linkUrl = `detail.html?q=${encodedTerm}`;

            const card = `
                <article class="content-card">
                    <a href="<span class="math-inline">\{linkUrl\}"\>
<img src\="</span>{imageUrl}" alt="<span class="math-inline">\{relatedTerm\}" loading\="lazy"\>
<div class\="content\-card\-body"\>
<h3\></span>{capitalizeEachWord(relatedTerm)}</h3>
                        </div>
                    </a>
                </article>
            `;
            relatedPostsContainer.innerHTML += card;
        });

        if(relatedCount === 0) {
             relatedPostsContainer.closest('.related-posts-section').style.display = 'none';
        }
    };

    populateMainContent(keyword);
    generateRelatedPosts(keyword);

});
