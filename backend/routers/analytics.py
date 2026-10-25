
from collections import defaultdict
from datetime import date, datetime, time, timedelta


import csv
import io
from io import BytesIO


from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy import extract, func
from sqlalchemy.orm import Session


from database import get_db
from auth import get_current_user
from models import Media, Reviews, User

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


router = APIRouter(prefix="/analytics", tags=["analytics"])


def parse_date(value: str | None) -> date | None:
    if not value:
        return None

    for date_format in ("%d/%m/%Y", "%Y-%m-%d"):
        try:
            return datetime.strptime(value, date_format).date()
        except ValueError:
            continue

    raise HTTPException(
        status_code=400,
        detail=f"Data inválida: '{value}'. Use DD/MM/AAAA ou AAAA-MM-DD.",
    )




def build_user_review_filters(
    current_user: User,
    start_date_value: str | None,
    end_date_value: str | None,
    category: str | None,
):
    start_date = parse_date(start_date_value)
    end_date = parse_date(end_date_value)

    if start_date and end_date and start_date > end_date:
        raise HTTPException(
            status_code=400,
            detail="A data inicial não pode ser posterior à data final.",
        )

    filters = [Reviews.user_id == current_user.id]

    if start_date:
        filters.append(
            Reviews.created_at >= datetime.combine(start_date, time.min)
        )

    if end_date:
        filters.append(
            Reviews.created_at < datetime.combine(
                end_date + timedelta(days=1),
                time.min,
            )
        )

    if category and category.strip():
        filters.append(Media.genres.ilike(f"%{category.strip()}%"))

    return start_date, end_date, filters

@router.get("/overview")
def get_analytics_overview(
    start_date: str | None = None,
    end_date: str | None = None,
    category: str | None = None,
    db: Session = Depends(get_db),
):
    start_date = parse_date(start_date)
    end_date = parse_date(end_date)

    if start_date and end_date and start_date > end_date:
        raise HTTPException(
            status_code=400,
            detail="A data inicial não pode ser posterior à data final",
        )

    filters = []

    if start_date:
        filters.append(
            Reviews.created_at >= datetime.combine(start_date, time.min)
        )

    if end_date:
        filters.append(
            Reviews.created_at < datetime.combine(
                end_date.fromordinal(end_date.toordinal() + 1),
                time.min,
            )
        )

    if category:
        filters.append(
          Media.genres.ilike(f"%{category}%")
        )

    # Total e média geral das avaliações
    summary = (
        db.query(
            func.count(Reviews.id).label("total_reviews"),
            func.avg(Reviews.rate).label("average_rate"),
        )
        .join(Media, Reviews.media_id == Media.id)
        .filter(*filters)
        .first()
    )

    # Mídias com maior quantidade de avaliações
    top_media = (
        db.query(
            Media.id,
            Media.title,
            Media.media_type,
            func.count(Reviews.id).label("reviews_count"),
            func.avg(Reviews.rate).label("average_rate"),
        )
        .join(Reviews, Reviews.media_id == Media.id)
        .filter(*filters)
        .group_by(Media.id, Media.title, Media.media_type)
        .order_by(func.count(Reviews.id).desc())
        .limit(10)
        .all()
    )

    # Média das avaliações por gênero
    genre_reviews = (
        db.query(Reviews.rate, Media.genres)
        .join(Media, Reviews.media_id == Media.id)
        .filter(*filters)
        .all()
    )

    genre_totals = defaultdict(lambda: {"total_rate": 0.0, "count": 0})

    for rate, genres in genre_reviews:
        if not genres or rate is None:
            continue

        for genre in genres.split(","):
            genre = genre.strip()

            if not genre:
                continue

            genre_totals[genre]["total_rate"] += float(rate)
            genre_totals[genre]["count"] += 1

    genres_average = [
        {
            "genre": genre,
            "reviews_count": values["count"],
            "average_rate": round(
                values["total_rate"] / values["count"], 2
            ),
        }
        for genre, values in sorted(
            genre_totals.items(),
            key=lambda item: item[1]["total_rate"] / item[1]["count"],
            reverse=True,
        )
    ]

    return {
        "total_reviews": summary.total_reviews or 0,
        "average_rate": round(float(summary.average_rate or 0), 2),
        "top_media": [
            {
                "id": item.id,
                "title": item.title,
                "media_type": item.media_type,
                "reviews_count": item.reviews_count,
                "average_rate": round(float(item.average_rate or 0), 2),
            }
            for item in top_media
        ],
        "genres_average": genres_average,
        "filters": {
            "start_date": start_date,
            "end_date": end_date,
            "category": category,
        },
    }


