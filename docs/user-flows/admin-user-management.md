# Admin User Management Flow

## Create User → Assign Role → Manage Permissions

### 1. Create User
```
/admin/users
  ↓
Click "Add User"
  ↓
Enter details:
  • Name, email
  • Role selection
  • Clinic assignment
  ↓
POST /api/users
  ↓
Success: User created
  ↓
Invitation email sent
```

### 2. Assign Role
```
Select user
  ↓
Click "Edit Role"
  ↓
Choose from:
  • Admin
  • Manager
  • Dentist
  • Hygienist
  • Assistant
  • Receptionist
  ↓
PUT /api/users/:id/role
  ↓
Role updated
```

### 3. Manage Permissions
```
Select user
  ↓
Click "Permissions"
  ↓
Toggle permissions:
  • Read/Write/Delete
  • Per resource type
  ↓
PUT /api/users/:id/permissions
  ↓
Permissions saved
```

### 4. View Audit Log
```
/admin/audit-logs
  ↓
Filter by:
  • User
  • Action
  • Date range
  ↓
GET /api/audit-logs
  ↓
Display log entries:
  • Timestamp
  • User
  • Action
  • Resource
  • IP address
```
