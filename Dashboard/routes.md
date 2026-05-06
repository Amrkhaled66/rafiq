## PUBLIC

/login
/unauthorized


## DASHBOARD BASE

/dashboard

## ANALYTICS

/dashboard/home
Permission: analytics

## STUDENTS

/dashboard/students
Permission: by scope

/dashboard/students/:id
Permission: students.profile.view
Scope: all_students OR assigned_students

<!-- /dashboard/students/:id/reports
Permission: students.reports.view
Scope: all_students OR assigned_students -->

/dashboard/students/:id/plans
Permission: students.plan.view
Scope: all_students OR assigned_students

/dashboard/students/:id/plans/:planId
Permission: students.plan.view
Scope: all_students OR assigned_students

## COACHES

/dashboard/coaches
Permission: coaches.view


/dashboard/coaches/:id
Permission: coaches.profile.view

## SUBSCRIPTIONS

/dashboard/subscriptions
Permission: subscriptions.view


/dashboard/subscriptions/:id/renew
Permission: subscriptions.renew

## TASKS 
/dashboard/missed-tasks
/dashboard/active-sessions