@router.get("/me")
def get_my_analytics(
    start_date: str | None = None,
    end_date: str | None = None,
    category: str | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _, _, filters = build_user_review_filters(
        current_user, start_date, end_date, category
    )

    summary = (
        db.query(
            func.count(Reviews.id).label("total_reviews"),
            func.avg(Reviews.rate).label("average_rate"),
        )
        .join(Media, Reviews.media_id == Media.id)
        .filter(*filters)
        .first()
    )

    monthly_results = (
        db.query(
            extract("year", Reviews.created_at).label("year"),
            extract("month", Reviews.created_at).label("month"),
            func.count(Reviews.id).label("reviews_count"),
            func.avg(Reviews.rate).label("average_rate"),
        )
        .join(Media, Reviews.media_id == Media.id)
        .filter(*filters)
        .group_by(
            extract("year", Reviews.created_at),
            extract("month", Reviews.created_at),
        )
        .order_by(
            extract("year", Reviews.created_at),
            extract("month", Reviews.created_at),
        )
        .all()
    )

    genre_results = (
        db.query(Media.genres)
        .join(Reviews, Reviews.media_id == Media.id)
        .filter(*filters)
        .all()
    )

    genre_counts = {}
    for (genres,) in genre_results:
        if not genres:
            continue

        for genre in genres.split(","):
            genre = genre.strip()
            if genre:
                genre_counts[genre] = genre_counts.get(genre, 0) + 1

    favorite_genre = (
        max(genre_counts, key=genre_counts.get)
        if genre_counts
        else None
    )

    return {
        "total_reviews": summary.total_reviews or 0,
        "average_rate": round(float(summary.average_rate or 0), 2),
        "favorite_genre": favorite_genre,
        "monthly_evolution": [
            {
                "year": int(item.year),
                "month": int(item.month),
                "reviews_count": item.reviews_count,
                "average_rate": round(float(item.average_rate or 0), 2),
            }
            for item in monthly_results
        ],
    }


@router.get("/me/export/csv")
def export_my_reviews_csv(
    start_date: str | None = None,
    end_date: str | None = None,
    category: str | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _, _, filters = build_user_review_filters(
        current_user, start_date, end_date, category
    )

    results = (
        db.query(Reviews, Media)
        .join(Media, Reviews.media_id == Media.id)
        .filter(*filters)
        .order_by(Reviews.created_at.desc())
        .all()
    )

    output = io.StringIO(newline="")
    writer = csv.writer(output, delimiter=";")

    writer.writerow([
        "Título",
        "Tipo de mídia",
        "Ano de lançamento",
        "Gêneros",
        "Nota",
        "Review",
        "Atuação",
        "Direção",
        "Fotografia",
        "Roteiro",
        "Trilha sonora",
        "Gostou",
        "Já assistiu antes",
        "Data em que assistiu",
        "Data da review",
    ])

    for review, media in results:
        writer.writerow([
            media.title,
            media.media_type,
            media.release_year,
            media.genres,
            review.rate,
            review.review,
            review.acting,
            review.direction,
            review.photography,
            review.screenplay,
            review.soundtrack,
            "Sim" if review.liked else "Não",
            "Sim" if review.watched_before else "Não",
            review.date_film.isoformat() if review.date_film else "",
            review.created_at.isoformat() if review.created_at else "",
        ])

    # BOM para facilitar a abertura de caracteres acentuados no Excel.
    csv_content = output.getvalue()
    output.close()

    csv_bytes = ("\ufeff" + csv_content).encode("utf-8-sig")

    filename = f"minhas_reviews_{current_user.id}.csv"

    return StreamingResponse(
        iter([csv_bytes]),
        media_type="text/csv; charset=utf-8",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        },
    )



@router.get("/me/export/pdf")
def export_my_reviews_pdf(
    start_date: str | None = None,
    end_date: str | None = None,
    category: str | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    _, _, filters = build_user_review_filters(
        current_user, start_date, end_date, category
    )

    results = (
        db.query(Reviews, Media)
        .join(Media, Reviews.media_id == Media.id)
        .filter(*filters)
        .order_by(Reviews.created_at.desc())
        .all()
    )

    buffer = BytesIO()

    document = SimpleDocTemplate(
        buffer,
        pagesize=landscape(A4),
        rightMargin=1.5 * cm,
        leftMargin=1.5 * cm,
        topMargin=1.5 * cm,
        bottomMargin=1.5 * cm,
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        alignment=TA_CENTER,
        spaceAfter=16,
    )
    cell_style = ParagraphStyle(
        "Cell",
        parent=styles["BodyText"],
        fontSize=7,
        leading=9,
        wordWrap="CJK",
    )

    story = [
        Paragraph("Minhas avaliações", title_style),
        Paragraph(
            f"Usuário: {current_user.username}",
            styles["Normal"],
        ),
        Spacer(1, 12),
    ]

    table_data = [[
        "Título",
        "Tipo",
        "Ano",
        "Gêneros",
        "Nota",
        "Review",
        "Data da review",
    ]]

    for review, media in results:
        table_data.append([
            Paragraph(str(media.title or ""), cell_style),
            Paragraph(str(media.media_type or ""), cell_style),
            Paragraph(str(media.release_year or ""), cell_style),
            Paragraph(str(media.genres or ""), cell_style),
            Paragraph(str(review.rate if review.rate is not None else ""), cell_style),
            Paragraph(str(review.review or ""), cell_style),
            Paragraph(
                review.created_at.strftime("%d/%m/%Y")
                if review.created_at else "",
                cell_style,
            ),
        ])

    table = Table(
        table_data,
        colWidths=[
            4.0 * cm,
            2.0 * cm,
            1.3 * cm,
            3.5 * cm,
            1.2 * cm,
            10.0 * cm,
            2.5 * cm,
        ],
        repeatRows=1,
    )

    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#263238")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 7),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.grey),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [
            colors.white,
            colors.HexColor("#F2F4F5"),
        ]),
        ("LEFTPADDING", (0, 0), (-1, -1), 5),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))

    story.append(table)
    document.build(story)

    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": (
                f'attachment; filename="minhas_reviews_{current_user.id}.pdf"'
            )
        },
    )
