<svelte:head>
	<title>Tentang Kami — Grand Maison</title>
</svelte:head>

<!-- ═══════════════════ PAGE HEADER ═══════════════════ -->
<div
	class="relative overflow-hidden px-6 py-24 text-center"
	style="border-bottom:1px solid rgba(212,160,23,0.15);"
>
	<div
		class="pointer-events-none absolute inset-0"
		style="background-image:url(&quot;data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23d4a017' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E&quot;);"
	></div>
	<!-- Corner ornaments -->
	<span
		class="absolute top-6 left-8 select-none"
		style="font-family:'Cormorant Garamond',serif;font-size:3rem;color:rgba(212,160,23,0.15);"
		>❦</span
	>
	<span
		class="absolute top-6 right-8 select-none"
		style="font-family:'Cormorant Garamond',serif;font-size:3rem;color:rgba(212,160,23,0.15);transform:scaleX(-1);"
		>❦</span
	>

	<div class="relative z-10">
		<p
			style="font-family:'EB Garamond',serif;font-size:0.62rem;letter-spacing:0.45em;text-transform:uppercase;color:rgba(212,160,23,0.5);margin-bottom:1rem;"
		>
			✦ &nbsp; Sejarah &amp; Warisan &nbsp; ✦
		</p>
		<h1
			style="font-family:'Cormorant Garamond',serif;font-size:clamp(2.8rem,6vw,5rem);color:#ede0cc;font-weight:300;line-height:1;margin-bottom:0.5rem;"
		>
			Tentang
		</h1>
		<h1
			style="font-family:'Cormorant Garamond',serif;font-size:clamp(2.8rem,6vw,5rem);color:#d4a017;font-weight:300;font-style:italic;line-height:1;margin-bottom:2rem;"
		>
			Grand Maison
		</h1>
		<div
			style="display:flex;align-items:center;justify-content:center;gap:1rem;margin-bottom:1.5rem;"
		>
			<div style="width:4rem;height:1px;background:rgba(212,160,23,0.25);"></div>
			<span style="color:rgba(212,160,23,0.4);font-size:0.8rem;">❧</span>
			<div style="width:4rem;height:1px;background:rgba(212,160,23,0.25);"></div>
		</div>
		<p
			style="font-family:'EB Garamond',serif;font-size:1.1rem;font-style:italic;color:rgba(160,115,55,0.7);max-width:480px;margin:0 auto;line-height:1.8;"
		>
			Satu abad lebih merawat kemewahan, keindahan,<br />dan kehangatan untuk setiap tamu yang
			hadir.
		</p>
	</div>
</div>

