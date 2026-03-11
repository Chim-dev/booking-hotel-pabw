import { ANTHROPIC_API_KEY } from '$env/static/private';

const SYSTEM_PROMPT = `Anda adalah "Isabelle", Concierge AI eksklusif dari Grand Maison — hotel mewah bergaya Victorian dan Baroque berdiri sejak 1887 di Jakarta.

Kepribadian Anda:
- Elegan, sopan, dan profesional namun hangat
- Berbicara dengan Bahasa Indonesia yang indah dan formal
- Sesekali menyapa tamu dengan "Tuan" atau "Nyonya" jika konteksnya sesuai
- Tidak pernah membicarakan hal di luar konteks hotel dan perhotelan

Kamar yang tersedia:
| Tipe               | Harga/malam     | Luas  | Maks Tamu | Unggulan                        |
|--------------------|-----------------|-------|-----------|---------------------------------|
| Superior Klasik    | Rp 1.750.000    | 32 m² | 2         | Rain shower, city view, sarapan |
| Deluxe Victoria    | Rp 2.850.000    | 45 m² | 2         | Bathtub antik, balkon, butler   |
| Premier Mezzanine  | Rp 3.900.000    | 60 m² | 2         | Mezzanine, soaking tub, minibar |
| Suite Baroque Grand| Rp 5.500.000    | 90 m² | 4         | Living room, marble bath, 24/7 butler, champagne |

Fasilitas Hotel:
- Grand Dining (restoran fine dining Perancis-Jawa)
- Royal Spa (perawatan tradisional & modern)
- Ballroom Baroque (kapasitas 500 tamu)
- Perpustakaan dengan koleksi buku antik
- Kolam Renang Victoria (outdoor, marmer klasik)
- Concierge 24/7

Info Penting:
- Alamat: Jl. Merdeka Raya No. 1, Jakarta Pusat 10110
- Telepon: +62 21 1234 5678
- Check-in: 14.00 WIB | Check-out: 12.00 WIB
- Early check-in & late check-out tersedia (surcharge berlaku)

Tugas utama Anda:
1. Sambut tamu dengan hangat
2. Bantu pilih kamar sesuai kebutuhan, jumlah tamu, dan anggaran
3. Jelaskan fasilitas secara detail jika ditanya
4. Hitung total harga (harga kamar × jumlah malam + pajak 11%)
5. Arahkan ke halaman /booking untuk menyelesaikan reservasi
6. Jawab FAQ seputar hotel

Jika tamu meminta rekomendasi, tanyakan: tujuan kunjungan, jumlah tamu, dan anggaran. Kemudian berikan 1-2 rekomendasi terbaik dengan alasan yang jelas.

Selalu akhiri respons dengan pertanyaan atau ajakan yang mendorong tamu melanjutkan percakapan atau menuju halaman booking.`;

const tools = [
  {
    name: 'calculate_price',
    description: 'Hitung total harga menginap berdasarkan tipe kamar dan jumlah malam',
    input_schema: {
      type: 'object',
      properties: {
        room_type: {
          type: 'string',
          enum: ['superior', 'deluxe', 'premier', 'suite'],
          description: 'Tipe kamar yang dipilih'
        },
        nights: {
          type: 'number',
          description: 'Jumlah malam menginap'
        },
        guests: {
          type: 'number',
          description: 'Jumlah tamu'
        }
      },
      required: ['room_type', 'nights']
    }
  },
  {
    name: 'get_room_detail',
    description: 'Ambil detail lengkap sebuah tipe kamar',
    input_schema: {
      type: 'object',
      properties: {
        room_type: {
          type: 'string',
          enum: ['superior', 'deluxe', 'premier', 'suite']
        }
      },
      required: ['room_type']
    }
  },
  {
    name: 'create_booking_link',
    description: 'Buat link booking dengan parameter yang sudah terisi otomatis untuk memudahkan tamu',
    input_schema: {
      type: 'object',
      properties: {
        room_type: { type: 'string' },
        check_in:  { type: 'string', description: 'Format YYYY-MM-DD' },
        check_out: { type: 'string', description: 'Format YYYY-MM-DD' },
        guests:    { type: 'number' }
      },
      required: ['room_type']
    }
  }
];

