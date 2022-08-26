create table if not exists teller.path
(
    id          int auto_increment
        primary key,
    description text not null
);

create table if not exists teller.game
(
    id              int auto_increment
        primary key,
    name            varchar(256) not null,
    initial_path_id int          not null,
    constraint fk_initial_path
        foreign key (initial_path_id) references teller.path (id)
);

create table if not exists teller.`option`
(
    id             int auto_increment
        primary key,
    action         text not null,
    parent_path_id int  not null,
    child_path_id  int  null,
    constraint fk_option_child
        foreign key (child_path_id) references teller.path (id),
    constraint fk_option_parent
        foreign key (parent_path_id) references teller.path (id)
);

