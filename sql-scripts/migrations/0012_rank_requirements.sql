create table rank_requirements(
    ordinal    int primary key,
    label      text not null,
    post_count int4range
);

insert into rank_requirements(ordinal, label, post_count)
values
    (0, 'Greenhorn', '(,5]'),
    (1, 'Casual', '(5,10]'),
    (2, 'Stoner', '(10,20]'),
    (3, 'Sergeant Stoner', '(20,30]'),
    (4, 'Pot Head', '(30,40]'),
    (5, 'Major Pot Head', '(40,50]'),
    (6, 'Toker', '(50,60]'),
    (7, 'Chiefer', '(60,70]'),
    (8, 'Hippie', '(70,80]'),
    (9, 'Head Hippie', '(80,90]'),
    (10, 'Chief Kief', '(90,100]'),
    (11, 'Weed Wizard', '(100,]');
