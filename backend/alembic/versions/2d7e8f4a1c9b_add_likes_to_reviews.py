"""add likes to reviews

Revision ID: 2d7e8f4a1c9b
Revises: 13c58efbb908
Create Date: 2026-11-02 12:40:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "2d7e8f4a1c9b"
down_revision: Union[str, Sequence[str], None] = "13c58efbb908"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "reviews",
        sa.Column(
            "likes",
            sa.Integer(),
            nullable=False,
            server_default=sa.text("0"),
        ),
    )


def downgrade() -> None:
    op.drop_column("reviews", "likes")
