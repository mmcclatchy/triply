"""changed lengths of photo_url and added start_iso, start and end locations to Trip

Revision ID: 331ffc10ca29
Revises: 768ad09a2fd0
Create Date: 2020-12-26 13:54:16.130238

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '331ffc10ca29'
down_revision = '768ad09a2fd0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('trips', sa.Column('end_location', sa.String(length=255), nullable=True))
    op.add_column('trips', sa.Column('start_iso', sa.String(length=35), nullable=True))
    op.add_column('trips', sa.Column('start_location', sa.String(length=255), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('trips', 'start_location')
    op.drop_column('trips', 'start_iso')
    op.drop_column('trips', 'end_location')
    # ### end Alembic commands ###
