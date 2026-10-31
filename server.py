"""
GPdI Warta Jemaat Digital - Backend Server with Cloud/Local REST API
Serves static web files and provides REST API with persistent database storage.
"""

import http.server
import socketserver
import json
import os
import urllib.parse
import mimetypes
import base64
from datetime import datetime

PORT = 8080
DB_FILE = os.path.join(os.path.dirname(__file__), "database.json")
UPLOADS_DIR = os.path.join(os.path.dirname(__file__), "assets", "uploads")

os.makedirs(UPLOADS_DIR, exist_ok=True)

DEFAULT_DATABASE = {
    "church": {
        "name": "GPdI Gosyen Kaloran",
        "denomination": "Gereja Pantekosta di Indonesia",
        "headerTop": "GPdI Gosyen Kaloran",
        "headerBottom": "Warta Jemaat",
        "mapsUrl": "https://maps.app.goo.gl/CNYqT17tYnc58aD1A",
        "pin": "gosyen123"
    },
    "visibility": {
        "warta": True,
        "jadwalIbadah": True,
        "pengumuman": True,
        "jadwalPersekutuan": True,
        "dokumentasi": True,
        "renungan": True,
        "maps": True
    },
    "pengumuman": [
        {
            "id": "ann_1",
            "judul": "Ibadah Syukur & Perjamuan Kudus Awal Bulan",
            "deskripsi": "Mengundang seluruh jemaat GPdI Gosyen Kaloran untuk hadir bersekutu bersama dalam Ibadah Raya & Perjamuan Kudus. Mari mempersiapkan hati untuk menerima berkat & kekuatan baru di hadirat Tuhan.",
            "tanggal": "1 November 2026",
            "mediaType": "image",
            "mediaUrl": "./assets/warta-sample.png",
            "fileName": "warta-november.png",
            "active": True,
            "createdAt": 1793088000000
        },
        {
            "id": "ann_2",
            "judul": "Pemberitahuan Pelayanan Diakonia & Kasih Jemaat",
            "deskripsi": "Bagi jemaat yang rindu mendukung pelayanan sosial dan diakonia bagi sesama yang membutuhkan, silakan menghubungi pengurus majelis gereja.",
            "tanggal": "Oktober 2026",
            "mediaType": "document",
            "mediaUrl": "",
            "fileName": "Tata-Tertib-Pelayanan.pdf",
            "active": True,
            "createdAt": 1793080000000
        }
    ],
    "warta": {
        "editionDate": "November 2026",
        "subtitle": "Edisi Ibadah Raya & Perjamuan Kudus",
        "imageUrl": "./assets/warta-sample.png",
        "updatedAt": "November 2026",
        "createdAt": 1793088000000,
        "isExpired": False
    },
    "jadwalIbadah": [
        {"id": "j1", "hari": "Minggu", "jam": "06.00 WIB", "nama": "Ibadah Raya", "keterangan": "Setiap Minggu"},
        {"id": "j2", "hari": "Minggu", "jam": "06.00 WIB", "nama": "Ibadah Perjamuan Kudus", "keterangan": "Tiap Minggu Pertama"},
        {"id": "j3", "hari": "Minggu", "jam": "09.00 WIB", "nama": "Sekolah Minggu", "keterangan": "Setiap Minggu"},
        {"id": "j4", "hari": "Rabu", "jam": "15.00 WIB", "nama": "Ibadah Wanita", "keterangan": "Setiap Rabu"},
        {"id": "j5", "hari": "Kamis", "jam": "19.00 WIB", "nama": "Ibadah Pria", "keterangan": "Tiap Kamis Ke-4"},
        {"id": "j6", "hari": "Sabtu", "jam": "18.30 WIB", "nama": "Ibadah Pemuda Remaja", "keterangan": "Setiap Sabtu"}
    ],
    "jadwalPersekutuan": [
        {"id": "p1", "nama": "MEZBAH KELUARGA RAYON", "deskripsi": "Rayon 1 (Senin) | Rayon 2 (Rabu)", "waktu": "19.00 WIB", "icon": "groups"},
        {"id": "p2", "nama": "KEBAKTIAN WANITA (PELWAP)", "deskripsi": "Balson Gedung Gereja • Pdt. Ibu Nani", "waktu": "16.00 WIB", "icon": "favorite_border"},
        {"id": "p3", "nama": "GERAKAN KEBERSIHAN GEREJA", "deskripsi": "Jumat bersama segenap jemaat", "waktu": "09.00 WIB", "icon": "cleaning_services"}
    ],
    "dokumentasi": [
        {
            "id": "doc_f1",
            "name": "Ibadah Raya & Perjamuan Kudus",
            "date": "Oktober 2026",
            "photos": [
                {"id": "ph1", "title": "Suasana Ibadah", "url": "./assets/warta-sample.png"}
            ]
        },
        {
            "id": "doc_f2",
            "name": "Pelayanan Wanita (PELWAP)",
            "date": "Oktober 2026",
            "photos": []
        },
        {
            "id": "doc_f3",
            "name": "Pemuda & Remaja Gosyen",
            "date": "September 2026",
            "photos": []
        }
    ],
    "renungan": {
        "folders": [
            {
                "id": "root_2026",
                "name": "Tahun 2026",
                "parentId": None,
                "folders": [
                    {
                        "id": "f_nov_2026",
                        "name": "November 2026",
                        "parentId": "root_2026",
                        "folders": []
                    },
                    {
                        "id": "f_okt_2026",
                        "name": "Oktober 2026",
                        "parentId": "root_2026",
                        "folders": []
                    }
                ]
            }
        ],
        "articles": [
            {
                "id": "art_1",
                "folderId": "f_nov_2026",
                "title": "Kasih Karunia yang Melimpah",
                "date": "1 November 2026",
                "ayat": "Efesus 2:8-9",
                "konten": "Sebab karena kasih karunia kamu diselamatkan oleh iman; itu bukan hasil usahamu, tetapi pemberian Allah, itu bukan hasil pekerjaanmu: jangan ada orang yang memegahkan diri. Marilah kita senantiasa bersyukur atas anugerah keselamatan yang kekal di dalam Kristus Yesus.",
                "imageUrl": ""
            },
            {
                "id": "art_2",
                "folderId": "f_okt_2026",
                "title": "Setia dalam Perkara Kecil",
                "date": "25 Oktober 2026",
                "ayat": "Lukas 16:10",
                "konten": "Barangsiapa setia dalam perkara-perkara kecil, ia setia juga dalam perkara-perkara besar. Kesetiaan kita diuji dari hal-hal sederhana dalam kehidupan sehari-hari.",
                "imageUrl": ""
            }
        ]
    },
    "cloudConfig": {
        "provider": "Firebase Realtime / Cloud REST",
        "apiUrl": "https://gpdi-gosyen-warta-default-rtdb.asia-southeast1.firebasedatabase.app/data.json",
        "syncEnabled": True
    }
}

