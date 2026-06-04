def score_to_grade(score: float) -> str:
    if score >= 80:
        return "A"
    elif score >= 60:
        return "B"
    else:
        return "C"


def grade_to_label(grade: str) -> str:
    labels = {"A": "Premium", "B": "Standard", "C": "Economy"}
    return labels.get(grade, "Unknown")