<!-- ═══════════════════ SEJARAH ═══════════════════ -->
<section class="px-6 py-24">
	<div
		style="max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;"
		class="grid-cols-tentang"
	>
		<!-- Gambar placeholder kiri -->
		<div class="relative" style="min-height:420px;">
			<div
				class="absolute inset-0"
				style="background:linear-gradient(135deg,#1e0c10 0%,#140a08 60%,#1a0e06 100%);border:1px solid rgba(212,160,23,0.15);"
			>
				<img
					src="src/lib/images/grandmaison.jpg"
					alt="Grand Maison Interior"
					style="
    width:100%;
    height:100%;
    object-fit:cover;
    filter: brightness(1) contrast(1) saturate(1);
  "
				/>

				<!-- overlay dark + gold -->
				<div
					class="absolute inset-0"
					style="
       background: 
         linear-gradient(135deg, rgba(20,8,12,0.75) 0%, rgba(10,5,5,0.85) 100%),
         radial-gradient(circle at 30% 40%, rgba(212,160,23,0.15), transparent 60%);
       mix-blend-mode: multiply;
     "
				></div>

				<!-- subtle gold tint -->
				<div
					class="absolute inset-0"
					style="
       background: linear-gradient(120deg, rgba(212,160,23,0.12), transparent 60%);
     "
				></div>
			</div>
		</div>

		<!-- Teks kanan -->
		<div>
			<p
				style="font-family:'EB Garamond',serif;font-size:0.6rem;letter-spacing:0.42em;text-transform:uppercase;color:rgba(212,160,23,0.45);margin-bottom:1rem;"
			>
				✦ &nbsp; Awal Mula
			</p>
			<h2
				style="font-family:'Cormorant Garamond',serif;font-size:2.4rem;color:#ede0cc;font-weight:300;line-height:1.1;margin-bottom:1.5rem;"
			>
				Warisan yang<br /><em style="color:#d4a017;">Tak Lekang Waktu</em>
			</h2>
			<div
				style="width:2rem;height:1px;background:rgba(212,160,23,0.4);margin-bottom:1.75rem;"
			></div>
			<p
				style="font-family:'EB Garamond',serif;font-size:1rem;color:rgba(210,185,140,0.7);line-height:1.9;margin-bottom:1.2rem;"
			>
				Grand Maison berdiri pada tahun 1887, dibangun oleh Tuan Willem Hendrik de Vries — seorang
				arsitek Belanda yang terinspirasi oleh keagungan istana-istana baroque di Eropa. Dengan
				memadukan keindahan arsitektur Victoria dan Baroque, beliau menciptakan sebuah karya yang
				hingga kini menjadi ikon kemewahan di jantung Jakarta.
			</p>
			<p
				style="font-family:'EB Garamond',serif;font-size:1rem;color:rgba(210,185,140,0.7);line-height:1.9;margin-bottom:1.2rem;"
			>
				Selama lebih dari 137 tahun, Grand Maison telah menjadi saksi bisu ribuan kisah — pertemuan
				diplomatik, perayaan pernikahan kerajaan, hingga kunjungan para seniman dan sastrawan
				ternama yang mencari inspirasi di antara lorong-lorong bersejarahnya.
			</p>
			<p
				style="font-family:'EB Garamond',serif;font-size:1rem;color:rgba(210,185,140,0.7);line-height:1.9;"
			>
				Kini dikelola oleh generasi keempat keluarga de Vries bersama manajemen profesional
				Indonesia, kami terus merawat setiap ornamen, setiap pilar, dan setiap detail yang
				menjadikan Grand Maison bukan sekadar hotel — melainkan sebuah pengalaman hidup.
			</p>
		</div>
	</div>
</section>

<!-- ═══════════════════ STATISTIK ═══════════════════ -->
<section
	class="px-6 py-16"
	style="border-top:1px solid rgba(212,160,23,0.1);border-bottom:1px solid rgba(212,160,23,0.1);background:rgba(212,160,23,0.02);"