def load_database():
    if not os.path.exists(DB_FILE):
        save_database(DEFAULT_DATABASE)
        return DEFAULT_DATABASE
    try:
        with open(DB_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print("Error loading database:", e)
        return DEFAULT_DATABASE

def save_database(data):
    with open(DB_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

class ChurchRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/data":
            data = load_database()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(data).encode("utf-8"))
            return

        super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)

        if parsed.path == "/api/data":
            try:
                new_data = json.loads(body.decode("utf-8"))
                save_database(new_data)
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "message": "Database saved successfully"}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode("utf-8"))
            return

        if parsed.path == "/api/upload":
            try:
                payload = json.loads(body.decode("utf-8"))
                filename = payload.get("filename", f"upload_{int(datetime.now().timestamp())}.png")
                base64_data = payload.get("data", "")
                if "," in base64_data:
                    base64_data = base64_data.split(",", 1)[1]
                
                file_bytes = base64.b64decode(base64_data)
                safe_name = os.path.basename(filename)
                target_path = os.path.join(UPLOADS_DIR, safe_name)
                with open(target_path, "wb") as f:
                    f.write(file_bytes)

                rel_url = f"./assets/uploads/{safe_name}"
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "success", "url": rel_url}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "error", "message": str(e)}).encode("utf-8"))
            return

        self.send_response(404)
        self.end_headers()

if __name__ == "__main__":
    load_database()
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), ChurchRequestHandler) as httpd:
        print(f"GPdI Warta Jemaat Server running at http://localhost:{PORT}")
        httpd.serve_forever()
