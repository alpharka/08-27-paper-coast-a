# Arah Desain Undangan Digital

## Tiga pendekatan awal

### Theme Name: Paper Coast
Very Brief Intro: Undangan editorial bernuansa pesisir yang tenang, dengan kertas bertekstur, biru laut pudar, dan komposisi seperti halaman majalah perjalanan.
Probability: 0.06

### Theme Name: Midnight Vows
Very Brief Intro: Romantis dan sinematik melalui latar gelap, aksen tembaga, serta cahaya lilin yang intim.
Probability: 0.03

### Theme Name: Terracotta Garden
Very Brief Intro: Hangat, organik, dan berkarakter dengan palet tanah liat, hijau zaitun, serta motif botani yang digambar seperti cap arsip.
Probability: 0.08

## Arah terpilih: Paper Coast

### Design Movement
Coastal editorial minimalism, dipadukan dengan nuansa analog travel journal dan quiet luxury. Arah ini membuat undangan terasa personal, lapang, dan tidak seperti template pernikahan seragam.

### Core Principles
1. Komposisi asimetris dan editorial; teks, foto, dan whitespace bekerja seperti spread majalah.
2. Tekstur kertas, garis kontur, dan aksen cap menjadi bahasa visual yang konsisten.
3. Warna biru laut pudar dan pasir hangat memberi suasana lembut tanpa pastel berlebihan.
4. Interaksi terasa tenang: transisi pendek, hover tipis, dan navigasi yang selalu jelas.

### Color Philosophy
Latar utama memakai bone-white dan pasir pucat agar terasa seperti kertas surat yang terkena matahari. Biru indigo pudar menjadi warna penuntun untuk struktur dan kepercayaan, sedangkan karat terracotta dipakai secukupnya sebagai aksen manusiawi dan hangat. Signature brand color: **Sea Ink #1F4B5B**, biru laut gelap yang khas, tenang, dan mudah dikenali.

### Layout Paradigm
Halaman dibangun sebagai rangkaian editorial spreads: cover fullscreen, hero dengan kolom teks yang bergeser, cerita dua kolom, detail acara dengan garis timeline, serta galeri masonry yang mengalir. Elemen tidak selalu dipusatkan; beberapa judul duduk di sisi kiri dengan ruang kosong besar, sementara foto dan detail bergerak membentuk ritme visual.

### Signature Elements
1. Garis kontur tipis seperti peta pantai pada latar tertentu.
2. Cap oval kecil bertuliskan tanggal atau inisial pasangan.
3. Frame foto dengan border offset dan label koordinat editorial.

### Interaction Philosophy
Setiap aksi memberi respons kecil dan nyata: tombol menekan ringan, section muncul perlahan saat masuk viewport, dan lightbox terasa seperti membuka lembar foto. Interaksi tidak boleh mengalahkan isi undangan.

### Animation
Cover meluncur ke atas selama 720ms dengan easing lembut. Header desktop muncul dengan opacity dan translateY ringan setelah cover selesai. Sticky nav mobile naik perlahan dari bawah. Konten reveal menggunakan opacity, translateY, dan scale tipis; galeri hanya memakai zoom kecil saat hover. Semua motion non-esensial dimatikan ketika prefers-reduced-motion aktif.

### Typography System
Display: Cormorant Garamond, dengan kombinasi regular dan semibold untuk nama pasangan serta judul section. Body: DM Sans, karena tetap bersih dan mudah dibaca pada ukuran kecil. Label editorial memakai DM Sans uppercase dengan tracking lebar. Nama pasangan boleh memakai lowercase atau title case untuk rasa yang lebih personal.

### Brand Essence
Undangan digital editorial untuk pasangan yang ingin membagikan hari besarnya dengan suasana pesisir yang tenang, intim, dan dirancang khusus—bukan template seragam.
Personality: tenang, hangat, observasional.

### Brand Voice
Headline, CTA, dan microcopy terasa seperti catatan personal: spesifik, sederhana, dan tidak berlebihan. Hindari filler seperti “Welcome to our website”.

Contoh lines:
- “Dua arah perjalanan, satu rumah untuk pulang.”
- “Simpan tanggalnya; kami ingin merayakan sore ini bersama Anda.”

### Wordmark & Logo
Emblem tanpa teks berupa dua garis ombak yang bertemu membentuk simpul kecil, dikelilingi setengah lingkaran seperti cap pos. Simbol ini dipakai di cover, header, footer, dan favicon.

### Delivery Assumptions
Data pada brief masih berupa placeholder. Implementasi akan memakai konfigurasi terpusat dengan contoh yang mudah diganti, menandai URL musik dan pembayaran sebagai data yang perlu dipersonalisasi, serta menyimpan RSVP dan guestbook secara lokal karena proyek frontend-only.

## Style Decisions

- Galeri diperlakukan sebagai satu analog coastal wedding journal: foto harus muted, romantis, dan dekat dengan suasana ceremony/travel; jika aset gagal dimuat, panel kertas tetap authored dengan caption dan label editorial.
- Area fungsional seperti RSVP dan tanda kasih mempertahankan bahasa Paper Coast melalui koordinat, garis kontur, cap pos, dan copy seperti catatan perjalanan.
- Sea Ink tetap menjadi warna struktur utama. Terracotta hanya dipakai sebagai aksen manusiawi pada tanggal, italic emphasis, stamp, dan marker kecil.
