# coding: utf-8
from sqlalchemy import ARRAY, Boolean, CHAR, CheckConstraint, Column, DateTime, Float, ForeignKey, Integer, String, Table, Text, text
from sqlalchemy.orm import sessionmaker, relationship, backref
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = Base.metadata


class Item(Base):
    __tablename__ = 'items'

    id = Column(Integer, primary_key=True, server_default=text("nextval('items_id_seq'::regclass)"))
    name = Column(String(255), nullable=False, unique=True)
    description = Column(Text)
    price = Column(Integer, nullable=False)
    on_offer = Column(Boolean)


class Items2(Base):
    __tablename__ = 'items2'

    id = Column(Integer, primary_key=True, server_default=text("nextval('items2_id_seq'::regclass)"))
    name = Column(String(255), nullable=False, unique=True)
    description = Column(Text)
    price = Column(Integer, nullable=False)
    on_offer = Column(Boolean)


class Level(Base):
    __tablename__ = 'levels'

    level_id = Column(Integer, primary_key=True)
    level_name = Column(String(50))
    rating_threshold = Column(Float)
    count_threshold = Column(Integer)


class LocationClas(Base):
    __tablename__ = 'location_class'

    class_id = Column(Integer, primary_key=True)
    class_name = Column(String(20), nullable=False)


class Service(Base):
    __tablename__ = 'service'

    service_id = Column(Integer, primary_key=True, server_default=text("nextval('service_service_id_seq'::regclass)"))
    service_name = Column(String(50), nullable=False)


t_test = Table(
    'test', metadata,
    Column('applier_id', Integer),
    Column('accepter_id', Integer)
)


class Location(Base):
    __tablename__ = 'locations'

    location_id = Column(Integer, primary_key=True, server_default=text("nextval('locations_location_id_seq'::regclass)"))
    location_name = Column(String(50), nullable=False)
    _class = Column('class', ForeignKey('location_class.class_id', ondelete='SET DEFAULT'), nullable=False, server_default=text("9"))
    longitude = Column(Float(53), nullable=False)
    latitude = Column(Float(53), nullable=False)

    location_clas = relationship('LocationClas')


class Dormitory(Base):
    __tablename__ = 'dormitory'

    location_id = Column(ForeignKey('locations.location_id', ondelete='CASCADE'), primary_key=True)
    dorm_floor_count = Column(Integer, nullable=False)
    facilities = Column(ARRAY(Text()))
    elevator_exist = Column(Boolean, nullable=False)


class User(Base):
    __tablename__ = 'users'
    __table_args__ = (
        CheckConstraint("phone_num !~~ '%%[^0-9]%%'::text"),
    )

    user_id = Column(Integer, primary_key=True, server_default=text("nextval('users_user_id_seq'::regclass)"))
    user_name = Column(String(50), nullable=False, unique=True)
    gender = Column(CHAR(1), nullable=False)
    phone_num = Column(CHAR(10))
    fb_url = Column(String)
    dorm_id = Column(ForeignKey('locations.location_id', ondelete='SET NULL'), nullable=False)
    password = Column(String(20), nullable=False)

    dorm = relationship('Location')


class Request(Base):
    __tablename__ = 'requests'

    request_id = Column(Integer, primary_key=True, server_default=text("nextval('requests_request_id_seq'::regclass)"))
    requester_id = Column(ForeignKey('users.user_id', ondelete='SET NULL'))
    service_id = Column(ForeignKey('service.service_id', ondelete='SET NULL'))
    description = Column(String(600))
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    act_start_time = Column(DateTime)
    act_end_time = Column(DateTime)
    reward = Column(String(50))
    title = Column(String(50), nullable=False)

    requester = relationship('User')
    service = relationship('Service')
    requester_locations = relationship('Location', secondary='kill_cockroach_service_post')
    dr = relationship('DriveServicePost', back_populates='re', uselist=False)
    hy = relationship('HeavyliftingServicePost', back_populates='re', uselist=False)
    ki = relationship('KillCockroachServicePost', back_populates='re', uselist=False)
    ev = relationship('HostEventPost', back_populates='re', uselist=False)


class DriveServicePost(Base):
    __tablename__ = 'drive_service_post'

    request_id = Column(ForeignKey('requests.request_id', ondelete='CASCADE'), primary_key=True)
    from_id = Column(ForeignKey('locations.location_id', ondelete='SET NULL'))
    to_id = Column(ForeignKey('locations.location_id', ondelete='SET NULL'))

    _from = relationship('Location', primaryjoin='DriveServicePost.from_id == Location.location_id')
    to = relationship('Location', primaryjoin='DriveServicePost.to_id == Location.location_id')
    re = relationship('Request', back_populates='dr')


class HeavyliftingServicePost(Base):
    __tablename__ = 'heavylifting_service_post'

    request_id = Column(ForeignKey('requests.request_id', ondelete='CASCADE'), primary_key=True)
    from_id = Column(ForeignKey('locations.location_id', ondelete='SET NULL'))
    from_floor = Column(Integer)
    to_id = Column(ForeignKey('locations.location_id', ondelete='SET NULL'))
    to_floor = Column(Integer)
    item = Column(String(50))
    item_weight = Column(String(50))

    _from = relationship('Location', primaryjoin='HeavyliftingServicePost.from_id == Location.location_id')
    to = relationship('Location', primaryjoin='HeavyliftingServicePost.to_id == Location.location_id')
    re = relationship('Request', back_populates='hy')


class KillCockroachServicePost(Base):
    __tablename__ = 'kill_cockroach_service_post'

    request_id = Column(ForeignKey('requests.request_id', ondelete='CASCADE'), primary_key=True)
    requester_location_id = Column(ForeignKey('locations.location_id', ondelete='SET NULL'))

    requester_location = relationship('Location')
    re = relationship('Request', back_populates='ki')
    

class HostEventPost(Base):
    __tablename__ = 'host_event_post'

    request_id = Column(ForeignKey('requests.request_id', ondelete='CASCADE'), primary_key=True)
    event_location_id = Column(ForeignKey('locations.location_id', ondelete='SET NULL'))
    location_detail = Column(String(100))

    event_location = relationship('Location')
    re = relationship('Request', back_populates='ev')


class UserPoint(Base):
    __tablename__ = 'user_points'

    user_id = Column(ForeignKey('users.user_id', ondelete='CASCADE'), primary_key=True, nullable=False)
    service_id = Column(ForeignKey('service.service_id', ondelete='CASCADE'), primary_key=True, nullable=False)
    avg_rating = Column(Float, default=0)
    counts = Column(Integer, nullable=False, default=0)
    level_id = Column(ForeignKey('levels.level_id', ondelete='SET DEFAULT'), nullable=False, default=1)

    level = relationship('Level')
    service = relationship('Service')
    user = relationship('User')


class Applier(Base):
    __tablename__ = 'appliers'

    applier_id = Column(ForeignKey('users.user_id', ondelete='CASCADE'), primary_key=True, nullable=False)
    request_id = Column(ForeignKey('requests.request_id', ondelete='CASCADE'), primary_key=True, nullable=False)
    status = Column(Integer, server_default=text("0"))
    rating = Column(Integer)

    applier = relationship('User')
    request = relationship('Request')


# t_kill_cockroach_service_post = Table(
#     'kill_cockroach_service_post', metadata,
#     Column('request_id', ForeignKey('requests.request_id', ondelete='CASCADE'), primary_key=True),
#     Column('requester_location_id', ForeignKey('locations.location_id', ondelete='SET NULL'))
# )

