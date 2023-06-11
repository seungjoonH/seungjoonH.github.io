import Link from 'next/link';
import '../styles/globals.css';

export const metadata = {
  title: 'SJ\'s Blog',
  description: 'SJ의 블로그입니다',
}

export default function RootLayout({ children }: {
  children: React.ReactNode
}) {
  const header = (
    <header>
      <div className='title'>
        <Link href="/">SJ's Blog</Link>
      </div>
      <ul className='nav'>
        <li>
          <Link href="/profile">Profile</Link>
        </li>
        <li>
          <Link href="/posts">Posts</Link>
        </li>
      </ul>
    </header>
  );

  const footer = (
    <footer>
      {/* <div>
        <h3>Developed by Jack</h3>
      </div> */}
    </footer>
  )

  return (
    <html lang="en">
      <head/>
      <body>
        {header}
        {children}
        {footer}
      </body>
    </html>
  )
}