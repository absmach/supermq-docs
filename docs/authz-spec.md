---
title: SuperMQ Authorization Specification Document
---

## Overview

SuperMQ consists of following entities:

- User
- Client
- Channel
- Group
- Domain
- Platform

### Roles

A role is a collection of actions that a group of users is allowed to perform on an entity. It simplifies the management of user privileges by consolidating related permissions into a single unit.

#### Specification for Roles

1. Roles should have short id, name, description, list of permissable actions, list of members in role, except role ID all other fields are editable
2. Roles are identified by name in API, because for human friendly.
3. Role Actions list can have only the actions which are allowed for the entity.
4. The entity allowed actions are derived automatically from authorization schema(spicedb schema) while starting the entity service.
5. A user can be a member of multiple roles across different entities, but for a single entity, user can only have one role. and user should be member of domain

#### Entities in SuperMQ which are having roles

- Clients
- Channels
- Groups
- Domains

#### Role Relations

- `entity`: Defines the entity type associated with the role (e.g., `domain`, `group`, `channel`, `client`).
- `member`: Indicates that a `user` can be a member of a role, which grants them the associated permissions.
- `built_in_role`: Indicates roles that are built-in or default roles (e.g., `admin`, `member`).

#### Role Permissions

Roles can grant permissions like:

- **Delete**: Allows deleting the entity (e.g., a group or client).
- **Update**: Allows updating the entity.
- **Read**: Grants read access to the entity.
- **Add User**: Grants permission to add users to the entity.
- **Remove User**: Grants permission to remove users from the entity.
- **View Users**: Allows viewing the users ass

**Example:**  
Domains have allowed actions **read**, **update**, and **delete**.

In Domain_1, there is a roles called **admin** and **editor**.

**Admin** role in Domain_1 grants the following actions: **read**, **update**, and **delete**.
**Admin** role is assigned to **user_1** and **user_2** as members, granting them the ability to perform all these actions within Domain_1.

**Editor** role in Domain_1 grants the following actions: **read** and **update**.
**Editor** role is assigned to **user_3** and **user_4** as members, granting them the ability to perform **read** and **update** actions within Domain_1.

### Role Hierarchy and Inheritance

Roles are often hierarchical, allowing for inheritance of permissions from parent roles or entities. For instance:

- A `user` can be a `member` of both a `domain` and a `group`, and can inherit permissions granted to these entities.
- Roles assigned at a higher level (such as a `domain` or `groups`) can propagate their permissions to lower levels (e.g., groups, channels, clients) as needed.

### Clients

A `client` is an entity that can represent a software application, IoT device, streaming application instance, which communicate through channels, allowing them to publish messages, subscribe to receive messages, or perform both actions.

#### Specification of Clients

1. Each client should have it own roles.  
2. Client can have only single parent group. this parent group defines the client's position in the hierarchy.  
3. Parent groups roles actions can be inherited to client.  
4. A client can connect to multiple channels, with publish action or subscribe action or both publish and subscribe actions.  
   A client can:
    - **Publish**: Send messages to one or more channels.
    - **Subscribe**: Receive messages from one or more channels.
    - **Publish & Subscribe**: Both send and receive messages on the same or different channels.

#### Client Actions

- `update`, `read`, `delete`: The ability to create, update, read, or delete a client.
- `connect_to_channel`: Allows to connect thing to a client.
- `manage_role`: Allows managing roles within a client, to edit, read, delete the role and actions.
- `add_role_users`: Allows to add user to a role.
- `remove_role_users`: Allows to remove user from a role.
- `view_role_users`: Allows to view users in a role.

### Channels

A `channel` is an entity which represent the topic to which clients and user can publish messages or subscribe messages or both publish and subscribe messages.

#### Specification of Channels

1. Each channel should have it own roles.  
2. Channel can have only single parent group. this parent group defines the channel's position in the hierarchy.  
3. Parent groups roles actions can be inherited to channel.  
4. A Channel can be connect to multiple channels, with publish action or subscribe action or both publish and subscribe actions.  
5. Only authorized client and user should able to do publish/subscribe to channels,
6. To publish or subscribe messages to channels, following topic should starts with should `c/<channel_id>/m` for by it can have it own subtopic path. example: `c/<channel_id>/m/subtopic1/subtopic2/subtopic3`
7. Both clients and users should able use channels to interact and exchange data with other clients or users.

#### Channel Actions

- `update`, `read`, `delete`: The ability to create, update, read, or delete a channel.
- `publish`, `subscribe`: These allow `user` or `client` publish and subscribe over channel.
- `connect_to_client`: Allows to connect thing to a channel.
- `manage_role`: Allows managing roles within a channel, to edit, read, delete the role and actions.
- `add_role_users`: Allows to add user to a role.
- `remove_role_users`: Allows to remove user from a role.
- `view_role_users`: Allows to view users in a role.

### Groups

A `group` is a hierarchical entity that can contain multiple child groups, clients, and channels.
Each group can have only a single parent, forming a structured hierarchy that defines the relationships between entities.

#### Specification of Groups

1. Each group should have it own roles.  
2. Group can have only one parent group
3. Group can have multiple child groups, clients, channels,
4. Group should actions which can be use to operation like read, update, delete over the group and additional actions to read, update, delete the child groups, clients and channels,

#### Group Actions

- `update`, `read`, `delete`: The ability to create, update, read, or delete a group.
- `manage_role`: Allows managing roles within a group, to edit, read, delete the role and actions.
- `add_role_users`: Allows to add user to a role.
- `remove_role_users`: Allows to remove user from a role.
- `view_role_users`: Allows to view users in a role.

