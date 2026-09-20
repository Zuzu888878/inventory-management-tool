import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteUser, getUsers } from '../api/users.js';
import { Icon } from '../components/Icon.jsx';
import { Pagination, SortButton, TableToolbar } from '../components/TableToolbar.jsx';
import { useTableControls } from '../hooks/useTableControls.js';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');
  const {
    rows,
    search,
    setSearch,
    sort,
    toggleSort,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
  } = useTableControls(users, {
    searchFields: ['username', 'displayName', 'role'],
    filter: (user) => roleFilter === 'all' || user.role === roleFilter,
    initialSort: { key: 'username', direction: 'asc' },
    defaultPageSize: 20,
  });

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  async function removeUser(user) {
    if (!window.confirm(`Delete user "${user.username}"?`)) return;

    setError('');
    try {
      await deleteUser(user.id);
      setUsers((currentUsers) => currentUsers.filter((currentUser) => currentUser.id !== user.id));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <>
      <div className="page-heading">
        <h1>Users</h1>
        <Link to="/users/new">
          <button className="button" type="button">
            <Icon name="plus" /> New User
          </button>
        </Link>
      </div>

      <TableToolbar search={search} onSearch={setSearch} placeholder="Search users...">
        <select
          value={roleFilter}
          onChange={(event) => {
            setRoleFilter(event.target.value);
            setPage(1);
          }}
          aria-label="Filter by role"
        >
          <option value="all">All roles</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="viewer">Viewer</option>
        </select>
      </TableToolbar>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && users.length === 0 && <p>No users found.</p>}

      {users.length > 0 && (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th scope="col">
                    <SortButton label="Username" sortKey="username" sort={sort} onSort={toggleSort} />
                  </th>
                  <th scope="col">
                    <SortButton label="Display name" sortKey="displayName" sort={sort} onSort={toggleSort} />
                  </th>
                  <th scope="col">
                    <SortButton label="Role" sortKey="role" sort={sort} onSort={toggleSort} />
                  </th>
                  <th scope="col">
                    <SortButton label="Status" sortKey="isActive" sort={sort} onSort={toggleSort} />
                  </th>
                  <th scope="col" className="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((user) => (
                  <tr key={user.id}>
                    <td className="cell-code">{user.username}</td>
                    <td className="cell-name">{user.displayName}</td>
                    <td>
                      <span className={`role-badge role-${user.role}`}>{user.role}</span>
                    </td>
                    <td>
                      <span className={`status-badge status-${user.isActive ? 'active' : 'inactive'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <div className="table-actions">
                        <Link to={`/users/${user.id}/edit`}>
                          <Icon name="pencil" /> Edit
                        </Link>
                        <button className="button-destructive" type="button" onClick={() => removeUser(user)}>
                          <Icon name="trash" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}
    </>
  );
}

export default UsersPage;
