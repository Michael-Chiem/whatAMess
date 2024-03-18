use employees;

INSERT INTO department
    (name)
VALUES
    ('ProductionSupport'),
    ('Shipping'),
    ('Receiving'),
    ('Maintenance');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('ProductionSupport Manager', 100000, 1),
    ('Receiving Manager', 80000, 1),
    ('Shipping Manager', 150000, 2),
    ('Maintenance Manager', 120000, 2),
    ('ProductionSupport help desk', 160000, 3),
    ('ForkLift Driver', 125000, 3),
    ('Welder', 250000, 4),
    ('Driver', 190000, 4);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Bob', 'Goodman', 1, NULL),
    ('Big', 'Chin', 2, 1),
    ('Wind', 'Horseshoes', 3, NULL),
    ('Darell', 'Begay', 4, 3),
    ('Denice', 'Lafeen', 5, NULL),
    ('Malache', 'Boba', 6, 5),
    ('Dave', 'BigChin', 7, NULL),
    ('Peter', 'Griffin', 8, 7);
