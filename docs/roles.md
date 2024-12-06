# Roles, Role Members, and Role Actions  

## **Roles**  
A role is a collection of permissions (actions) that define what members of the role are allowed to do within a specific entity. Each entity (like a `Client`, `Channel`, `Group`, or `Domain`) can have multiple roles, each with its own members and actions.

- **Role Members**: These are users assigned to a role. Members are the only users allowed to perform the role's actions on the entity.  
- **Role Actions**: These are permissions defining what members of the role can do. For example, actions can include `read`, `update`, `delete`, or more specific actions like `publish` or `connect_to_channel`. **Refer to `authz-spec.md` for the available actions for each entity type.**


---

## **Base URL**  
All API requests use the base URL:  
`http://localhost/<entity_type>/<entity_id>`  

Replace `<entity_type>` with one of the entity types (`clients`, `channels`, `groups`, `domains`) and `<entity_id>` with the ID of the specific entity.

---

### **Endpoints and Examples**

### **1. Create a Role**  
**POST /role**  
Creates a role for the given entity.  

**Request Body**:  
```json
{
  "role_name": "member",
  "optional_actions": ["read"],
  "optional_members": ["user_1"]
}
```

#### Example for a `Channel`:
**Request**:  
`POST http://localhost/channels/<channel_id>/role`  

**Response**:  
```json
{
  "role_id": "id_xxxxx",
  "role_name": "member",
  "actions": ["read"],
  "members": ["user_1"]
}
```

---

### **2. List Roles**  
**GET /roles**  
Retrieves all roles for the given entity.  

#### Example for a `Client`:
**Request**:  
`GET http://localhost/clients/<client_id>/roles`  

**Response**:  
```json
[
  {
    "role_id": "xxxxx",
    "role_name": "Admin",
    "actions": ["read", "update", "delete"],
    "members": ["user_1", "user_2"]
  },
  {
    "role_id": "xxxxx",
    "role_name": "Viewer",
    "actions": ["read"],
    "members": ["user_3"]
  }
]
```

---

### **3. Retrieve a Role**  
**GET /roles/<role_id>**  
Fetches details of a specific role.  

#### Example for a `Group`:
**Request**:  
`GET http://localhost/groups/<group_id>/roles/<role_id>`  

**Response**:  
```json
{
  "role_id": "xxxxx",
  "role_name": "Admin",
  "actions": ["read", "update", "delete"],
  "members": ["user_1", "user_2"]
}
```

---

### **4. Delete a Role**  
**DELETE /roles/<role_id>**  
Deletes the specified role.  

#### Example for a `Domain`:
**Request**:  
`DELETE http://localhost/domains/<domain_id>/roles/<role_id>`  



---

### **5. Add Role Members**  
**POST /roles/<role_id>/members**  
Adds members to the specified role.  

**Request Body**:  
```json
{
  "members": ["user_4"]
}
```

#### Example for a `Client`:
**Request**:  
`POST http://localhost/clients/<client_id>/roles/<role_id>/members`  

**Request Body**:  
```json
{
  "members": ["user_4"]
}
```


---

### **6. List Role Members**  
**GET /roles/<role_id>/members**  
Retrieves all members of the specified role.  

#### Example for a `Channel`:
**Request**:  
`GET http://localhost/channels/<channel_id>/roles/<role_id>/members`  

**Response**:  
```json

```

---

### **7. Delete Specific Role Members**  
**POST /roles/<role_id>/members/delete**  
Deletes specific members from the role.  

**Request Body**:  
```json
{
  "members": ["user_4"]
}
```

#### Example for a `Group`:
**Request**:  
`POST http://localhost/groups/<group_id>/roles/<role_id>/members/delete`  

**Response**:  
```json
{
  "message": "Members removed successfully"
}
```

---

### **8. Delete All Role Members**  
**POST /roles/<role_id>/members/delete-all**  
Removes all members from the role.  

#### Example for a `Domain`:
**Request**:  
`POST http://localhost/domains/<domain_id>/roles/<role_id>/members/delete-all`  



---

### **9. Add Role Actions**  
**POST /roles/<role_id>/actions**  
Adds actions to the specified role.  

**Request Body**:  
```json
{
  "actions": ["publish"]
}
```

#### Example for a `Client`:
**Request**:  
`POST http://localhost/clients/<client_id>/roles/<role_id>/actions`  



---

### **10. List Role Actions**  
**GET /roles/<role_id>/actions**  
Retrieves all actions of the specified role.  

#### Example for a `Channel`:
**Request**:  
`GET http://localhost/channels/<channel_id>/roles/<role_id>/actions`  

**Response**:  
```json
["read", "update", "publish"]
```

---

### **11. Delete Specific Role Actions**  
**POST /roles/<role_id>/actions/delete**  
Deletes specific actions from the role.  



#### Example for a `Group`:
**Request**:  
`POST http://localhost/groups/<group_id>/roles/<role_id>/actions/delete`  


---

### **12. Delete All Role Actions**  
**POST /roles/<role_id>/actions/delete-all**  
Removes all actions from the role.  

#### Example for a `Domain`:
**Request**:  
`POST http://localhost/domains/<domain_id>/roles/<role_id>/actions/delete-all`  


