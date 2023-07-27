from flask import Blueprint

routes = Blueprint('routes', __name__)

from .get_topic_by_subject_title import *
from .get_topic_points_by_subject_title import *
from .get_favorite_topic_points_by_user_id import *
from .get_topic_points_by_user_id import *
from .get_recent_topic_points import *
from .get_subject_list import *
from .login import *
from .delete_topic_point import *
from .register import *
from .change_favorite_topic_point import *
from .create_topic_point import *
from .get_user_list import *
from .edit_topic_point import *
from .create_comment import *
from .change_upvote_status import *
from .get_comments_by_topic_point_id import *



