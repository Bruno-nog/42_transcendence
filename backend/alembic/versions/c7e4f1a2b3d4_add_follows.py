"""add follows

Revision ID: c7e4f1a2b3d4
Revises: a344c6c095ea
Create Date: 2026-11-05 17:20:00
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "c7e4f1a2b3d4"
down_revision: Union[str, Sequence[str], None] = "a344c6c095ea"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "follows",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("follower_id", sa.Integer(), nullable=False),
        sa.Column("following_id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.CheckConstraint(
            "follower_id != following_id",
            name="ck_follow_distinct_users",
        ),
        sa.ForeignKeyConstraint(["follower_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["following_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "follower_id",
            "following_id",
            name="uq_follow_follower_following",
        ),
    )


def downgrade() -> None:
    op.drop_table("follows")
