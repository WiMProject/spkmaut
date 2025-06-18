CRITERIA_INFO = [
    {"name": "IPK", "weight": 0.18, "type": "benefit"},
    {"name": "Pengalaman Organisasi", "weight": 0.20, "type": "benefit"},
    {"name": "Komunikasi", "weight": 0.12, "type": "benefit"},
    {"name": "Visi Misi", "weight": 0.15, "type": "benefit"},
    {"name": "Inisiatif", "weight": 0.10, "type": "benefit"},
    {"name": "Penyelesaian Konflik", "weight": 0.10, "type": "benefit"},
    {"name": "Ketidakhadiran", "weight": 0.10, "type": "cost"},
    {"name": "Lama Studi", "weight": 0.05, "type": "cost"},
]

def calculate_maut_scores(candidates):
    # * Validasi skor
    for c in candidates:
        if len(c.scores) != len(CRITERIA_INFO):
            raise ValueError(f"Kandidat {c.name} memiliki jumlah skor tidak sesuai.")

    matrix = [c.scores for c in candidates]
    weights_raw = [k["weight"] for k in CRITERIA_INFO]
    total_weight = sum(weights_raw)
    weights = [w / total_weight for w in weights_raw]  # * normalisasi bobot
    types = [k["type"] for k in CRITERIA_INFO]

    # * Normalisasi
    normalized_matrix = []
    for j in range(len(matrix[0])):
        column = [row[j] for row in matrix]
        if types[j] == "benefit":
            max_val = max(column)
            norm_col = [v / max_val if max_val != 0 else 0 for v in column]
        else:  # cost
            min_val = min(column)
            norm_col = [min_val / v if v != 0 else 0 for v in column]
        normalized_matrix.append(norm_col)

    normalized_matrix = list(zip(*normalized_matrix))  # * Transpose kembali

    # * Hitung skor akhir
    results = []
    for idx, row in enumerate(normalized_matrix):
        score = sum(val * w for val, w in zip(row, weights))
        results.append({
            "name": candidates[idx].name,
            "score": round(score, 4)
        })

    results.sort(key=lambda x: x["score"], reverse=True)
    return results
