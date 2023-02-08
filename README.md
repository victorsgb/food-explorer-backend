# database tables

users
-> id: number
-> admin: boolean
-> name: string
-> email: string
-> password: string

* admin has permission to create, visualize, edit and delete dishes
* non-admin has permission to visualize registered dishes

categories
-> id: number
-> category: string

dishes
-> id: number
-> category_id: number (foreign key)
-> dish: string
-> image: string (its reference in backend tmp/uploads folder)
-> description: string
-> price: number

ingredients
-> id: number
-> dish_id: number (foreign key)
-> ingredient: string

* we'll assume there's only three categories and that there's no need to create a fourth one, for instance
* when creating a dish, server will first check its category, if it exists, then will create the new dish and, finally, will create its ingredients.

* planned routes:
-> create new session OK
-> create new user OK
-> update user OK
-> show user OK

-> create new dish OK
-> edit dish OK
-> show dish OK
-> index dishes by search text OK
-> index dishes by category OK
-> delete dish OK

-> index categories OK
-> index ingredients from a given dish OK

* authentication via JWT token OK
* allow searching by dish name, category or ingredients OK
* use animations
* backend and frontend repos must have links to deploys, previews, and instructions for project execution
