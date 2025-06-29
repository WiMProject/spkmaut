from database import get_criteria

def calculate_maut_scores(candidates):
    criteria_info = get_criteria()
    # * Validasi skor
    for c in candidates:
        if len(c.scores) != len(criteria_info):
            raise ValueError(f"Kandidat {c.name} memiliki jumlah skor tidak sesuai.")

    matrix = [c.scores for c in candidates]
    weights_raw = [k["weight"] for k in criteria_info]
    total_weight = sum(weights_raw)
    weights = [w / total_weight for w in weights_raw]  # * normalisasi bobot
    types = [k["type"] for k in criteria_info]

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