function processTool(toolName, toolInput) {
  const rooms = {
    superior: { name: 'Superior Klasik',     price: 1750000, size: '32 m²', maxGuests: 2 },
    deluxe:   { name: 'Deluxe Victoria',     price: 2850000, size: '45 m²', maxGuests: 2 },
    premier:  { name: 'Premier Mezzanine',   price: 3900000, size: '60 m²', maxGuests: 2 },
    suite:    { name: 'Suite Baroque Grand', price: 5500000, size: '90 m²', maxGuests: 4 },
  };

  if (toolName === 'calculate_price') {
    const room   = rooms[toolInput.room_type];
    const nights = toolInput.nights || 1;
    const subtotal = room.price * nights;
    const tax      = Math.round(subtotal * 0.11);
    const total    = subtotal + tax;
    const fmt = n => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
    return {
      room: room.name,
      nights,
      price_per_night: fmt(room.price),
      subtotal: fmt(subtotal),
      tax_11pct: fmt(tax),
      grand_total: fmt(total)
    };
  }

  if (toolName === 'get_room_detail') {
    const room = rooms[toolInput.room_type];
    const features = {
      superior: ['Queen Bed', 'Rain Shower', 'City View', 'Sarapan Inklusif', 'WiFi'],
      deluxe:   ['King Bed', 'Bathtub Antik Clawfoot', 'Balkon Privat', 'Butler Service', 'Sarapan Inklusif'],
      premier:  ['King Bed', 'Level Mezzanine', 'Soaking Tub', 'Mini Bar Premium', 'Panoramic View'],
      suite:    ['King Bed + Sofa Bed', 'Living Room Terpisah', 'Marble Bathroom', 'Butler 24/7', 'Champagne Welcome', 'Dining Area Privat'],
    };
    return { ...room, features: features[toolInput.room_type] };
  }

  if (toolName === 'create_booking_link') {
    const params = new URLSearchParams();
    if (toolInput.room_type) params.set('roomType', toolInput.room_type);
    if (toolInput.check_in)  params.set('checkIn', toolInput.check_in);
    if (toolInput.check_out) params.set('checkOut', toolInput.check_out);
    if (toolInput.guests)    params.set('guests', toolInput.guests);
    return { booking_url: `/booking?${params.toString()}`, message: 'Link booking berhasil dibuat' };
  }

  return { error: 'Tool tidak ditemukan' };
}

export async function POST({ request }) {
  try {
    const { messages } = await request.json();

    // Agentic loop — maks 5 iterasi untuk handle tool use
    let currentMessages = [...messages];

    for (let i = 0; i < 5; i++) {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          tools,
          messages: currentMessages,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        return new Response(JSON.stringify({ error: err }), { status: 500 });
      }

      const data = await res.json();

      // Jika selesai dengan text biasa
      if (data.stop_reason === 'end_turn') {
        const text = data.content.find(b => b.type === 'text')?.text ?? '';
        return new Response(JSON.stringify({ reply: text }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Ada tool use — proses semua tool
      if (data.stop_reason === 'tool_use') {
        const toolUseBlocks = data.content.filter(b => b.type === 'tool_use');

        // Tambah respons assistant ke history
        currentMessages.push({ role: 'assistant', content: data.content });

        // Proses setiap tool dan kumpulkan hasilnya
        const toolResults = toolUseBlocks.map(block => ({
          type: 'tool_result',
          tool_use_id: block.id,
          content: JSON.stringify(processTool(block.name, block.input)),
        }));

        // Tambah hasil tool ke history
        currentMessages.push({ role: 'user', content: toolResults });

        // Lanjut iterasi untuk mendapat respons final
        continue;
      }

      // Stop reason lain
      break;
    }

    return new Response(JSON.stringify({ reply: 'Maaf, terjadi kesalahan. Silakan coba lagi.' }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    console.error('Chat API error:', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}