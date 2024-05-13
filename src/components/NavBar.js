import Link from "next/link";
import { getAuth } from "firebase/auth";
import firebaseApp from "../firebase";

const NavBar = (props) => {

    const onSignOutClicked = () => {
        const auth = getAuth(firebaseApp);
        auth.signOut()
    }

  return (
    <nav
      class="navbar"
      role="navigation"
      aria-label="main navigation"
      style={{ borderBottom: "1px solid lightgrey" }}
    >
      <div class="navbar-brand">
        <Link class="navbar-item title" href="/">
          Cornell Tech Memory Sharing
        </Link>
      </div>
      <div className="navbar-menu">
        <div className="navbar-start"></div>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
          {props.user ? 
              <div>
                <span style={{ paddingRight: '10px' }}>{`Signed in as ${props?.user?.displayName}`}</span>
                <button class="button is-black" onClick={() => onSignOutClicked()}>Sign Out</button>
              </div> :
              <div>
                <Link href="/login"><button class="button is-info"> Sign In</button></Link>
              </div> 
            }
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
