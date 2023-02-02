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

* when creating a dish, server will first create its category, if a new one, then will create the new dish and, finally, will create its ingredients, if they do not exist yet.

* planned routes:
-> create new user
-> create new session
-> update user
-> delete user
-> create new dish
-> edit dish
-> delete dish

* authentication via JWT token
* allow searching by dish name, category or ingredients
* use animations
* backend and frontend repos must have links to deploys, previews, and instructions for project execution
