import {Link} from "react-router-dom";

function UsersPage() {
  return <div>
    <h1>Users Bongo</h1>
    <p>Lorem Ipsum ahahdk</p>
    <small>smalltext</small>
    <br/>
    <i>kdfjkdls</i>
    <Link to="/users/new">
      <button type="button">New User</button>
    </Link>
    <br/>
    <b>bbbbbbbbb</b>
  </div>;
}

export default UsersPage;
