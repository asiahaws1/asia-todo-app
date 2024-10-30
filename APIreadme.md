# Here is my To-Do App API Documentation

## Endpoints 

### To-Dos
GET /api/todos - gets all of the to dos
POST /api/todos - make a new to do
PUT /api/todos/:id - update a to do
DELETE /api/todos/:id - delete a to do

### Categories
GET /api/categories - gets all categories
POST /api/categories - make a new category
PUT /api/categories/:index - update a category
DELETE /api/categories/:index - delete a category

### Category To-Dos
GET /api/categories/:category/todos - get the to dos for a certain category

## Data Formats

### Todo Object
```json
{
    "id": number,
    "name": string,
    "status": string,
    "category": string,
    "dueDate": string
}