>
	<div style="max-width:800px;margin:0 auto;">
		<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:2rem;text-align:center;">
			{#each [['137', 'Tahun Berdiri'], ['48', 'Kamar & Suite'], ['15', 'Penghargaan'], ['50.000+', 'Tamu Setia']] as [num, label]}
				<div style="padding:1.5rem 0;">
					<div
						style="font-family:'Cormorant Garamond',serif;font-size:2.8rem;color:#d4a017;font-weight:300;line-height:1;margin-bottom:0.4rem;"
					>
						{num}
					</div>
					<div
						style="width:1.5rem;height:1px;background:rgba(212,160,23,0.3);margin:0 auto 0.6rem;"
					></div>
					<div
						style="font-family:'EB Garamond',serif;font-size:0.6rem;letter-spacing:0.28em;text-transform:uppercase;color:rgba(160,115,55,0.55);"
					>
						{label}
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ═══════════════════ VISI & MISI ═══════════════════ -->
<section class="px-6 py-24">
	<div style="max-width:1100px;margin:0 auto;">
		<div class="text-center" style="margin-bottom:4rem;">
			<p
				style="font-family:'EB Garamond',serif;font-size:0.6rem;letter-spacing:0.42em;text-transform:uppercase;color:rgba(212,160,23,0.45);margin-bottom:1rem;"
			>
				✦ &nbsp; Nilai Kami
			</p>
			<h2
				style="font-family:'Cormorant Garamond',serif;font-size:2.6rem;color:#ede0cc;font-weight:300;"
			>
				Visi &amp; <em style="color:#d4a017;">Misi</em>
			</h2>
		</div>

		<div style="display:grid;grid-template-columns:1fr 1fr;gap:2rem;">
			<!-- Visi -->
			<div
				class="relative overflow-hidden p-8"
				style="border:1px solid rgba(212,160,23,0.18);background:rgba(28,10,15,0.6);"
			>
				<div
					class="absolute top-0 right-0 left-0 h-px"
					style="background:linear-gradient(to right,transparent,rgba(212,160,23,0.5),transparent);"
				></div>
				<span
					class="absolute top-3 right-4 select-none"
					style="color:rgba(212,160,23,0.15);font-size:1.2rem;">✦</span
				>
				<p
					style="font-family:'EB Garamond',serif;font-size:0.58rem;letter-spacing:0.38em;text-transform:uppercase;color:rgba(212,160,23,0.45);margin-bottom:1rem;"
				>
					Visi
				</p>
				<h3
					style="font-family:'Cormorant Garamond',serif;font-size:1.5rem;color:#ede0cc;font-weight:300;margin-bottom:1rem;line-height:1.2;"
				>
					Menjadi Penjaga Kemewahan Klasik di Asia Tenggara
				</h3>
				<p
					style="font-family:'EB Garamond',serif;font-size:0.95rem;color:rgba(200,170,110,0.65);line-height:1.85;"
				>
					Kami bercita-cita menjadi hotel bersejarah paling dihormati di Asia Tenggara — tempat di
					mana keindahan masa lalu berpadu harmonis dengan kenyamanan masa kini, tanpa mengkhianati
					satu pun nilai warisan yang kami emban.
				</p>
			</div>

			<!-- Misi -->
			<div
				class="relative overflow-hidden p-8"
				style="border:1px solid rgba(212,160,23,0.18);background:rgba(28,10,15,0.6);"
			>
				<div
					class="absolute top-0 right-0 left-0 h-px"
					style="background:linear-gradient(to right,transparent,rgba(212,160,23,0.5),transparent);"
				></div>
				<span
					class="absolute top-3 right-4 select-none"
					style="color:rgba(212,160,23,0.15);font-size:1.2rem;">✦</span
				>
				<p
					style="font-family:'EB Garamond',serif;font-size:0.58rem;letter-spacing:0.38em;text-transform:uppercase;color:rgba(212,160,23,0.45);margin-bottom:1rem;"
				>
					Misi
				</p>
				<h3
					style="font-family:'Cormorant Garamond',serif;font-size:1.5rem;color:#ede0cc;font-weight:300;margin-bottom:1rem;line-height:1.2;"
				>
					Merawat Setiap Detail, Menghargai Setiap Tamu
				</h3>
				<ul
					style="font-family:'EB Garamond',serif;font-size:0.95rem;color:rgba(200,170,110,0.65);line-height:2;list-style:none;padding:0;margin:0;"
				>
					<li style="display:flex;gap:0.6rem;align-items:flex-start;">
						<span style="color:rgba(212,160,23,0.5);margin-top:0.25rem;flex-shrink:0;">✦</span> Melestarikan
						arsitektur dan ornamen bersejarah
					</li>
					<li style="display:flex;gap:0.6rem;align-items:flex-start;">
						<span style="color:rgba(212,160,23,0.5);margin-top:0.25rem;flex-shrink:0;">✦</span> Memberikan
						pelayanan yang personal dan tulus
					</li>
					<li style="display:flex;gap:0.6rem;align-items:flex-start;">
						<span style="color:rgba(212,160,23,0.5);margin-top:0.25rem;flex-shrink:0;">✦</span> Menghadirkan
						pengalaman budaya yang autentik
					</li>
					<li style="display:flex;gap:0.6rem;align-items:flex-start;">
						<span style="color:rgba(212,160,23,0.5);margin-top:0.25rem;flex-shrink:0;">✦</span> Menjaga
						keberlanjutan untuk generasi mendatang
					</li>
				</ul>
			</div>
		</div>
	</div>
</section>

<!-- ═══════════════════ TIMELINE ═══════════════════ -->
<section
	class="px-6 py-24"
	style="background:rgba(212,160,23,0.02);border-top:1px solid rgba(212,160,23,0.1);"
>
	<div style="max-width:720px;margin:0 auto;">
		<div class="text-center" style="margin-bottom:4rem;">
			<p
				style="font-family:'EB Garamond',serif;font-size:0.6rem;letter-spacing:0.42em;text-transform:uppercase;color:rgba(212,160,23,0.45);margin-bottom:1rem;"
			>
				✦ &nbsp; Perjalanan Kami
			</p>
			<h2
				style="font-family:'Cormorant Garamond',serif;font-size:2.6rem;color:#ede0cc;font-weight:300;"
			>
				Lintas <em style="color:#d4a017;">Sejarah</em>
			</h2>
		</div>

		<!-- Timeline items -->
		<div style="position:relative;padding-left:2rem;">
			<!-- Vertical line -->
			<div
				class="absolute top-0 bottom-0 left-0"
				style="width:1px;background:linear-gradient(to bottom,transparent,rgba(212,160,23,0.3) 10%,rgba(212,160,23,0.3) 90%,transparent);left:6px;"
			></div>

			{#each [['1887', 'Pendirian Grand Maison', 'Tuan Willem Hendrik de Vries meletakkan batu pertama Grand Maison di Batavia (kini Jakarta). Bangunan selesai dalam tiga tahun dengan mendatangkan pengrajin stucco dari Italia dan kayu jati dari Jepara.'], ['1920', 'Era Keemasan Pertama', 'Grand Maison menjadi pusat pertemuan para diplomat, bangsawan lokal, dan seniman Eropa. Ballroom Baroque pertama kali dibuka dan langsung menjadi venue paling bergengsi di Hindia Belanda.'], ['1945', 'Saksi Kemerdekaan', 'Beberapa tokoh proklamasi kemerdekaan Indonesia dilaporkan mengadakan pertemuan rahasia di Perpustakaan Grand Maison. Hotel ini menjadi simbol transisi dari era kolonial ke era baru.'], ['1972', 'Renovasi Besar Pertama', 'Generasi kedua keluarga de Vries melakukan renovasi menyeluruh selama dua tahun. Setiap ornamen dan lukisan langit-langit direstorasi oleh tim konservator dari Belanda dan Indonesia.'], ['2001', 'Warisan Nasional', 'Pemerintah Republik Indonesia menetapkan Grand Maison sebagai Cagar Budaya Nasional. Penghargaan ini mengukuhkan komitmen kami untuk menjaga warisan arsitektur untuk generasi mendatang.'], ['2024', 'Era Digital & AI', 'Mempertahankan jiwa klasik sambil merangkul teknologi — Grand Maison meluncurkan layanan Concierge AI "Isabelle" untuk memastikan setiap tamu mendapat pelayanan personal yang sempurna, kapan pun dibutuhkan.']] as [year, title, desc], i}
				<div style="position:relative;padding:0 0 2.5rem 2rem;{i === 5 ? 'padding-bottom:0' : ''}">
					<!-- Dot -->
					<div
						style="position:absolute;left:-4px;top:4px;width:9px;height:9px;border-radius:50%;background:#d4a017;box-shadow:0 0 0 3px rgba(212,160,23,0.15);"
					></div>
					<!-- Year -->
					<p
						style="font-family:'EB Garamond',serif;font-size:0.58rem;letter-spacing:0.38em;text-transform:uppercase;color:rgba(212,160,23,0.5);margin-bottom:0.35rem;"
					>
						{year}
					</p>
					<!-- Title -->
					<h3
						style="font-family:'Cormorant Garamond',serif;font-size:1.25rem;color:#ede0cc;font-weight:300;margin-bottom:0.5rem;"
					>
						{title}
					</h3>
					<!-- Desc -->
					<p
						style="font-family:'EB Garamond',serif;font-size:0.92rem;color:rgba(200,170,110,0.6);line-height:1.85;"
					>
						{desc}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ═══════════════════ TIM KAMI ═══════════════════ -->
<section class="px-6 py-24">
	<div style="max-width:1100px;margin:0 auto;">
		<div class="text-center" style="margin-bottom:4rem;">
			<p
				style="font-family:'EB Garamond',serif;font-size:0.6rem;letter-spacing:0.42em;text-transform:uppercase;color:rgba(212,160,23,0.45);margin-bottom:1rem;"
			>
				✦ &nbsp; Orang-Orang di Balik Maison
			</p>
			<h2
				style="font-family:'Cormorant Garamond',serif;font-size:2.6rem;color:#ede0cc;font-weight:300;"
			>
				Tim <em style="color:#d4a017;">Kepemimpinan</em>
			</h2>
		</div>

		<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2rem;">
			{#each [['AM', 'Arjuna de Vries', 'General Manager', 'Generasi keempat keluarga pendiri. Lulus dari École Hôtelière de Lausanne, membawa visi memadukan warisan dan modernitas.'], ['SR', 'Sari Ratnasari', 'Director of Guest Experience', '20 tahun pengalaman di industri perhotelan mewah Asia. Pelopor program butler personalisasi Grand Maison.'], ['DH', 'Danu Hartono', 'Head of Heritage Conservation', 'Arsitek konservasi lulusan ITB. Bertanggung jawab atas pemeliharaan setiap ornamen dan struktur bersejarah hotel.']] as [initials, name, role, bio]}
				<div
					class="relative overflow-hidden p-7"
					style="border:1px solid rgba(212,160,23,0.15);background:rgba(20,8,12,0.6);"
				>
					<div
						class="absolute top-0 right-0 left-0 h-px"
						style="background:linear-gradient(to right,transparent,rgba(212,160,23,0.35),transparent);"
					></div>
					<!-- Avatar -->
					<div
						style="width:4rem;height:4rem;border:1px solid rgba(212,160,23,0.3);background:rgba(212,160,23,0.07);display:flex;align-items:center;justify-content:center;margin-bottom:1.25rem;"
					>
						<span
							style="font-family:'Cormorant Garamond',serif;font-size:1.3rem;color:#d4a017;font-weight:300;"
							>{initials}</span
						>
					</div>
					<h3
						style="font-family:'Cormorant Garamond',serif;font-size:1.2rem;color:#ede0cc;font-weight:300;margin-bottom:0.2rem;"
					>
						{name}
					</h3>
					<p
						style="font-family:'EB Garamond',serif;font-size:0.58rem;letter-spacing:0.28em;text-transform:uppercase;color:rgba(212,160,23,0.42);margin-bottom:1rem;"
					>
						{role}
					</p>
					<div
						style="width:1.5rem;height:1px;background:rgba(212,160,23,0.25);margin-bottom:0.9rem;"
					></div>
					<p
						style="font-family:'EB Garamond',serif;font-size:0.88rem;color:rgba(200,170,110,0.58);line-height:1.8;font-style:italic;"
					>
						{bio}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ═══════════════════ PENGHARGAAN ═══════════════════ -->
<section
	class="px-6 py-20"
	style="border-top:1px solid rgba(212,160,23,0.1);background:rgba(212,160,23,0.02);"
>
	<div style="max-width:1100px;margin:0 auto;">
		<div class="text-center" style="margin-bottom:3rem;">
			<p
				style="font-family:'EB Garamond',serif;font-size:0.6rem;letter-spacing:0.42em;text-transform:uppercase;color:rgba(212,160,23,0.45);margin-bottom:1rem;"
			>
				✦ &nbsp; Pengakuan Dunia
			</p>
			<h2
				style="font-family:'Cormorant Garamond',serif;font-size:2.6rem;color:#ede0cc;font-weight:300;"
			>
				Penghargaan &amp; <em style="color:#d4a017;">Sertifikasi</em>
			</h2>
		</div>

		<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;">
			{#each [['✦', 'Forbes Travel Guide', 'Five-Star Award', '2019 – 2024'], ['◆', 'UNESCO', 'Heritage Hotel of Excellence', '2021'], ['✧', 'Condé Nast Traveller', 'Top Hotel Asia-Pacific', '2020 & 2023'], ['⊕', 'World Travel Awards', 'Indonesia Leading Boutique Hotel', '2018 – 2024'], ['❧', 'TripAdvisor', 'Travelers Choice — Hall of Fame', '2015 – 2024'], ['✦', 'Green Globe', 'Sustainable Heritage Hotel Certified', '2022']] as [icon, org, award, year]}
				<div
					class="relative p-5"
					style="border:1px solid rgba(212,160,23,0.12);display:flex;gap:1rem;align-items:flex-start;"
				>
					<span style="color:rgba(212,160,23,0.4);font-size:1rem;flex-shrink:0;margin-top:0.15rem;"
						>{icon}</span
					>
					<div>
						<p
							style="font-family:'EB Garamond',serif;font-size:0.55rem;letter-spacing:0.28em;text-transform:uppercase;color:rgba(212,160,23,0.38);margin-bottom:0.25rem;"
						>
							{org}
						</p>
						<p
							style="font-family:'Cormorant Garamond',serif;font-size:1rem;color:#ede0cc;font-weight:300;margin-bottom:0.15rem;"
						>
							{award}
						</p>
						<p
							style="font-family:'EB Garamond',serif;font-size:0.78rem;color:rgba(160,115,55,0.5);font-style:italic;"
						>
							{year}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ═══════════════════ CTA ═══════════════════ -->
<section class="relative overflow-hidden px-6 py-24 text-center">
	<div
		class="pointer-events-none absolute inset-0"
		style="background:radial-gradient(ellipse 60% 70% at 50% 50%,rgba(100,35,20,0.12) 0%,transparent 70%);"
	></div>
	<div
		class="absolute inset-x-0 top-0 h-px"
		style="background:linear-gradient(to right,transparent,rgba(212,160,23,0.2),transparent);"
	></div>

	<div class="relative" style="max-width:520px;margin:0 auto;">
		<span
			style="color:rgba(212,160,23,0.3);font-size:1.5rem;display:block;margin-bottom:1.5rem;font-family:'Cormorant Garamond',serif;"
			>✦</span
		>
		<h2
			style="font-family:'Cormorant Garamond',serif;font-size:2.4rem;color:#ede0cc;font-weight:300;line-height:1.15;margin-bottom:1rem;"
		>
			Jadilah Bagian dari<br /><em style="color:#d4a017;">Sejarah Kami</em>
		</h2>
		<div
			style="display:flex;align-items:center;justify-content:center;gap:1rem;margin-bottom:1.25rem;"
		>
			<div style="flex:1;max-width:80px;height:1px;background:rgba(212,160,23,0.2);"></div>
			<span style="color:rgba(212,160,23,0.3);font-size:0.7rem;">❧</span>
			<div style="flex:1;max-width:80px;height:1px;background:rgba(212,160,23,0.2);"></div>
		</div>
		<p
			style="font-family:'EB Garamond',serif;font-size:1rem;font-style:italic;color:rgba(160,115,55,0.6);margin-bottom:2.5rem;line-height:1.8;"
		>
			Setiap tamu yang menginap turut menulis satu halaman<br />baru dalam sejarah panjang Grand
			Maison.
		</p>
		<div style="display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;">
			<a href="/booking" class="btn-primary">Reservasi Sekarang</a>
			<a href="/kamar" class="btn-outline">Lihat Kamar</a>
		</div>
	</div>
</section>

<style>
	@media (max-width: 768px) {
		.grid-cols-tentang {
			grid-template-columns: 1fr !important;
		}
	}
</style>
