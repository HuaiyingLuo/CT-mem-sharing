import { useState, useEffect} from 'react';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import firebaseApp from '../firebase';
import "@/styles/globals.css";
import Head from "next/head";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Link from "next/link";
import { Analytics } from '@vercel/analytics/react';

export default function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // We track the auth state to reset firebaseUi if the user signs out.
    return onAuthStateChanged(getAuth(firebaseApp), user => {
      setUser(user)
    });
  }, [])

  return (
    <div  class="has-background-white">
        <Head>
          <title>CT Memory Sharing</title>
          <meta name="description" content="CT Memory Sharing" />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css"></link>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>
        </Head>
        <NavBar user={user}/>
        <div class="columns">
          <div class="column is-2 has-background-white">
            <aside class="menu">
              <ul class="menu-list">
                <li><Link href="/addpost"><p class="subtitle">Add a Post</p></Link></li>
                <li><Link href="/myposts"><p class="subtitle">My Posts</p></Link></li>
              </ul>
            </aside>
          </div>
          <div class="column">
            <div className="pt-12">
              <Component user={user} {...pageProps} />
            </div>
          </div>
          <Analytics />
        </div>
        <Footer />
      
    </div>
  );
}