- `client_create`: The ability to create children clients in group.
- `client_update`, `client_read`, `client_delete`: The ability to update, read, or delete all the clients in group.
- `client_connect_to_channel`: The ability to connect all clients in group to the channels in same domain.
- `client_manage_role`:  The ability to manage all the clients roles in the group.
- `client_add_role_users`: Allows to add user to role for all clients in group.
- `client_remove_role_users`: Allows to remove user from a role for all clients in group.
- `client_view_role_users`: Allows to view users in a role for all clients in group.

- `channel_create`: The ability to create children channels in group.
- `channel_update`, `channel_read`, `channel_delete`: The ability to update, read, or delete all the channels in group.
- `channel_publish`, `channel_subscribe`: These allow `user`  publish and subscribe over all the channels in group.
- `channel_connect_to_channel`: The ability to connect all channels in group to the things in same domain.
- `channel_manage_role`:  The ability to manage all the channels roles in the group.
- `channel_add_role_users`: Allows to add user to role for all channels in group.
- `channel_remove_role_users`: Allows to remove user from a role for all channels in group.
- `channel_view_role_users`: Allows to view users in a role for all channels in group.

- `sub_group_create`: The ability to create children groups (sub-groups) in group.
- `sub_group_update`, `group_read`, `group_delete`: The ability to update, read, or delete all the children groups in group which includes all nested sub-groups.
- `sub_group_manage_role`:  The ability to manage all the children groups roles in the group which includes all nested sub-groups.
- `sub_group_add_role_users`: Allows to add user to role for all the children groups in group which includes all nested sub-groups.
- `sub_group_remove_role_users`: Allows to remove user from a role for all the children groups in group which includes all nested sub-groups.
- `sub_group_view_role_users`: Allows to view users in a role for all the children groups in group which includes all nested sub-groups.

- `sub_group_client_create`: The ability to create children clients in all sub-groups.
- `sub_group_client_update`, `sub_group_client_read`, `sub_group_client_delete`: The ability to update, read, or delete all the clients in all sub-groups.
- `sub_group_client_connect_to_channel`: The ability to connect all clients in all sub-groups to the channels in same domain.
- `sub_group_client_manage_role`:  The ability to manage all the clients roles in all sub-groups.
- `sub_group_client_add_role_users`: Allows to add user to role for all clients in all sub-groups.
- `sub_group_client_remove_role_users`: Allows to remove user from a role for all clients in all sub-groups.
- `sub_group_client_view_role_users`: Allows to view users in a role for all clients in all sub-groups.

- `sub_group_channel_create`: The ability to create children channels in all sub-groups.
- `sub_group_channel_update`, `sub_group_channel_read`, `sub_group_channel_delete`: The ability to update, read, or delete all the channels in group.
- `sub_group_channel_publish`, `sub_group_channel_subscribe`: These allow `user`  publish and subscribe over all the channels in all sub-groups.
- `sub_group_channel_connect_to_channel`: The ability to connect all channels in all sub-groups to the things in same domain.
- `sub_group_channel_manage_role`:  The ability to manage all the channels roles in all sub-groups.
- `sub_group_channel_add_role_users`: Allows to add user to role for all channels in all sub-groups.
- `sub_group_channel_remove_role_users`: Allows to remove user from a role for all channels in all sub-groups.
- `sub_group_channel_view_role_users`: Allows to view users in a role for all channels in all sub-groups.

### Domain

A `Domain` is a the top-level organizational unit that manages and governs various sub-entities like groups, channels, and clients.

#### Specification of Domains

1. Each Domain should have it own roles.  
2. User can be added in any role in domain
3. Domain should actions which can be use to operation like read, update, delete over the domain and additional actions to read, update, delete all its groups, clients and channels.

#### Domain Actions

- `update`, `read`, `delete`: The ability to create, update, read, or delete a domain.
- `manage_role`: Allows managing roles within a domain, to edit, read, delete the role and actions.
- `add_role_users`: Allows to add user to a role.
- `remove_role_users`: Allows to remove user from a role.
- `view_role_users`: Allows to view users in a role.

- `client_create`: The ability to create clients in Domain.
- `client_update`, `client_read`, `client_delete`: The ability to update, read, or delete all the clients in domain.
- `client_connect_to_channel`: The ability to connect all clients in domain to the channels in same domain.
- `client_manage_role`:  The ability to manage all the clients roles in the domain.
- `client_add_role_users`: Allows to add user to role for all clients in domain.
- `client_remove_role_users`: Allows to remove user from a role for all clients in domain.
- `client_view_role_users`: Allows to view users in a role for all clients in domain.

- `channel_create`: The ability to create channels in Domain.
- `channel_update`, `channel_read`, `channel_delete`: The ability to update, read, or delete all the channels in domain.
- `channel_publish`, `channel_subscribe`: These allow `user`  publish and subscribe over all the channels in domain.
- `channel_connect_to_channel`: The ability to connect all channels in domain to the things in same domain.
- `channel_manage_role`:  The ability to manage all the channels roles in the domain.
- `channel_add_role_users`: Allows to add user to role for all channels in domain.
- `channel_remove_role_users`: Allows to remove user from a role for all channels in domain.
- `channel_view_role_users`: Allows to view users in a role for all channels in domain.

- `group_create`: The ability to create groups in Domain.
- `group_update`, `group_read`, `group_delete`: The ability to update, read, or delete all the groups in domain which includes sub-groups.
- `group_manage_role`:  The ability to manage all the groups roles in the domain which includes sub-groups.
- `group_add_role_users`: Allows to add user to role for all groups in domain which includes sub-groups.
- `group_remove_role_users`: Allows to remove user from a role for all groups in domain which includes sub-groups.
- `group_view_role_users`: Allows to view users in a role for all groups in domain which includes sub-groups.

### Platform

A `Platform` multiple domains and defines the global access control policy (typically using the `administrator` role).
